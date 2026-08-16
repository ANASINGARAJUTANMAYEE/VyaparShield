# Scan worker boundary

The Next.js application only records a consented scan request in `public.scans`. A separate worker, in a separate runtime/network boundary, is responsible for processing it.

The worker must use an egress proxy that enforces all of the following at connection time (not merely before DNS resolution):

- only the previously verified hostname and TCP 443;
- public IP addresses only; deny loopback, private, link-local, multicast, and cloud-metadata ranges for IPv4 and IPv6;
- GET/HEAD only, a small fixed URL/path allowlist, no credentials, no client certificate, no form submission;
- no redirects to a different hostname/IP; low request count, strict timeout, response-size cap;
- no password attempts, exploits, port scans, recursive crawling, or subdomain discovery.

When complete, the worker writes normalised findings, a 0–100 score, scanner version, and completion timestamp. It must mark failed jobs with a non-sensitive error code/message and preserve the original consent scope version.

Never run the worker in the public web-app process or with unrestricted cloud-network access.
