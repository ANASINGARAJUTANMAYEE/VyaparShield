import type { Finding, Severity } from "./types";

export const severityWeight: Record<Severity, number> = {
  Critical: 25,
  High: 15,
  Medium: 8,
  Low: 3,
};

export const sampleFindings: Finding[] = [
  {
    id: "cookie-secure",
    severity: "High",
    category: "Session security",
    title: "Session cookie is missing the Secure flag",
    evidence: "Set-Cookie: session=…; HttpOnly; SameSite=Lax",
    owner: {
      English: "Customer login sessions could be exposed on an unsafe network. Ask your developer to secure the session cookie.",
      Hindi: "असुरक्षित नेटवर्क पर ग्राहक के लॉगिन सत्र उजागर हो सकते हैं। अपने डेवलपर से सेशन कुकी सुरक्षित करने को कहें।",
      Hinglish: "Unsafe network par customer login session expose ho sakta hai. Developer se session cookie secure karne ko boliye.",
    },
    developer: "Set the Secure attribute on all authentication cookies and serve the application exclusively over HTTPS.",
    effort: "15 min",
    status: "Open",
  },
  {
    id: "hsts",
    severity: "Medium",
    category: "HTTPS protection",
    title: "HSTS header is not enabled",
    evidence: "Strict-Transport-Security header was not present on the homepage response.",
    owner: {
      English: "Browsers are not being told to always use a secure connection to your site.",
      Hindi: "ब्राउज़र को आपकी साइट के लिए हमेशा सुरक्षित कनेक्शन इस्तेमाल करने का निर्देश नहीं मिल रहा है।",
      Hinglish: "Browser ko hamesha secure connection use karne ka instruction nahi mil raha hai.",
    },
    developer: "Add Strict-Transport-Security: max-age=31536000; includeSubDomains after confirming every subdomain supports HTTPS.",
    effort: "5 min",
    status: "Open",
  },
  {
    id: "frame-protection",
    severity: "Medium",
    category: "Browser protection",
    title: "Frame protection is missing",
    evidence: "Neither CSP frame-ancestors nor X-Frame-Options was returned.",
    owner: {
      English: "Your site could be placed inside a deceptive page designed to trick customers into clicking.",
      Hindi: "आपकी साइट को किसी भ्रामक पेज के अंदर रखकर ग्राहकों को धोखा दिया जा सकता है।",
      Hinglish: "Aapki site ko deceptive page ke andar rakhkar customers ko trick kiya ja sakta hai.",
    },
    developer: "Set Content-Security-Policy: frame-ancestors 'self'; or use X-Frame-Options: DENY where framing is not needed.",
    effort: "15 min",
    status: "Open",
  },
  {
    id: "mixed-content",
    severity: "Medium",
    category: "Page resources",
    title: "One page resource loads over HTTP",
    evidence: "Homepage contains <img src=\"http://cdn.example.test/banner.jpg\">.",
    owner: {
      English: "Part of your page is loading without encryption, which weakens customer trust and page security.",
      Hindi: "आपके पेज का एक हिस्सा एन्क्रिप्शन के बिना लोड हो रहा है, जिससे सुरक्षा कमजोर होती है।",
      Hinglish: "Page ka ek part encryption ke bina load ho raha hai, isse security weak hoti hai.",
    },
    developer: "Change all asset URLs to HTTPS or use protocol-relative/internal URLs. Add CSP upgrade-insecure-requests as defence in depth.",
    effort: "30 min",
    status: "Open",
  },
  {
    id: "nosniff",
    severity: "Low",
    category: "Browser protection",
    title: "X-Content-Type-Options is missing",
    evidence: "X-Content-Type-Options header was not present.",
    owner: {
      English: "A small browser protection is missing. It is quick for your developer to add.",
      Hindi: "ब्राउज़र की एक छोटी सुरक्षा सेटिंग गायब है। इसे जोड़ना आसान है।",
      Hinglish: "Browser ki ek chhoti security setting missing hai. Developer ise jaldi add kar sakta hai.",
    },
    developer: "Set X-Content-Type-Options: nosniff on all HTML and asset responses.",
    effort: "5 min",
    status: "Open",
  },
];

export function calculateScore(findings: Finding[]): number {
  const deduction = findings
    .filter((finding) => finding.status === "Open")
    .reduce((total, finding) => total + severityWeight[finding.severity], 0);
  return Math.max(0, 100 - deduction);
}

export function severityCount(findings: Finding[], severity: Severity): number {
  return findings.filter((finding) => finding.severity === severity && finding.status === "Open").length;
}

export function scoreLabel(score: number): string {
  if (score >= 85) return "Strong baseline";
  if (score >= 65) return "Needs attention";
  return "Fix urgent risks";
}
