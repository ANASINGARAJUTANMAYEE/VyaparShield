import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { audit } from "../../../lib/audit";
import { databaseError, uuid, validationError } from "../../../lib/api";
import { requireUser } from "../../../lib/auth";
import { createVerificationToken, hashToken } from "../../../lib/crypto";
import { validateTargetUrl } from "../../../lib/target-policy";

const createTargetSchema = z.object({ businessId: uuid, url: z.string().trim().min(1).max(2048) });

export async function GET(request: NextRequest) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const businessId = request.nextUrl.searchParams.get("businessId");
  if (!businessId || !uuid.safeParse(businessId).success) return NextResponse.json({ error: "A valid businessId is required." }, { status: 400 });
  const { data, error } = await result.supabase.from("targets")
    .select("id, business_id, canonical_origin, hostname, status, verified_at, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) return databaseError(error.message);
  return NextResponse.json({ targets: data });
}

export async function POST(request: NextRequest) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const parsed = createTargetSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const validated = validateTargetUrl(parsed.data.url);
  if (!validated.valid) return NextResponse.json({ error: validated.reason }, { status: 400 });
  const token = createVerificationToken();
  const { data: target, error } = await result.supabase.from("targets").insert({
    business_id: parsed.data.businessId,
    canonical_origin: validated.origin,
    hostname: validated.hostname,
    verification_token_hash: hashToken(token),
  }).select("id, canonical_origin, hostname, status, created_at").single();
  if (error || !target) return databaseError(error?.message ?? "Target was not created.");
  await audit(result.supabase, { actorId: result.user.id, businessId: parsed.data.businessId, targetId: target.id, eventType: "target.registered", metadata: { hostname: target.hostname } });
  return NextResponse.json({ target, verification: { method: "dns_txt", recordName: validated.hostname, value: token } }, { status: 201 });
}
