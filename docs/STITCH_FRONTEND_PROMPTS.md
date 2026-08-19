# Vyapar Shield — Stitch frontend prompts

## Shared design system

```text
Design a modern responsive SaaS web app called “Vyapar Shield”, an affordable cybersecurity health-check platform for Indian small businesses.

Visual style: trustworthy, calm, premium but simple; not a hacker-style interface. Use a clean white background, soft mint-gray panels, deep teal (#047C78) as primary, dark navy-green text (#12252B), warm orange for warnings, muted red for high risks, and soft green for resolved items. Use rounded 12–16px cards, subtle borders, soft shadows, spacious layout, clear hierarchy, accessible contrast, and friendly plain language.

Typography: modern sans-serif such as Inter or Manrope. Use clear bold headings, compact uppercase labels, readable body text. Avoid dense technical dashboards.

Desktop frame: fixed top navigation, max content width around 1200px, 3-column layouts only where useful. Mobile design should stack cards cleanly.

Brand: small teal shield/diamond mark, “Vyapar Shield” in bold and “MSME” as a small teal label. Navigation items: Dashboard, Targets, Reports. On the right: language selector, profile avatar.

Important product principles visible in UI: consent-gated scans, only verified domains, no intrusive testing, owner-friendly language, and developer-ready remediation.
```

## Screen 1 — Landing / welcome page

```text
Create a polished SaaS landing page for Vyapar Shield.

Hero heading: “Know what is exposed. Fix what matters first.”
Subheading: “Vyapar Shield turns confusing website security risks into a verified, prioritised action plan for small businesses.”

Include a primary CTA “Start free security check”, a secondary CTA “See how it works”, and a trust badge “Consent-gated, low-impact scans”. Add three benefit cards: “Verify before scanning”, “Simple fixes first”, and “Developer-ready evidence”. Add a small dashboard preview on the right showing score 61/100 and three findings. Include a “Built for Indian MSMEs” section with English, Hindi, and Hinglish chips, plus a footer with Privacy, Safe Scanning Policy, and Contact.

Use a warm, professional cybersecurity design; do not use skulls, matrix code, or dark hacker visuals.
```

## Screen 2 — Business onboarding

```text
Design the Vyapar Shield onboarding screen, step 1 of 3.

Title: “Tell us about your business”
Subtitle: “This helps us explain security risks in a way that matches your business.”

Use a centered form card with a progress indicator: Step 1 Business profile → Step 2 Verify website → Step 3 Consent and scan.

Fields: Business name “KiranaKart”; Industry dropdown “Retail / E-commerce”; Team size “1–10 people”; Does your business accept online payments? Yes / No; Does your website store customer information? Yes / No; Preferred language: English, Hindi, Hinglish.

Add: “Your answers help prioritise findings. Vyapar Shield does not sell business data.” Primary button: “Continue to website verification”. Show a small right-side illustration of a small business storefront connected to a secure shield.
```

## Screen 3 — Website verification

```text
Design the Vyapar Shield target verification screen, step 2 of 3.

Title: “Verify a website you own”
Subtitle: “We only assess websites you explicitly prove you own or are authorised to manage.”

Show a website URL input containing https://store.kiranakart.in and a primary “Generate verification token” button.

After generation, show a highlighted token card: DNS TXT value or file content; Vyapar Shield-verify=8af32d91ce4b. Add tabs for “DNS TXT record” and “Verification file”; file location: https://store.kiranakart.in/.well-known/Vyapar Shield-verification.txt. Include “I have added the token” and a green success state: “store.kiranakart.in verified”.

Add a security note: “Vyapar Shield blocks private networks, localhost, unverified domains, password attacks, and intrusive testing.” Use clear visual instructions rather than technical clutter.
```

## Screen 4 — Consent and scan scope

```text
Design the Vyapar Shield consent screen, step 3 of 3.

Title: “Review and approve your security check”
Subtitle: “We will run only safe, time-bounded checks on your verified website.”

Use a two-column consent card. “We will check”: HTTPS and certificate configuration, security headers, cookie protection, mixed insecure content, public debug/configuration indicators, passive baseline alerts. “We will never do”: try passwords, brute-force logins, exploit vulnerabilities, crawl unrelated subdomains, scan unverified websites, or access private cloud accounts.

Include the required checkbox: “I confirm that I own or am authorised to assess store.kiranakart.in and approve this low-impact security assessment.” Primary CTA “Start security health check”; secondary text “Estimated time: under 2 minutes”. Use a shield illustration and a “Consent recorded” badge.
```

