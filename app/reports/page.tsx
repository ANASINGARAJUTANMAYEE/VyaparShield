"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import { Modal } from "../components/Modal";

/* ── Types ── */
type RiskLevel = "high" | "medium" | "healthy";

interface Finding {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  action: string;
  devDetails?: string; // pre-formatted code string
}

const FINDINGS: Finding[] = [
  {
    id: "f1",
    level: "high",
    title: "Outdated CMS Version",
    description:
      "Your website is running an older version of its content management system. This exposes your site to known vulnerabilities that automated bots frequently target.",
    action:
      "Log into your website dashboard and apply the latest updates. If you have a web developer, share this report with them so they can handle the update safely.",
    devDetails: `Detected: WordPress 5.8.3
CVEs: CVE-2022-21661, CVE-2022-21662
Action: Update core to >= 5.8.4 via WP-CLI:
wp core update`,
  },
  {
    id: "f2",
    level: "medium",
    title: "Missing Security Headers",
    description:
      "Your website is missing some standard configuration settings that help protect visitors from malicious scripts and fake content.",
    action:
      "This usually requires a small configuration change on your web server. It's best to pass this to your hosting provider or web developer.",
    devDetails: `Missing: Strict-Transport-Security, X-Content-Type-Options
Action: Add to Nginx server block:
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;`,
  },
  {
    id: "f3",
    level: "healthy",
    title: "SSL Certificate Valid",
    description:
      "Your website's secure connection (HTTPS) is properly configured and up to date. Visitors can securely browse your site without interception warnings.",
    action: "",
  },
];

/* ── Risk colour map ── */
const RISK_COLOURS: Record<RiskLevel, { bar: string; badge: string; badgeText: string; iconBg: string; iconColor: string; hover: string; label: string; icon: string }> = {
  high:    { bar: "var(--color-error)",  badge: "var(--color-error-container)",   badgeText: "var(--color-on-error-container)", iconBg: "var(--color-error-container)", iconColor: "var(--color-error)",   hover: "var(--color-error)",   label: "HIGH RISK",   icon: "warning" },
  medium:  { bar: "#f59e0b",            badge: "#fef3c7",                          badgeText: "#92400e",                       iconBg: "#fef3c7",                       iconColor: "#d97706",              hover: "#f59e0b",              label: "MEDIUM RISK", icon: "error" },
  healthy: { bar: "#10b981",            badge: "#d1fae5",                          badgeText: "#065f46",                       iconBg: "#d1fae5",                       iconColor: "#059669",              hover: "#10b981",              label: "HEALTHY",     icon: "check_circle" },
};

