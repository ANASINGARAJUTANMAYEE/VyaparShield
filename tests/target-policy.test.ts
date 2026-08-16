import { describe, expect, it } from "vitest";
import { validateTargetUrl } from "../lib/target-policy";

describe("validateTargetUrl", () => {
  it("accepts a normal HTTPS origin", () => {
    expect(validateTargetUrl("https://shop.example.in/path")).toEqual({ valid: true, hostname: "shop.example.in", origin: "https://shop.example.in" });
  });

  it("rejects local, private and non-HTTPS targets", () => {
    expect(validateTargetUrl("http://shop.example.in").valid).toBe(false);
    expect(validateTargetUrl("https://localhost").valid).toBe(false);
    expect(validateTargetUrl("https://192.168.1.20").valid).toBe(false);
    expect(validateTargetUrl("https://100.64.0.1").valid).toBe(false);
    expect(validateTargetUrl("https://[::1]").valid).toBe(false);
  });
});
