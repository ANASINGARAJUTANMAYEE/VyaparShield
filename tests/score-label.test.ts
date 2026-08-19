import { describe, expect, it } from "vitest";
import { scoreLabel, calculateScore, severityCount } from "../lib/assessment";
import type { Finding } from "../lib/types";

const finding = (severity: Finding["severity"], status: Finding["status"]): Finding => ({
  id: `${severity}-${status}`,
  severity,
  status,
  category: "Test",
  title: "Test finding",
  evidence: "evidence",
  owner: { English: "owner", Hindi: "owner", Hinglish: "owner" },
  developer: "developer",
  effort: "5 min",
});

describe("scoreLabel", () => {
  it("returns 'Strong baseline' for score >= 85", () => {
    expect(scoreLabel(100)).toBe("Strong baseline");
    expect(scoreLabel(85)).toBe("Strong baseline");
  });

  it("returns 'Needs attention' for score 70–84", () => {
    expect(scoreLabel(84)).toBe("Needs attention");
    expect(scoreLabel(70)).toBe("Needs attention");
  });

  it("returns 'High risk' for score 50–69", () => {
    expect(scoreLabel(69)).toBe("High risk");
    expect(scoreLabel(50)).toBe("High risk");
  });

  it("returns 'Fix urgent risks' for score 30–49", () => {
    expect(scoreLabel(49)).toBe("Fix urgent risks");
    expect(scoreLabel(30)).toBe("Fix urgent risks");
  });

  it("returns 'Critical — act now' for score below 30", () => {
    expect(scoreLabel(29)).toBe("Critical — act now");
    expect(scoreLabel(0)).toBe("Critical — act now");
  });
});

describe("severityCount", () => {
  it("counts only open findings of the given severity", () => {
    const findings = [
      finding("High", "Open"),
      finding("High", "Fixed"),
      finding("Medium", "Open"),
    ];
    expect(severityCount(findings, "High")).toBe(1);
    expect(severityCount(findings, "Medium")).toBe(1);
    expect(severityCount(findings, "Low")).toBe(0);
  });
});

describe("calculateScore — extended", () => {
  it("returns 100 when all findings are fixed", () => {
    expect(calculateScore([finding("Critical", "Fixed"), finding("High", "Fixed")])).toBe(100);
  });

  it("deducts correctly for a mix of severities", () => {
    // High(15) + Medium(8) = 23 deduction → 77
    expect(calculateScore([finding("High", "Open"), finding("Medium", "Open")])).toBe(77);
  });
});
