import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { audit } from "../../../../../lib/audit";
import { databaseError, validationError } from "../../../../../lib/api";
import { requireUser } from "../../../../../lib/auth";
import { CURRENT_SCAN_SCOPE } from "../../../../../lib/scan-policy";

const consentSchema = z.object({ accepted: z.literal(true) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ targetId: string }> }) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const body = consentSchema.safeParse(await request.json());
  if (!body.success) return validationError(body.error);
  const { targetId } = await params;
  const { data: target, error: targetError } = await result.supabase.from("targets").select("id, business_id, status").eq("id", targetId).single();
  if (targetError || !target) return NextResponse.json({ error: "Target not found." }, { status: 404 });
  if (target.status !== "verified") return NextResponse.json({ error: "Verify target ownership before granting scan consent." }, { status: 409 });
  const { data: consent, error } = await result.supabase.from("scan_consents").insert({
    target_id: targetId,
    user_id: result.user.id,
    scope_version: CURRENT_SCAN_SCOPE,
    user_agent: request.headers.get("user-agent"),
  }).select("id, accepted_at, scope_version").single();
  if (error || !consent) return databaseError(error?.message ?? "Consent was not recorded.");
  await audit(result.supabase, { actorId: result.user.id, businessId: target.business_id, targetId, eventType: "scan.consent_granted", metadata: { scopeVersion: CURRENT_SCAN_SCOPE } });
  return NextResponse.json({ consent }, { status: 201 });
}
