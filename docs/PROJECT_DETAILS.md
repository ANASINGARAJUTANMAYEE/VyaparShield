# Vyapar Shield — Project details

## Elevator pitch

Vyapar Shield gives Indian small businesses a safe, affordable cybersecurity health check. It assesses only verified assets with explicit consent and translates results into the next action an owner or developer should take.

## Challenge alignment

**Challenge:** Omni_CyberTech_2 — Affordable Cybersecurity Assessment for Small Businesses.

**Response:** A guided assessment platform that reduces cost and complexity without pretending to replace a professional penetration test.

## Primary scenario

Sakshi owns KiranaKart, a small online store managed by a freelance developer. The business handles contact details and payments, but Sakshi cannot interpret TLS settings, headers, cookies, or exposed test configuration. Vyapar Shield verifies her staging domain, obtains consent, runs safe checks, explains priority fixes in Hinglish, and produces a developer-ready remediation list. After a fix, a re-scan confirms what improved.

## Value proposition

| Audience | Value |
|---|---|
| Owner | “What is exposed, what matters most, and what can I fix today?” |
| Developer | Evidence, affected technical control, remediation guidance, retest status |
| Consultant | Repeatable client workflow and auditable results |
| Judge | Safety gate, real backend model, measurable before/after story |

## Differentiators

1. **Consent-gated by design:** verification and scope acceptance precede every scan.
2. **Evidence-to-action:** each finding has paired owner and developer explanations.
3. **Multilingual communication:** English, Hindi, and Hinglish support.
4. **Safe scope:** configuration posture checks rather than offensive testing.
5. **Fix and verify:** re-scan comparison proves progress.

## Technology summary

- **App/API:** Next.js 15, React, TypeScript.
- **Authentication/database:** Supabase Auth and PostgreSQL with row-level security.
- **Validation:** Zod.
- **Testing:** Vitest.
- **Background execution:** service-role worker contract, durable PostgreSQL queue, isolated egress-controlled scanner.

## Existing repository structure

```text
app/                 Next.js pages and route handlers
lib/                 auth, Supabase clients, policies, crypto, scoring
supabase/migrations/ PostgreSQL schema and atomic worker-claim function
workers/             worker contract, processor, fixture executor, persistence adapter
tests/               unit tests
docs/                product, design, feasibility, and implementation documentation
```

## Responsible-security statement

Vyapar Shield is not an exploit platform. It does not attempt passwords, brute force, exploitation, recursive crawling, subdomain enumeration, port scans, or targets without verified ownership. Its production worker must run independently of the web app and use strict outbound controls.

## Demo narrative

1. Show Sakshi’s KiranaKart business profile.
2. Register and verify the controlled demonstration domain.
3. Show consent and low-impact scope.
4. Start assessment and display a high-priority cookie/configuration finding.
5. Switch between Hinglish owner explanation and developer guidance.
6. Mark a prepared fix and run re-scan.
7. Show score improvement and export report.

## Current project state

The repository contains a buildable application prototype and backend foundation. Automated tests, lint, and production build currently pass. A Supabase project and an egress-controlled real scan executor remain deployment prerequisites.

