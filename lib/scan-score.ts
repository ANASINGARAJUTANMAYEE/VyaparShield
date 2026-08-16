export type ScanSeverity = "critical" | "high" | "medium" | "low" | "info";

const weight: Record<ScanSeverity, number> = { critical: 25, high: 15, medium: 8, low: 3, info: 0 };

export function scoreFindings(findings: ReadonlyArray<{ severity: ScanSeverity }>) {
  return Math.max(0, 100 - findings.reduce((total, finding) => total + weight[finding.severity], 0));
}
