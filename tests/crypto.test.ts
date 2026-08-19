import { describe, expect, it } from "vitest";
import { tokenMatches, hashToken } from "../lib/crypto";

describe("tokenMatches", () => {
  it("returns true for a matching token and its hash", () => {
    const token = "vyapar-shield-verify=abc123";
    const hash = hashToken(token);
    expect(tokenMatches(token, hash)).toBe(true);
  });

  it("returns false for a non-matching token", () => {
    const hash = hashToken("vyapar-shield-verify=correct-token");
    expect(tokenMatches("vyapar-shield-verify=wrong-token", hash)).toBe(false);
  });

  it("returns false for an empty expectedHash (LOOP-5 guard)", () => {
    expect(tokenMatches("any-token", "")).toBe(false);
  });

  it("returns false for a corrupted/short expectedHash (LOOP-5 guard)", () => {
    expect(tokenMatches("any-token", "abc123")).toBe(false);
  });

  it("returns false for a null-like expectedHash string (LOOP-5 guard)", () => {
    // Simulates a null stored as an empty string in the DB
    expect(tokenMatches("any-token", "null")).toBe(false);
    expect(tokenMatches("any-token", "undefined")).toBe(false);
  });

  it("returns false for a 63-char hex string (one char short of 64)", () => {
    const almostValid = "a".repeat(63);
    expect(tokenMatches("any-token", almostValid)).toBe(false);
  });

  it("accepts a full 64-char hex string as a valid hash format", () => {
    const token = "vyapar-shield-verify=test";
    const validHash = hashToken(token); // always 64 hex chars from sha256
    expect(validHash).toHaveLength(64);
    expect(tokenMatches(token, validHash)).toBe(true);
  });
});
