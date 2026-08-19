"use client";

import { useState } from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import { Modal } from "../components/Modal";

/* ── Types ── */
type TargetStatus = "verified" | "scanning" | "pending";
interface Target {
  id: string;
  host: string;
  icon: string;
  status: TargetStatus;
  meta: string;
}

const INITIAL_TARGETS: Target[] = [
  { id: "1", host: "shop.vyapar-shield-demo.com", icon: "language", status: "verified", meta: "Last scanned: 2 days ago · High Priority Asset" },
  { id: "2", host: "192.168.1.45",            icon: "dns",      status: "scanning", meta: "Scan started 5 minutes ago · Internal IP" },
  { id: "3", host: "staging.vyapar-shield-demo.com", icon: "language", status: "pending", meta: "Added today · Requires DNS record setup" },
];

/* ── Status badge ── */
function StatusBadge({ status }: { status: TargetStatus }) {
  const map: Record<TargetStatus, { icon: string; label: string; bg: string; color: string; border: string }> = {
    verified: { icon: "check_circle", label: "Verified",          bg: "#f2f7f6", color: "var(--color-primary)",          border: "1px solid rgba(0,97,94,0.1)" },
    scanning: { icon: "sync",         label: "Scan In Progress",  bg: "var(--color-surface-container-high)", color: "var(--color-primary)", border: "1px solid rgba(0,97,94,0.1)" },
    pending:  { icon: "pending",      label: "Pending Verification", bg: "var(--color-surface-variant)",  color: "var(--color-on-surface-variant)", border: "1px solid var(--color-outline-variant)" },
  };
  const { icon, label, bg, color, border } = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: bg, color, border, padding: "2px 10px", borderRadius: "var(--radius-full)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
      <span className={`material-symbols-outlined${status === "scanning" ? " spin" : ""}`} style={{ fontSize: "12px" }}>{icon}</span>
      {label}
    </span>
  );
}

