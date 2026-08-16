import { NextRequest, NextResponse } from "next/server";
import { audit } from "../../../../../lib/audit";
import { databaseError } from "../../../../../lib/api";
import { requireUser } from "../../../../../lib/auth";
import { CURRENT_SCAN_SCOPE } from "../../../../../lib/scan-policy";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ targetId: string }> }) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const { targetId } = await params;
  const { data, error } = await result.supabase.from("scans")
    .select("id, status, score, started_at, completed_at, error_code, created_at")
    .eq("target_id", targetId)
    .order("created_at", { ascending: false });
  if (error) return databaseError(error.message);
  return NextResponse.json({ scans: data });
}

export async function POST(_request: NextRequest, { params }: { params: Promise<{ targetId: string }> }) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const { targetId } = await params;
  const { data: target, error: targetError } = await result.supabase.from("targets")
    .select("id, business_id, status")
    .eq("id", targetId).single();
  if (targetError || !target) return NextResponse.json({ error: "Target not found." }, { status: 404 });
  if (target.status !== "verified") return NextResponse.json({ error: "Target ownership must be verified before scanning." }, { status: 409 });
  const { data: consent, error: consentError } = await result.supabase.from("scan_consents")
    .select("id")
    .eq("target_id", targetId)
    .eq("user_id", result.user.id)
    .eq("scope_version", CURRENT_SCAN_SCOPE)
    .is("revoked_at", null)
    .limit(1)
    .maybeSingle();
  if (consentError) return databaseError(consentError.message);
  if (!consent) return NextResponse.json({ error: "Current scan consent is required." }, { status: 409 });
  const { data: scan, error } = await result.supabase.from("scans").insert({
    target_id: targetId,
    requested_by: result.user.id,
    status: "queued",
    scope_version: CURRENT_SCAN_SCOPE,
    scanner_version: "worker-contract-v1",
  }).select("id, status, created_at").single();
  if (error || !scan) return databaseError(error?.message ?? "Scan could not be queued.");
  await audit(result.supabase, { actorId: result.user.id, businessId: target.business_id, targetId, eventType: "scan.queued", metadata: { scanId: scan.id, scopeVersion: CURRENT_SCAN_SCOPE } });
  return NextResponse.json({ scan }, { status: 202 });
}
