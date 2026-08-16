# CyberSure MSME — Detailed implementation plan

## Success criteria

The MVP is complete when a signed-in business user can register a target, prove ownership, record consent, queue a low-impact scan, see normalised owner/developer findings, mark a finding fixed, re-scan, and export a report.

## Phase 1 — Project and database foundation

**Deliverables**

- Next.js + TypeScript project with linting and Vitest.
- Supabase Auth integration and session refresh middleware.
- Database migrations for profiles, businesses, memberships, targets, verification records, consent, scans, findings, and audit events.
- Row-level security policies that isolate each business workspace.

**Acceptance checks**

- New auth users receive a profile automatically.
- Business owner can create a business and initial membership.
- Users cannot read targets or scans from another business.
- `npm run lint`, `npm test`, and `npm run build` pass.

## Phase 2 — Target registration and ownership proof

| Method and path | Function |
|---|---|
| `POST /api/businesses` | Create business and owner membership |
| `GET /api/businesses` | List accessible businesses |
| `POST /api/targets` | Validate HTTPS target and issue a one-time DNS token |
| `GET /api/targets?businessId=` | List targets for a business |
| `POST /api/targets/:targetId/verify` | Verify DNS TXT ownership |

**Rules**

- Store only a hash of the verification token.
- Require HTTPS, no credentials or custom ports.
- Reject private, local, metadata, carrier-grade NAT, link-local, multicast, and unsafe IPv6 addresses.
- Keep DNS verification evidence limited to method and record count; do not store token text in an audit event.

**Acceptance checks**

- Unverified target cannot be scanned.
- Token never appears in a target listing response.
- A failed verification attempt is recorded.

## Phase 3 — Consent and durable job queue

| Method and path | Function |
|---|---|
| `POST /api/targets/:targetId/consent` | Record explicit agreement to current scope |
| `GET /api/targets/:targetId/scans` | List target scan history |
| `POST /api/targets/:targetId/scans` | Queue scan after verified ownership and consent |

**Rules**

- Include scan scope version in every consent and scan.
- A database function claims queued jobs with `FOR UPDATE SKIP LOCKED` so two workers cannot process the same scan.
- The public app only queues work; it never performs remote assessment.

## Phase 4 — Isolated assessment worker

1. Use the service-role key only in the worker environment.
2. Atomically claim a queued scan.
3. Use an egress-controlled executor restricted to verified hostname, HTTPS port 443, GET/HEAD, fixed path allowlist, small response/body limits, no cross-host redirects, low request count, and strict timeouts.
4. Run allowed low-impact checks only.
5. Normalise results, calculate score, write findings, and complete or fail the scan.

| Rule ID | Evidence | Severity guide |
|---|---|---|
| `tls-certificate` | Validity and protocol state | High |
| `security-headers` | HSTS, CSP, `nosniff`, frame protection | Medium / Low |
| `cookie-attributes` | `Secure`, `HttpOnly`, `SameSite` | High / Medium |
| `mixed-content` | HTTP assets on HTTPS page | Medium |
| `fixed-debug-indicators` | Only documented safe path signatures | High |

**Acceptance checks**

- Fixture executor runs with no network access for demo/testing.
- Worker persists evidence, language strings, developer guidance, and score.
- Errors are non-sensitive codes such as `assessment_failed`; stack traces/secrets are never returned to users.

## Phase 5 — Findings, re-scan, and reports

| Method and path | Function |
|---|---|
| `PATCH /api/findings/:findingId` | Mark open, fixed, or accepted risk |
| `GET /api/scans/:scanId/report` | Return completed report data |

- Owner view explains customer/business impact in selected language.
- Developer view shows evidence and an exact remediation action.
- “Mark fixed” updates status; it is not proof of resolution until a future scan confirms it.
- Re-scan comparison groups resolved, persisting, and new findings.

## Phase 6 — Frontend integration

Use [STITCH_FRONTEND_PROMPTS.md](./STITCH_FRONTEND_PROMPTS.md) to generate visual screens. Map generated UI to the APIs in phases 2–5. Keep forms inactive until required conditions are met: verified target → current consent → scan job.

## Phase 7 — Deployment checklist

1. Create Supabase project and execute migrations in order.
2. Create `.env.local` from `.env.example`; keep service-role key only in worker infrastructure.
3. Deploy Next.js app with HTTPS.
4. Deploy worker independently, behind egress restrictions.
5. Configure Supabase Auth redirect URL for `/auth/callback`.
6. Run production smoke test using controlled vulnerable and remediated demo sites.
7. Rotate secrets before production and after any exposure.

## Test plan

- Unit: target policy, token hashing, score calculation, stale scope rejection.
- Integration: ownership gate, consent requirement, scan queue, finding update, report access.
- Authorisation: user A cannot access user B’s business/target/scan/finding.
- Worker: claim race, failed executor, empty findings, result persistence.
- Manual demo: verify, consent, fixture scan, mark fixed, re-scan, report export.

## Current implementation status

| Area | Status |
|---|---|
| Project shell, tests, lint, build | Complete |
| Supabase schema and RLS migrations | Complete |
| Auth session/callback plumbing | Complete |
| Target, verification, consent, scan, finding, report APIs | Complete |
| Isolated worker contract and fixture processor | Complete |
| Real outbound scan executor | Pending — requires egress-controlled deployment |
| Supabase project configuration | Pending — requires project credentials |
| Stitch-generated UI integration | Pending |
