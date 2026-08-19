import { NextRequest, NextResponse } from "next/server";
import { databaseError } from "../../../../../lib/api";
import { requireUser } from "../../../../../lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ scanId: string }> }) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const { scanId } = await params;
  const { data: scan, error: scanError } = await result.supabase.from("scans")
    .select("id, status, score, completed_at, scope_version, target_id")
    .eq("id", scanId).single();
  if (scanError || !scan) return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  if (scan.status !== "completed") return NextResponse.json({ error: "A report is available only after the scan completes." }, { status: 409 });
  const [{ data: target, error: targetError }, { data: findings, error: findingsError }] = await Promise.all([
    result.supabase.from("targets").select("hostname, canonical_origin").eq("id", scan.target_id).single(),
    result.supabase.from("findings").select("id, rule_id, category, severity, title, evidence, owner_explanation, developer_guidance, remediation_status").eq("scan_id", scanId),
  ]);
  if (targetError || findingsError || !target) return databaseError(targetError?.message ?? findingsError?.message ?? "Report data is unavailable.");
  return NextResponse.json({
    report: {
      title: "Vyapar Shield — Security Health Check",
      target,
      score: scan.score,
      completedAt: scan.completed_at,
      scopeVersion: scan.scope_version,
      disclaimer: "This is a consented, low-impact configuration assessment. It is not a penetration test, compliance certification, or guarantee of security.",
      findings,
    },
  });
}
