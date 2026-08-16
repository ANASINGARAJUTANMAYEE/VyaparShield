import { z } from "zod";
import { createSupabaseAdminClient } from "../lib/supabase/admin";
import { CURRENT_SCAN_SCOPE } from "../lib/scan-policy";
import type { IsolatedScanExecutor } from "./scan-contract";
import { processClaimedScan } from "./processor";
import { createSupabaseScanStore } from "./supabase-store";

const claimedJobSchema = z.object({
  scan_id: z.string().uuid(),
  target_id: z.string().uuid(),
  canonical_origin: z.string().url(),
  hostname: z.string().min(1),
  scope_version: z.string(),
});

export async function runOneQueuedScan(workerId: string, executor: IsolatedScanExecutor) {
  const client = createSupabaseAdminClient();
  const { data, error } = await client.rpc("claim_next_scan", { worker_id: workerId });
  if (error) throw new Error("scan_claim_failed");
  const row = Array.isArray(data) ? data[0] : undefined;
  if (!row) return { status: "idle" as const };
  const parsed = claimedJobSchema.safeParse(row);
  if (!parsed.success) throw new Error("invalid_claimed_scan");
  const job = {
    scanId: parsed.data.scan_id,
    targetId: parsed.data.target_id,
    canonicalOrigin: parsed.data.canonical_origin,
    hostname: parsed.data.hostname,
    scopeVersion: parsed.data.scope_version as typeof CURRENT_SCAN_SCOPE,
  };
  return processClaimedScan(job, executor, createSupabaseScanStore(client));
}