/* ── Target card row ── */
function TargetCard({
  target, onRemove, onScan, onStop, onHistory, onVerify,
}: {
  target: Target;
  onRemove: (id: string) => void;
  onScan: (id: string) => void;
  onStop: (id: string) => void;
  onHistory: (host: string) => void;
  onVerify: (host: string) => void;
}) {
  const [removing, setRemoving] = useState(false);

  function handleRemove() {
    setRemoving(true);
    setTimeout(() => onRemove(target.id), 320);
  }

  return (
    <div
      className="card"
      style={{
        padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)",
        opacity: removing ? 0 : target.status === "pending" ? 0.85 : 1,
        transform: removing ? "translateX(30px)" : "none",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", background: target.status === "pending" ? "var(--color-surface-variant)" : "var(--color-surface-container-low)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: target.status === "pending" ? "var(--color-secondary)" : "var(--color-primary)" }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: "24px" }}>{target.icon}</span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", flexWrap: "wrap", marginBottom: "4px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "var(--color-on-surface)" }}>{target.host}</h3>
            <StatusBadge status={target.status} />
          </div>
          <p className="text-label-sm" style={{ margin: 0, color: "var(--color-secondary)" }}>{target.meta}</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", borderTop: "1px solid var(--color-outline-variant)", paddingTop: "var(--spacing-md)" }}>
        {target.status === "verified" && (
          <>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onHistory(target.host)}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>history</span>
              View History
            </button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onScan(target.id)}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>radar</span>
              Run Scan
            </button>
          </>
        )}
        {target.status === "scanning" && (
          <>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onHistory(target.host)}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>history</span>
              View History
            </button>
            <button className="btn" style={{ flex: 1, justifyContent: "center", background: "var(--color-surface-variant)", color: "var(--color-secondary)" }} onClick={() => onStop(target.id)}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>stop_circle</span>
              Stop Scan
            </button>
          </>
        )}
        {target.status === "pending" && (
          <>
            <button className="btn" style={{ flex: 1, justifyContent: "center", background: "transparent", color: "var(--color-primary)", border: "1px solid var(--color-primary)" }} onClick={() => onVerify(target.host)}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>key</span>
              Complete Verification
            </button>
            <button className="btn" style={{ flex: 1, justifyContent: "center", background: "transparent", color: "var(--color-error)" }} onClick={handleRemove}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
              Remove
            </button>
          </>
        )}
        <button aria-label="More options"
          style={{ padding: "8px", borderRadius: "var(--radius-md)", background: "none", border: "none", cursor: "pointer", color: "var(--color-secondary)", display: "flex", alignItems: "center" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-error-container)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-secondary)"; }}>
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function TargetsPage() {
  const toast = useToast();
  const [targets, setTargets] = useState<Target[]>(INITIAL_TARGETS);
  const [domain, setDomain] = useState("");
  const [consented, setConsented] = useState(false);
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const [verifying, setVerifying] = useState(false);
  const [historyHost, setHistoryHost] = useState<string | null>(null);
  const [verifyHost, setVerifyHost] = useState<string | null>(null);
  const token = "vyapar-shield-verify=Xk9mQ2aB7rPzLdTy";

  function handleScan(id: string) {
    setTargets((prev) => prev.map((t) => t.id === id ? { ...t, status: "scanning" as const, meta: "Scan started just now · Running checks…" } : t));
    toast(`Scan started for ${targets.find(t => t.id === id)?.host}`, "success");
  }

  function handleStop(id: string) {
    setTargets((prev) => prev.map((t) => t.id === id ? { ...t, status: "verified" as const, meta: "Scan stopped · Last full scan: 2 days ago" } : t));
    toast("Scan stopped", "info");
  }
  const filtered = targets.filter((t) => {
    if (filter === "all") return true;
    if (filter === "verified") return t.status === "verified" || t.status === "scanning";
    return t.status === "pending";
  });

  function handleAdd() {
    if (!domain.trim() || !consented) return;
    setTargets((prev) => [
      ...prev,
      { id: String(Date.now()), host: domain.trim(), icon: "language", status: "pending", meta: "Added just now · Requires DNS record setup" },
    ]);
    setDomain("");
    setConsented(false);
  }

  function handleRemove(id: string) {
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }

  const verifiedCount = targets.filter((t) => t.status === "verified" || t.status === "scanning").length;
  const pendingCount  = targets.filter((t) => t.status === "pending").length;

  return (
    <>
      <TopBar />

      <main style={{ flex: 1, maxWidth: "1200px", marginInline: "auto", width: "100%", padding: "var(--spacing-xl) var(--margin-mobile)", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>

        {/* Page header */}
        <div>
          <h1 className="text-headline-lg" style={{ margin: "0 0 6px", color: "var(--color-on-surface)" }}>Target Assets</h1>
          <p className="text-body-md" style={{ margin: 0, color: "var(--color-secondary)", maxWidth: "640px" }}>
            Manage and verify the domains and IP addresses associated with your business to keep them secure.
          </p>
        </div>

        {/* Add target form */}
        <section className="card" style={{ padding: "var(--spacing-xl)" }}>
          <h2 className="text-headline-md" style={{ margin: "0 0 var(--spacing-lg)", color: "var(--color-on-surface)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>add_circle</span>
            Add New Target
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            {/* Input row */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              <label className="text-label-sm" htmlFor="domain-input" style={{ color: "var(--color-on-surface-variant)", display: "block" }}>
                Domain or IP Address
              </label>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)", fontSize: "22px", pointerEvents: "none" }}>language</span>
                <input
                  id="domain-input"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="e.g., mybusiness.com or 192.168.1.1"
                  style={{
                    width: "100%", paddingLeft: "44px", paddingRight: "16px", paddingBlock: "12px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-outline-variant)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-on-surface)",
                    fontSize: "16px",
                    fontFamily: "var(--font-family)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-outline-variant)")}
                />
              </div>
            </div>

            {/* Consent + button */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", cursor: "pointer", fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  style={{ accentColor: "var(--color-primary)", width: "16px", height: "16px", cursor: "pointer" }}
                />
                I confirm I own or have permission to scan this target.
              </label>
              <button
                className="btn btn-primary"
                disabled={!domain.trim() || !consented}
                onClick={handleAdd}
                style={{ alignSelf: "flex-start", opacity: (!domain.trim() || !consented) ? 0.5 : 1, cursor: (!domain.trim() || !consented) ? "not-allowed" : "pointer" }}
              >
                Verify Ownership
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>verified_user</span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-surface-container-low)", padding: "var(--spacing-sm)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-outline-variant)" }}>
            <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
              {(["all", "verified", "pending"] as const).map((f) => {
                const label = f === "all" ? `All Assets (${targets.length})` : f === "verified" ? `Verified (${verifiedCount})` : `Pending (${pendingCount})`;
                const isActive = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 16px", borderRadius: "var(--radius-full)", fontSize: "12px", fontWeight: 700,
                      border: isActive ? "1px solid var(--color-primary)" : "1px solid transparent",
                      background: isActive ? "var(--color-surface-container-lowest)" : "transparent",
                      color: isActive ? "var(--color-primary)" : "var(--color-secondary)",
                      boxShadow: isActive ? "var(--shadow-raised)" : "none",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--color-secondary)", fontSize: "13px", fontWeight: 500 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>sort</span>
              <span>Sort</span>
            </button>
          </div>

          {/* Target cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            {filtered.length === 0 ? (
              <div className="card" style={{ padding: "var(--spacing-2xl)", textAlign: "center", color: "var(--color-secondary)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", display: "block", marginBottom: "var(--spacing-md)", color: "var(--color-outline)" }}>inbox</span>
                <p className="text-body-md">No targets in this category. Add one above.</p>
              </div>
            ) : (
              filtered.map((t) => (
                <TargetCard key={t.id} target={t}
                  onRemove={handleRemove}
                  onScan={handleScan}
                  onStop={handleStop}
                  onHistory={(host) => setHistoryHost(host)}
                  onVerify={(host) => setVerifyHost(host)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 768px) {
          main { padding-inline: var(--margin-desktop) !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1.2s linear infinite; }
      `}</style>

      {/* History modal */}
      <Modal open={!!historyHost} onClose={() => setHistoryHost(null)} title={`Scan History — ${historyHost}`} maxWidth="520px">
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { date: "Oct 24, 2024", score: 72, badge: "2 issues", badgeColor: "#dc2626", badgeBg: "#fef2f2", icon: "warning" },
            { date: "Oct 10, 2024", score: 68, badge: "4 issues", badgeColor: "#d97706", badgeBg: "#fef3c7", icon: "error" },
            { date: "Sep 26, 2024", score: 80, badge: "1 issue", badgeColor: "#16a34a", badgeBg: "#f0fdf4", icon: "check_circle" },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--color-outline-variant)" : "none" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: item.badgeBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: "20px", color: item.badgeColor }}>{item.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-on-surface)" }}>{item.date}</div>
                <div style={{ fontSize: "13px", color: "var(--color-secondary)" }}>Score: {item.score}/100</div>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: item.badgeBg, color: item.badgeColor }}>{item.badge}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Verification modal */}
      <Modal open={!!verifyHost} onClose={() => setVerifyHost(null)} title="Complete Domain Verification" maxWidth="520px">
        <p style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--color-secondary)", lineHeight: 1.6 }}>
          To verify ownership of <strong>{verifyHost}</strong>, add the token below to your DNS or host the verification file.
        </p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {(["DNS TXT record", "File upload"] as const).map((tab, i) => (
            <button key={tab} style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, border: i === 0 ? "1px solid var(--color-primary)" : "1px solid var(--color-outline-variant)", background: i === 0 ? "var(--color-primary-container)" : "transparent", color: i === 0 ? "var(--color-on-primary)" : "var(--color-secondary)", cursor: "pointer" }}>{tab}</button>
          ))}
        </div>
        <div style={{ background: "#1e1e1e", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px", fontFamily: "monospace", fontSize: "13px", color: "#d4d4d4" }}>
          <div style={{ color: "#9cdcfe", marginBottom: "4px" }}>Type: TXT</div>
          <div style={{ color: "#9cdcfe", marginBottom: "4px" }}>Name: @</div>
          <div>Value: <span style={{ color: "#ce9178" }}>{token}</span></div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
          onClick={() => { toast(`Verification token generated for ${verifyHost}`, "success"); setVerifyHost(null); }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check_circle</span>
          I have added the token — Verify now
        </button>
      </Modal>
    </>
  );
}
