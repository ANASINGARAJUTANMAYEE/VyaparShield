import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { audit } from "../../../lib/audit";
import { databaseError, validationError } from "../../../lib/api";
import { requireUser } from "../../../lib/auth";

const businessSchema = z.object({
  name: z.string().trim().min(1).max(160),
  industry: z.string().trim().max(100).optional(),
  employeeRange: z.string().trim().max(40).optional(),
  handlesCustomerData: z.boolean().default(false),
  acceptsOnlinePayments: z.boolean().default(false),
});

export async function GET() {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const { data, error } = await result.supabase
    .from("businesses")
    .select("id, name, industry, employee_range, handles_customer_data, accepts_online_payments, created_at")
    .order("created_at", { ascending: false });
  if (error) return databaseError(error.message);
  return NextResponse.json({ businesses: data });
}

export async function POST(request: NextRequest) {
  const result = await requireUser();
  if ("error" in result) return result.error;
  const parsed = businessSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;
  const { data: business, error } = await result.supabase.from("businesses").insert({
    name: input.name,
    industry: input.industry ?? null,
    employee_range: input.employeeRange ?? null,
    handles_customer_data: input.handlesCustomerData,
    accepts_online_payments: input.acceptsOnlinePayments,
    created_by: result.user.id,
  }).select("id, name").single();
  if (error || !business) return databaseError(error?.message ?? "Business was not created.");
  const { error: membershipError } = await result.supabase.from("business_members").insert({ business_id: business.id, user_id: result.user.id, role: "owner" });
  if (membershipError) return databaseError(membershipError.message);
  await audit(result.supabase, { actorId: result.user.id, businessId: business.id, eventType: "business.created" });
  return NextResponse.json({ business }, { status: 201 });
}
