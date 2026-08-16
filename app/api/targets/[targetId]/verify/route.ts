import { NextRequest, NextResponse } from "next/server";
import { audit } from "../../../../../lib/audit";
import { databaseError } from "../../../../../lib/api";
import { requireUser } from "../../../../../lib/auth";
import { verifyDnsTxt } from "../../../../../lib/verification";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ targetId: string }> }) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const { targetId } = await params;
  const { data: target, error } = await result.supabase.from("targets")
    .select("id, business_id, hostname, verification_token_hash, status")
    .eq("id", targetId).single();
  if (error || !target) return NextResponse.json({ error: "Target not found." }, { status: 404 });
  if (target.status === "verified") return NextResponse.json({ target: { id: target.id, status: target.status }, alreadyVerified: true });
  const check = await verifyDnsTxt(target.hostname, target.verification_token_hash);
  const { error: recordError } = await result.supabase.from("target_verifications").insert({
    target_id: target.id,
    method: "dns_txt",
    result: check.success ? "success" : "failed",
    evidence: { recordCount: check.recordCount },
    verified_by: result.user.id,
  });
  if (recordError) return databaseError(recordError.message);
  if (!check.success) return NextResponse.json({ error: "Verification token was not found in DNS TXT records.", retryable: true }, { status: 422 });
  const { data: verified, error: updateError } = await result.supabase.from("targets").update({ status: "verified", verified_at: new Date().toISOString(), verified_by: result.user.id }).eq("id", target.id).select("id, hostname, status, verified_at").single();
  if (updateError || !verified) return databaseError(updateError?.message ?? "Target could not be verified.");
  await audit(result.supabase, { actorId: result.user.id, businessId: target.business_id, targetId, eventType: "target.verified", metadata: { method: "dns_txt" } });
  return NextResponse.json({ target: verified });
}
