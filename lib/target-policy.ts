// The scan worker must also resolve DNS immediately before every outbound request,
// then reject any result in private, loopback, link-local, or metadata ranges.
// This URL-level gate is an early defence; it is not sufficient against DNS rebinding.
const blockedHostnames = new Set(["localhost", "metadata.google.internal"]);

export type TargetValidation = { valid: true; hostname: string; origin: string } | { valid: false; reason: string };

export function validateTargetUrl(input: string): TargetValidation {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { valid: false, reason: "Enter a complete HTTPS website address." };
  }
  if (url.protocol !== "https:") return { valid: false, reason: "Only HTTPS targets are accepted." };
  if (url.username || url.password || url.port) return { valid: false, reason: "Credentials and custom ports are not allowed." };
  if (blockedHostnames.has(url.hostname) || isPrivateIpv4(url.hostname) || isUnsafeIpv6(url.hostname)) {
    return { valid: false, reason: "Local, private, and metadata targets are never scannable." };
  }
  return { valid: true, hostname: url.hostname, origin: url.origin };
}

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part))) return false;
  const numbers = parts.map(Number);
  if (numbers.some((part) => part > 255)) return true;
  return numbers[0] === 0 || numbers[0] === 10 || numbers[0] === 127 || numbers[0] >= 224 || (numbers[0] === 100 && numbers[1] >= 64 && numbers[1] <= 127) || (numbers[0] === 169 && numbers[1] === 254) || (numbers[0] === 172 && numbers[1] >= 16 && numbers[1] <= 31) || (numbers[0] === 192 && numbers[1] === 168);
}

function isUnsafeIpv6(hostname: string): boolean {
  const value = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return value === "::1" || value === "::" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb");
}
