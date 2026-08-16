import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkerFinding } from "./scan-contract";
import type { ScanPersistence } from "./processor";

export function createSupabaseScanStore(client: SupabaseClient): ScanPersistence {
  return {
    async replaceFindings(scanId: string, findings: WorkerFinding[]) {
      const { error: deleteError } = await client.from("findings").delete().eq("scan_id", scanId);
      if (deleteError) throw new Error("findings_delete_failed");
      if (findings.length === 0) return;
      const { error: insertError } = await client.from("findings").insert(findings.map((finding) => ({
        scan_id: scanId,
        rule_id: finding.ruleId,
        category: finding.category,
        severity: finding.severity,
        title: finding.title,
        evidence: finding.evidence,
        owner_explanation: finding.ownerExplanation,
        developer_guidance: finding.developerGuidance,
      })));
      if (insertError) throw new Error("findings_insert_failed");
    },
    async completeScan(scanId: string, score: number) {
      const { error } = await client.from("scans").update({ status: "completed", score, completed_at: new Date().toISOString() }).eq("id", scanId);
      if (error) throw new Error("scan_complete_failed");
    },
    async failScan(scanId: string, errorCode: string) {
      const { error } = await client.from("scans").update({ status: "failed", error_code: errorCode, completed_at: new Date().toISOString() }).eq("id", scanId);
      if (error) throw new Error("scan_failure_record_failed");
    },
  };
}
