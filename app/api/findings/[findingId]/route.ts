import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { databaseError, validationError } from "../../../../lib/api";
import { requireUser } from "../../../../lib/auth";

const updateSchema = z.object({ remediationStatus: z.enum(["open", "fixed", "accepted_risk"]) });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ findingId: string }> }) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const { findingId } = await params;
  const isFixed = parsed.data.remediationStatus === "fixed";
  const { data, error } = await result.supabase.from("findings").update({
    remediation_status: parsed.data.remediationStatus,
    marked_fixed_at: isFixed ? new Date().toISOString() : null,
    marked_fixed_by: isFixed ? result.user.id : null,
  }).eq("id", findingId).select("id, remediation_status, marked_fixed_at").single();
  if (error || !data) return databaseError(error?.message ?? "Finding not found or cannot be updated.");
  return NextResponse.json({ finding: data });
}
