export const CURRENT_SCAN_SCOPE = "2026-08-low-impact-v1";

export const allowedChecks = [
  "tls-certificate",
  "https-availability",
  "security-headers",
  "cookie-attributes",
  "mixed-content",
  "fixed-debug-indicators",
] as const;

export const prohibitedChecks = [
  "authentication attempts",
  "password attacks",
  "brute forcing",
  "exploit delivery",
  "recursive crawling",
  "subdomain enumeration",
  "network port scanning",
] as const;