/* ── Finding card ── */
function FindingCard({ finding }: { finding: Finding }) {
  const [devOpen, setDevOpen] = useState(false);
  const c = RISK_COLOURS[finding.level];

  return (
    <div
      className="card"
      style={{ position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = c.hover)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-outline-variant)")}
    >
      {/* Left severity bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "100%", background: c.bar }} />

      <div style={{ padding: "var(--spacing-xl)", paddingLeft: "calc(var(--spacing-xl) + 6px)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--spacing-md)", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-full)", background: c.iconBg, color: c.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined fill">{c.icon}</span>
            </div>
            <h3 className="text-headline-md" style={{ margin: 0, color: "var(--color-on-background)" }}>{finding.title}</h3>
          </div>
          <span className="chip" style={{ background: c.badge, color: c.badgeText }}>{c.label}</span>
        </div>

        {/* Description */}
        <p className="text-body-md" style={{ margin: "0 0 var(--spacing-lg)", color: "var(--color-secondary)" }}>{finding.description}</p>

        {/* Action box */}
        {finding.action && (
          <div style={{ background: "var(--color-surface-container-low)", borderRadius: "var(--radius-md)", padding: "var(--spacing-lg)", border: "1px solid var(--color-outline-variant)" }}>
            <h4 className="text-label-caps" style={{ margin: "0 0 var(--spacing-sm)", color: "var(--color-primary)" }}>What to do next</h4>
            <p className="text-body-md" style={{ margin: "0 0 var(--spacing-md)", color: "var(--color-on-surface-variant)" }}>{finding.action}</p>

            {finding.devDetails && (
              <div style={{ borderTop: "1px solid var(--color-outline-variant)", paddingTop: "var(--spacing-md)" }}>
                <button
                  onClick={() => setDevOpen(!devOpen)}
                  style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", fontSize: "13px", fontWeight: 500, padding: 0 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>code</span>
                  {devOpen ? "Hide" : "View"} Developer Details
                </button>
                {devOpen && (
                  <div style={{ marginTop: "var(--spacing-md)", background: "#1e1e1e", borderRadius: "var(--radius-md)", padding: "var(--spacing-md)", overflowX: "auto" }}>
                    <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "13px", color: "#d4d4d4", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {finding.devDetails}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Score gauge ── */
function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 15.9155;
  const dashArray = `${score}, 100`;

  return (
    <div style={{ position: "relative", width: "160px", height: "160px", marginBottom: "var(--spacing-md)" }}>
      <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-surface-variant)" strokeWidth="3" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeDasharray={dashArray} strokeLinecap="round" strokeWidth="3" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="text-display" style={{ lineHeight: 1, color: "var(--color-on-background)" }}>{score}</span>
        <span className="text-label-sm" style={{ color: "var(--color-secondary)" }}>/100</span>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function ReportsPage() {
  const router = useRouter();
  const toast = useToast();
  const [shareOpen, setShareOpen] = useState(false);
  const [rescanning, setRescanning] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/reports?target=acme-corp.com` : "/reports?target=acme-corp.com";

  function handleDownload() {
    toast("Preparing PDF…", "info");
    setTimeout(() => { window.print(); toast("Report ready to save", "success"); }, 500);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => toast("Link copied to clipboard!", "success"));
  }

  function handleRescan() {
    setRescanning(true);
    toast("Re-scan queued for acme-corp.com", "info");
    setTimeout(() => { setRescanning(false); router.push("/targets"); }, 2000);
  }
  return (
    <>
      <TopBar />

      <main style={{ flex: 1, maxWidth: "1200px", marginInline: "auto", width: "100%", padding: "var(--spacing-xl) var(--margin-mobile)", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>

        {/* Page header */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--spacing-md)", borderBottom: "1px solid var(--color-outline-variant)", paddingBottom: "var(--spacing-xl)" }}>
          <div>
            <p className="text-label-caps" style={{ margin: "0 0 4px", color: "var(--color-secondary)" }}>DETAILED SCAN RESULTS</p>
            <h1 className="text-headline-lg" style={{ margin: "0 0 8px", color: "var(--color-primary)" }}>
              Health Report for <span style={{ color: "var(--color-on-background)" }}>acme-corp.com</span>
            </h1>
            <p className="text-body-md" style={{ margin: 0, color: "var(--color-secondary)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>calendar_today</span>
              Last scanned: October 24, 2024 at 14:32 PST
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-sm)" }}>
            <button className="btn btn-secondary" onClick={handleDownload}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
              Download PDF
            </button>
            <button className="btn btn-secondary" onClick={() => setShareOpen(true)}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>share</span>
              Share with Developer
            </button>
            <button className="btn btn-primary" onClick={handleRescan} disabled={rescanning}
              style={{ opacity: rescanning ? 0.7 : 1, display: "flex", alignItems: "center", gap: "6px" }}>
              <span className={`material-symbols-outlined${rescanning ? " spin" : ""}`} style={{ fontSize: "18px" }}>refresh</span>
              {rescanning ? "Queueing…" : "Re-scan"}
            </button>
          </div>
        </section>

        {/* Two-column bento */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--spacing-lg)" }} className="reports-grid">

          {/* Left: Risk breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <h2 className="text-headline-md" style={{ margin: 0, color: "var(--color-on-surface)" }}>Risk Breakdown</h2>
            {FINDINGS.map((f) => <FindingCard key={f.id} finding={f} />)}
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>

            {/* Score widget */}
            <div className="card" style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <h3 className="text-headline-md" style={{ margin: "0 0 var(--spacing-lg)", color: "var(--color-on-surface)" }}>Overall Score</h3>
              <ScoreGauge score={72} />
              <p className="text-body-md" style={{ margin: 0, color: "var(--color-secondary)" }}>Fair. Action required to secure your domain.</p>
            </div>

            {/* Security promise */}
            <div style={{ background: "var(--color-surface-container-low)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-outline-variant)", padding: "var(--spacing-lg)", position: "relative", overflow: "hidden" }}>
              <span className="material-symbols-outlined fill" style={{ position: "absolute", top: "var(--spacing-md)", right: "var(--spacing-md)", fontSize: "64px", color: "var(--color-primary)", opacity: 0.08 }}>shield</span>
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>verified_user</span>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>Our Security Promise</h4>
                </div>
                <p className="text-body-md" style={{ margin: 0, color: "var(--color-on-surface-variant)", lineHeight: 1.7, fontSize: "14px" }}>
                  These scans are purely observational. We do not attempt to breach your systems, alter your data, or disrupt your services. We look at what the public internet sees to help you close the gaps before malicious actors find them.
                </p>
              </div>
            </div>

            {/* Target details */}
            <div className="card" style={{ padding: "var(--spacing-lg)" }}>
              <h4 style={{ margin: "0 0 var(--spacing-md)", fontSize: "18px", fontWeight: 700, color: "var(--color-on-surface)" }}>Target Details</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                {[
                  { label: "IP Address", value: "192.168.1.104", mono: true },
                  { label: "Hosting",    value: "AWS West",       mono: false },
                  { label: "Scan Type",  value: "External Blackbox", mono: false },
                ].map(({ label, value, mono }, i, arr) => (
                  <li
                    key={label}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < arr.length - 1 ? "var(--spacing-sm)" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--color-surface-variant)" : "none" }}
                  >
                    <span className="text-label-sm" style={{ color: "var(--color-secondary)" }}>{label}</span>
                    <span style={{ fontSize: "14px", color: "var(--color-on-background)", fontFamily: mono ? "monospace" : "var(--font-family)" }}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 768px) {
          main { padding-inline: var(--margin-desktop) !important; }
          .reports-grid { grid-template-columns: 2fr 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; display: inline-block; }
        @media print {
          header, footer, .no-print { display: none !important; }
          main { padding: 0 !important; }
        }
      `}</style>

      {/* Share modal */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share Report with Developer">
        <p style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--color-secondary)", lineHeight: 1.6 }}>
          Copy the link below and send it to your developer. They will be able to view the full technical details of this report.
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
          <input
            readOnly value={shareUrl}
            style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--color-outline-variant)", background: "var(--color-surface-container-low)", fontSize: "13px", fontFamily: "monospace", color: "var(--color-on-surface)", outline: "none" }}
          />
          <button className="btn btn-primary" onClick={handleCopyLink} style={{ whiteSpace: "nowrap" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>content_copy</span>
            Copy link
          </button>
        </div>
        <p style={{ margin: "16px 0 0", fontSize: "12px", color: "var(--color-secondary)" }}>
          The link is read-only and does not expose any credentials or internal data.
        </p>
      </Modal>
    </>
  );
}
