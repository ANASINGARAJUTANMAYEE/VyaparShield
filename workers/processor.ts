import { scoreFindings, type ScanSeverity } from "../lib/scan-score";
import { allowedChecks, CURRENT_SCAN_SCOPE } from "../lib/scan-policy";
import type { IsolatedScanExecutor, ScanJob, WorkerFinding } from "./scan-contract";

export type ClaimedScan = ScanJob;

export type ScanPersistence = {
  replaceFindings(scanId: string, findings: WorkerFinding[]): Promise<void>;
  completeScan(scanId: string, score: number): Promise<void>;
  failScan(scanId: string, errorCode: string): Promise<void>;
};

export async function processClaimedScan(job: ClaimedScan, executor: IsolatedScanExecutor, store: ScanPersistence) {
  if (job.scopeVersion !== CURRENT_SCAN_SCOPE) {
    await store.failScan(job.scanId, "unsupported_scope_version");
    return { status: "failed" as const, reason: "unsupported_scope_version" };
  }
  try {
    const findings = await executor.run(job, allowedChecks);
    const score = scoreFindings(findings as Array<{ severity: ScanSeverity }>);
    await store.replaceFindings(job.scanId, findings);
    await store.completeScan(job.scanId, score);
    return { status: "completed" as const, score, findings: findings.length };
  } catch {
    await store.failScan(job.scanId, "assessment_failed");
    return { status: "failed" as const, reason: "assessment_failed" };
  }
}
