import { allowedChecks, CURRENT_SCAN_SCOPE } from "../lib/scan-policy";

export type ScanJob = {
  scanId: string;
  targetId: string;
  canonicalOrigin: string;
  hostname: string;
  scopeVersion: typeof CURRENT_SCAN_SCOPE;
};

export type WorkerFinding = {
  ruleId: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  evidence: Record<string, string | number | boolean>;
  ownerExplanation: { English: string; Hindi: string; Hinglish: string };
  developerGuidance: string;
  /** Estimated remediation effort — surfaced in the dashboard finding list. */
  effort?: "5 min" | "15 min" | "30 min" | "1–2 hrs";
};

export type IsolatedScanExecutor = {
  run(job: ScanJob, checks: readonly (typeof allowedChecks)[number][]): Promise<WorkerFinding[]>;
};

// Production implementation belongs behind the egress-controlled worker described in README.md.
// This explicit interface prevents API routes from becoming an accidental scanning engine.
