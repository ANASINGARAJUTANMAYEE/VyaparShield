import { NextRequest, NextResponse } from "next/server";
import { validateTargetUrl } from "../../../../lib/target-policy";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { url?: string };
  const result = validateTargetUrl(body.url ?? "");
  return NextResponse.json(result, { status: result.valid ? 200 : 400 });
}
