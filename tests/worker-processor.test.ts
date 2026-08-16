import { describe, expect, it, vi } from "vitest";
import { CURRENT_SCAN_SCOPE } from "../lib/scan-policy";
import { processClaimedScan, type ScanPersistence } from "../workers/processor";
import { fixtureExecutor } from "../workers/fixture-executor";

function store(): ScanPersistence {
  return { replaceFindings: vi.fn(), completeScan: vi.fn(), failScan: vi.fn() };
}

describe("processClaimedScan", () => {
  it("stores normalised results and final score", async () => {
    const persistence = store();
    const result = await processClaimedScan({ scanId: "scan-1", targetId: "target-1", canonicalOrigin: "https://demo.example", hostname: "demo.example", scopeVersion: CURRENT_SCAN_SCOPE }, fixtureExecutor, persistence);
    expect(result).toEqual({ status: "completed", score: 85, findings: 1 });
    expect(persistence.replaceFindings).toHaveBeenCalledOnce();
    expect(persistence.completeScan).toHaveBeenCalledWith("scan-1", 85);
  });

  it("rejects jobs created under a different consent scope", async () => {
    const persistence = store();
    const result = await processClaimedScan({ scanId: "scan-1", targetId: "target-1", canonicalOrigin: "https://demo.example", hostname: "demo.example", scopeVersion: "retired-scope" as typeof CURRENT_SCAN_SCOPE }, fixtureExecutor, persistence);
    expect(result).toEqual({ status: "failed", reason: "unsupported_scope_version" });
    expect(persistence.failScan).toHaveBeenCalledWith("scan-1", "unsupported_scope_version");
  });
});
