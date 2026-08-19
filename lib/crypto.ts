import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createVerificationToken() {
  return `vyapar-shield-verify=${randomBytes(18).toString("base64url")}`;
}

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function tokenMatches(value: string, expectedHash: string) {
  // Guard: a SHA-256 hex digest is always exactly 64 hex characters.
  // Reject corrupted or empty hashes immediately (no timing leak — both paths are constant-time reject).
  if (!/^[0-9a-f]{64}$/i.test(expectedHash)) return false;
  const actual = Buffer.from(hashToken(value), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
