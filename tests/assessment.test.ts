import { describe, expect, it } from "vitest";
import { calculateScore } from "../lib/assessment";
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

describe("calculateScore", () => {
  it("deducts only open risks", () => {
    expect(calculateScore([finding("High", "Open"), finding("Medium", "Open"), finding("Low", "Fixed")])).toBe(77);
  });

  it("never returns a negative score", () => {
    expect(calculateScore(Array.from({ length: 10 }, () => finding("Critical", "Open")))).toBe(0);
  });
});
