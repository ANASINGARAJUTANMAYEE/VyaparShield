import { resolveTxt } from "node:dns/promises";
import { tokenMatches } from "./crypto";

export async function verifyDnsTxt(hostname: string, tokenHash: string) {
  try {
    const records = await resolveTxt(hostname);
    const values = records.map((chunks) => chunks.join(""));
    return { success: values.some((record) => tokenMatches(record, tokenHash)), recordCount: values.length };
  } catch {
    return { success: false, recordCount: 0 };
  }
}