## Screen 5 — Scan in progress

```text
Design a scan progress screen for Vyapar Shield.

Title: “Checking your website safely”
Subtitle: “We are running low-impact checks on store.kiranakart.in.”

Show a large progress card at 72%. Checklist: Verified target ownership complete; Inspecting HTTPS certificate complete; Checking security headers complete; Reviewing cookie settings in progress; Checking page resources pending; Preparing your action plan pending.

Include safety notice: “Vyapar Shield is not attempting exploitation or accessing any private data.” Add “What happens next?”: “Your results will be translated into business-friendly actions and technical developer guidance.” Keep this screen uncluttered and reassuring.
```

## Screen 6 — Security dashboard

```text
Design the main Vyapar Shield security dashboard after a scan.

Top heading: “Good morning, Sakshi”. Subheading: “Here is the security health of KiranaKart.”

Show a primary score card: Security Health Score, 61 / 100, label “Needs attention”, text “5 actions can improve your website security.” Summary cards: 1 High risk, 3 Medium risks, 1 Low risk, Last scan: Just now.

Show ranked “Fix first” cards: High — Session cookie is missing the Secure flag — 15 min; Medium — HSTS header is not enabled — 5 min; Medium — Frame protection is missing — 15 min; Medium — One page resource loads over HTTP — 30 min; Low — X-Content-Type-Options is missing — 5 min.

Include “Run re-scan”, “Download report”, language toggle English / Hindi / Hinglish, and “No critical vulnerabilities were detected in this low-impact assessment.” Use teal for strong, orange for attention, and muted red only for high risk.
```

## Screen 7 — Finding detail: owner view

```text
Design a detailed finding page for Vyapar Shield in the business owner view.

Breadcrumb: Dashboard / Findings / Session security. Severity: High. Category: Session security. Title: “Session cookie is missing the Secure flag”. Estimated effort: 15 minutes.

Create a prominent owner explanation card: “Customer login sessions could be exposed on an unsafe network. Ask your developer to secure the session cookie.” Include “Why this matters”: “Customers may be at risk when using public Wi-Fi.” Include “What to do now”: “Send this fix to your web developer.” Buttons: “View developer guidance” and “Mark as fixed”. Status: “Needs action”.

At the bottom show: “This result is based on a low-impact configuration check and is not proof of an active breach.” Keep technical jargon hidden by default.
```

## Screen 8 — Finding detail: developer view

```text
Design the developer view for the same Vyapar Shield finding.

Title: “Session cookie is missing the Secure flag”. Severity: High. Category: Session security.

Show technical evidence in a code-style card: Set-Cookie: session=abc123; HttpOnly; SameSite=Lax.

Show a remediation card: “Set the Secure attribute on all authentication cookies and serve the application exclusively over HTTPS.” Show sample code: Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Lax.

Show Standard mapping: OWASP Session Management; Affected URL: https://store.kiranakart.in/login; First detected: Today, 10:42 AM; Status: Needs action. Buttons: “Mark fixed”, “Run re-scan”, “Back to all findings”. Keep it developer-friendly but clean.
```

## Screen 9 — Re-scan comparison

```text
Design a Vyapar Shield re-scan comparison page.

Title: “Your security health has improved”
Subtitle: “Comparison between the previous scan and today’s re-scan.”

Show Previous score 61, Current score 76, Improvement +15. Use three sections: Resolved — Session cookie is missing the Secure flag; HSTS header is not enabled. Still needs action — Frame protection is missing; One page resource loads over HTTP; X-Content-Type-Options is missing. New findings — No new findings detected.

Add: “Great progress. Your customer login sessions now have stronger protection.” Buttons: “Download updated report”, “View remaining fixes”, “Schedule another check”. Use success green for resolved items and amber for remaining actions.
```

## Screen 10 — Report export

```text
Design a Vyapar Shield report export page.

Title: “Security health report”
Subtitle: “A simple report for your business and developer.”

Show report preview inside a document-style card. Contents: Business KiranaKart; verified target store.kiranakart.in; assessment date 17 August 2026; score 76/100; summary “2 issues resolved, 3 actions remaining”; top remaining actions; owner-friendly explanations; developer appendix with evidence and remediation; assessment scope and safe-scanning disclaimer.

Export options: Download PDF, Download Markdown, Share with developer. Add: “This report is a security health check, not a compliance certificate or full penetration test.” Use a polished printable-document style.
```

