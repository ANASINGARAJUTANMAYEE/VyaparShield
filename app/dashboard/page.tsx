"use client";

import { useRouter } from "next/navigation";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";



/* ── Bento metric card ── */
function MetricCard({ icon, label, value, sub, accentColor, style }: {
  icon: string; label: string; value: string; sub: string;
  accentColor?: string; style?: React.CSSProperties;
}) {
  return (
    <div className="card" style={{ padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--spacing-sm)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
        <div style={{ background: accentColor ?? "var(--color-surface-container)", padding: "var(--spacing-sm)", borderRadius: "var(--radius-md)", color: "var(--color-primary)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>{icon}</span>
        </div>
        <span className="text-label-sm" style={{ color: "var(--color-secondary)" }}>{label}</span>
      </div>
      <div>
        <div style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.2, color: "var(--color-on-surface)" }}>{value}</div>
        <div style={{ fontSize: "14px", color: "var(--color-secondary)", marginTop: "4px" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ── Activity item ── */
function ActivityItem({ icon, iconBg, iconColor, title, sub, time, tag, tagColor, tagBg }: {
  icon: string; iconBg: string; iconColor: string;
  title: string; sub: string; time: string;
  tag: string; tagColor: string; tagBg: string;
}) {
  return (
    <div style={{
      padding: "var(--spacing-md) var(--spacing-lg)",
      borderBottom: "1px solid var(--color-surface-variant)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", transition: "background 0.15s",
    }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "var(--color-surface-container-low)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
        <div style={{ background: iconBg, padding: "var(--spacing-sm)", borderRadius: "var(--radius-full)", color: iconColor }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: "20px" }}>{icon}</span>
        </div>
        <div>
          <h4 className="text-label-sm" style={{ margin: 0, fontWeight: 600, fontSize: "15px", color: "var(--color-on-surface)" }}>{title}</h4>
          <p className="text-body-md" style={{ margin: 0, fontSize: "13px", color: "var(--color-secondary)" }}>{sub}</p>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <span style={{ display: "block", fontSize: "13px", color: "var(--color-secondary)" }}>{time}</span>
        <span style={{ display: "inline-block", marginTop: "4px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "4px", background: tagBg, color: tagColor }}>{tag}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const score = 85;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <>
      <TopBar />

      <main style={{ flex: 1, maxWidth: "1200px", marginInline: "auto", width: "100%", padding: "var(--spacing-xl) var(--margin-mobile)", display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>

        {/* ── Page header ── */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--spacing-md)" }}>
          <div>
            <h1 className="text-headline-lg" style={{ margin: "0 0 6px", color: "var(--color-primary)" }}>Welcome back, Horizon Cafe</h1>
            <p className="text-body-md" style={{ margin: 0, color: "var(--color-secondary)" }}>Your digital storefront is currently secure. Here&apos;s your overview.</p>
          </div>
          <button
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}
            onClick={() => { toast("Preparing report…", "info"); setTimeout(() => window.print(), 400); }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>download</span>
            Download Latest Report
          </button>
        </section>

        {/* ── Bento grid ── */}
        <section className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--spacing-lg)", alignItems: "start" }}>

          {/* ① Health score — col-span-5 on md, full-width on mobile */}
          <div
            className="card"
            style={{
              gridColumn: "span 12",
              padding: "var(--spacing-xl)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", position: "relative",
            }}
          >
            {/* Verified badge */}
            <div style={{
              position: "absolute", top: "var(--spacing-md)", right: "var(--spacing-md)",
              display: "flex", alignItems: "center", gap: "4px",
              background: "var(--color-surface-container-low)",
              padding: "4px 12px", borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-surface-variant)",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-primary)" }}>verified</span>
              <span className="text-label-caps" style={{ color: "var(--color-primary)" }}>Verified Status</span>
            </div>

            <h2 className="text-headline-md" style={{ alignSelf: "flex-start", margin: "0 0 var(--spacing-lg)", color: "var(--color-on-surface)" }}>Overall Health</h2>

            {/* Gauge */}
            <div style={{ position: "relative", width: "192px", height: "192px", marginBottom: "var(--spacing-md)" }}>
              <svg className="score-ring" viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-surface-variant)" strokeWidth="8" />
                <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-primary)" strokeWidth="8"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span className="text-display" style={{ color: "var(--color-primary)", lineHeight: 1 }}>{score}</span>
                <span className="text-label-caps" style={{ color: "var(--color-secondary)" }}>Good</span>
              </div>
            </div>
            <p className="text-body-md" style={{ margin: 0, color: "var(--color-secondary)", textAlign: "center", maxWidth: "320px" }}>
              Your systems are functioning normally with minor optimization suggestions.
            </p>
          </div>

          {/* ② Metrics column — always vertical */}
          <div style={{ gridColumn: "span 12", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
            <MetricCard icon="devices" label="Total Assets" value="4 Monitored" sub="2 Websites, 2 Networks" />
            <MetricCard icon="rule" label="Resolved Items" value="12 this month" sub="↑ Improved by 15%" />
          </div>

          {/* ③ Open Risks */}
          <div style={{ gridColumn: "span 12" }}>
            <div
              className="card"
              style={{
                padding: "var(--spacing-lg)",
                border: "1px solid var(--color-error-container)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
                height: "100%",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                  <div style={{ background: "var(--color-error-container)", padding: "var(--spacing-sm)", borderRadius: "var(--radius-md)", color: "var(--color-error)", display: "flex" }}>
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <span className="text-label-sm" style={{ color: "var(--color-secondary)" }}>Open Risks</span>
                </div>
                <span className="chip chip-high" style={{ fontSize: "10px" }}>Attention</span>
              </div>
              <div style={{ fontSize: "36px", fontWeight: 700, color: "var(--color-error)", lineHeight: 1.1 }}>2 Found</div>
              <button
                onClick={() => router.push("/reports")}
                style={{ color: "var(--color-error)", fontSize: "13px", fontWeight: 600, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, marginTop: "auto" }}
              >
                Review findings
              </button>
            </div>
          </div>
        </section>

        {/* ── Quick actions + Activity ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--spacing-xl)" }} className="actions-grid">

          {/* Quick Actions */}
          <div>
            <h2 className="text-headline-md" style={{ margin: "0 0 var(--spacing-md)", color: "var(--color-on-surface)" }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              {/* Start Scan */}
              <button
                style={{
                  background: "var(--color-primary-container)", color: "var(--color-on-primary)",
                  borderRadius: "var(--radius-xl)", padding: "var(--spacing-lg)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  height: "192px", textAlign: "left", border: "none", cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onClick={() => { toast("Opening targets…", "info"); router.push("/targets"); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = ""; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ background: "rgba(0,0,0,0.15)", padding: "var(--spacing-sm)", borderRadius: "var(--radius-md)" }}>
                    <span className="material-symbols-outlined fill">search_check</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ opacity: 0.5 }}>arrow_forward</span>
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700 }}>Start New Scan</h3>
                  <p style={{ margin: 0, fontSize: "14px", opacity: 0.9, display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>lock</span> Verified domains only
                  </p>
                </div>
              </button>

              {/* Add Target */}
              <button
                className="card"
                style={{
                  borderRadius: "var(--radius-xl)", padding: "var(--spacing-lg)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  height: "192px", textAlign: "left", border: "1px solid var(--color-surface-variant)", cursor: "pointer",
                  background: "var(--color-surface-container-lowest)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onClick={() => { toast("Add a target to get started", "info"); router.push("/targets"); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-surface-variant)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ background: "var(--color-surface-container)", padding: "var(--spacing-sm)", borderRadius: "var(--radius-md)", color: "var(--color-primary)" }}>
                    <span className="material-symbols-outlined">add_circle</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)", opacity: 0.5 }}>arrow_forward</span>
                </div>
                <div>
                  <h3 className="text-headline-md" style={{ margin: "0 0 4px", fontSize: "20px", color: "var(--color-on-surface)" }}>Add Target</h3>
                  <p className="text-body-md" style={{ margin: 0, fontSize: "14px", color: "var(--color-secondary)" }}>Add a new website or network.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
              <h2 className="text-headline-md" style={{ margin: 0, color: "var(--color-on-surface)" }}>Recent Activity</h2>
              <a href="#" className="text-label-sm" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "underline" }}>View all</a>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <ActivityItem icon="shield" iconBg="var(--color-success-bg)" iconColor="var(--color-success)"
                title="Weekly Scheduled Scan" sub="horizoncafe.com" time="Today, 8:00 AM" tag="Clear" tagColor="var(--color-success)" tagBg="var(--color-success-bg)" />
              <ActivityItem icon="domain_verification" iconBg="var(--color-surface-container)" iconColor="var(--color-secondary)"
                title="Domain Verified" sub="shop.horizoncafe.com" time="Yesterday" tag="System" tagColor="var(--color-secondary)" tagBg="var(--color-surface-container)" />
              <ActivityItem icon="warning" iconBg="var(--color-warning-bg)" iconColor="var(--color-warning)"
                title="Manual Scan Completed" sub="Guest WiFi Network" time="Oct 24" tag="2 Risks" tagColor="var(--color-warning)" tagBg="var(--color-warning-bg)" />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 768px) {
          main { padding-inline: var(--margin-desktop) !important; }
          .bento-grid > *:nth-child(1) { grid-column: span 5 !important; }
          .bento-grid > *:nth-child(2) { grid-column: span 3 !important; }
          .bento-grid > *:nth-child(3) { grid-column: span 4 !important; }
          .actions-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
