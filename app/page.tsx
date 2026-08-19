"use client";

import Link from "next/link";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

/* ── Mini score widget that mirrors the Stitch hero preview ── */
function HeroScoreWidget() {
  const score = 61;
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ≈ 282.7
  const offset = circumference * (1 - score / 100); // ≈ 110.2

  return (
    <div
      style={{
        background: "var(--color-surface-container-lowest)",
        border: "1px solid var(--color-outline-variant)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-raised)",
        padding: "var(--spacing-xl)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xl)",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-primary)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-outline-variant)")}
    >
      {/* Gauge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-sm)" }}>
        <div style={{ position: "relative", width: "128px", height: "128px" }}>
          <svg className="score-ring" viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-surface-variant)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={radius} fill="none"
              stroke="var(--color-primary-container)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span className="text-headline-md" style={{ color: "var(--color-on-surface)" }}>
              {score}<span className="text-body-md" style={{ color: "var(--color-secondary)" }}>/100</span>
            </span>
          </div>
        </div>
        <span className="chip chip-medium">Needs Attention</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)", opacity: 0.5 }} />

      {/* Mini finding rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
        {[
          { icon: "warning",      label: "Outdated CMS",       chip: "High",    chipClass: "chip-high" },
          { icon: "info",         label: "Missing Headers",    chip: "Med",     chipClass: "chip-medium" },
          { icon: "check_circle", label: "SSL Valid",          chip: "Healthy", chipClass: "chip-healthy" },
        ].map(({ icon, label, chip, chipClass }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              background: "var(--color-surface-container-low)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: chipClass === "chip-high" ? "var(--color-error)" : chipClass === "chip-medium" ? "var(--color-risk)" : "var(--color-primary)" }}>{icon}</span>
              <span className="text-label-sm" style={{ color: "var(--color-on-surface)" }}>{label}</span>
            </div>
            <span className={`chip ${chipClass}`}>{chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Benefit card ── */
function BenefitCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div
      className="card"
      style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}
    >
      <div style={{
        width: "48px", height: "48px", borderRadius: "var(--radius-full)",
        background: "var(--color-surface-container)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--color-primary-container)",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>{icon}</span>
      </div>
      <h3 className="text-headline-md" style={{ margin: 0, color: "var(--color-on-surface)" }}>{title}</h3>
      <p className="text-body-md" style={{ margin: 0, color: "var(--color-on-surface-variant)" }}>{body}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <TopBar />

      <main style={{ flex: 1 }}>
        {/* ── Hero ── */}
        <section style={{ padding: "64px var(--margin-mobile) 48px" }}>
          <div
            style={{
              maxWidth: "var(--container-max)",
              marginInline: "auto",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--spacing-xl)",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Copy */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)", zIndex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                <h1 className="text-display" style={{ margin: 0, color: "var(--color-on-surface)" }}>
                  Know what is exposed.<br />
                  <span style={{ color: "var(--color-primary-container)" }}>Fix what matters first.</span>
                </h1>
                <p className="text-body-lg" style={{ margin: 0, color: "var(--color-on-surface-variant)", maxWidth: "500px" }}>
                  Vyapar Shield turns confusing website security risks into a verified, prioritised action plan for small businesses.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-md)", alignItems: "center" }}>
                <Link href="/auth" className="btn btn-primary" style={{ padding: "12px 32px" }}>
                  Start free security check
                </Link>
                <Link href="#how" className="btn btn-secondary" style={{ padding: "12px 32px" }}>
                  See how it works
                </Link>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", color: "var(--color-secondary)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>verified_user</span>
                <span className="text-label-sm">Consent-gated, low-impact scans only</span>
              </div>
            </div>

            {/* Score preview widget */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, var(--color-surface-container), var(--color-surface-container-low))",
                borderRadius: "24px", opacity: 0.5, transform: "rotate(3deg) scale(1.05)", zIndex: 0,
              }} />
              <HeroScoreWidget />
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section id="how" style={{ background: "var(--color-surface-container-low)", borderTop: "1px solid var(--color-outline-variant)", borderBottom: "1px solid var(--color-outline-variant)", padding: "80px var(--margin-mobile)" }}>
          <div style={{ maxWidth: "var(--container-max)", marginInline: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--spacing-lg)" }}>
              <BenefitCard icon="verified" title="Verify before scanning" body="We strictly ensure you only scan domains your business owns, maintaining safe and legal boundaries." />
              <BenefitCard icon="lightbulb" title="Simple fixes first" body="Clear, jargon-free actionable steps prioritized for business owners to protect their assets efficiently." />
              <BenefitCard icon="code_blocks" title="Developer-ready evidence" body="Technical guidance and reports that you can hand straight to your IT team for immediate resolution." />
            </div>
          </div>
        </section>

        {/* ── Localisation / Language ── */}
        <section style={{ padding: "80px var(--margin-mobile)", textAlign: "center" }}>
          <div style={{ maxWidth: "600px", marginInline: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-lg)" }}>
            <h2 className="text-headline-lg" style={{ margin: 0, color: "var(--color-on-surface)" }}>Built for Indian MSMEs</h2>
            <p className="text-body-md" style={{ margin: 0, color: "var(--color-secondary)" }}>
              Security that speaks your language and understands your business scale.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-sm)", justifyContent: "center" }}>
              {["English", "Hindi (हिंदी)", "Hinglish"].map((lang) => (
                <span
                  key={lang}
                  style={{
                    padding: "8px 18px",
                    background: "var(--color-surface-container)",
                    color: "var(--color-primary-container)",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--color-outline-variant)",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{
          background: "var(--color-primary-container)",
          padding: "56px var(--margin-mobile)",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "640px", marginInline: "auto", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)", alignItems: "center" }}>
            <h2 className="text-headline-lg" style={{ margin: 0, color: "var(--color-on-primary)" }}>
              Ready to secure your business?
            </h2>
            <p className="text-body-lg" style={{ margin: 0, color: "rgba(255,255,255,0.85)" }}>
              Run your first free scan in under 5 minutes. No credit card required.
            </p>
            <Link
              href="/auth"
              className="btn"
              style={{
                background: "var(--color-surface-container-lowest)",
                color: "var(--color-primary)",
                padding: "14px 36px",
                fontSize: "15px",
                fontWeight: 700,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              }}
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; padding-inline: var(--margin-desktop); }
        }
        @media (min-width: 768px) {
          section { padding-inline: var(--margin-desktop) !important; }
        }
      `}</style>
    </>
  );
}
