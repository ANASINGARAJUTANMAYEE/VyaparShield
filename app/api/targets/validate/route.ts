import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth";
import { validateTargetUrl } from "../../../../lib/target-policy";

export async function POST(request: NextRequest) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;
  const body = (await request.json()) as { url?: string };
  const result = validateTargetUrl(body.url ?? "");
  return NextResponse.json(result, { status: result.valid ? 200 : 400 });
}
