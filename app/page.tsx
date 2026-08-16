"use client";

import { useMemo, useState } from "react";
import { calculateScore, sampleFindings, scoreLabel, severityCount } from "../lib/assessment";
import type { Finding, Language, Severity, TargetState } from "../lib/types";

const severityOrder: Severity[] = ["High", "Medium", "Low"];
const initialTarget: TargetState = {
  url: "https://store.cybersure-demo.in",
  hostname: "store.cybersure-demo.in",
  token: "",
  verified: false,
  consented: false,
};

export default function Home() {
  const [target, setTarget] = useState<TargetState>(initialTarget);
  const [findings, setFindings] = useState<Finding[]>(sampleFindings);
  const [language, setLanguage] = useState<Language>("English");
  const [scanState, setScanState] = useState<"idle" | "running" | "complete">("idle");
  const [activeFinding, setActiveFinding] = useState<string>(sampleFindings[0].id);
  const [notice, setNotice] = useState<string>("");
  const score = useMemo(() => calculateScore(findings), [findings]);
  const selected = findings.find((finding) => finding.id === activeFinding) ?? findings[0];

  async function generateVerification() {
    try {
      const response = await fetch("/api/targets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target.url }),
      });
      const validation = await response.json() as { valid: boolean; hostname?: string; reason?: string };
      if (!validation.valid || !validation.hostname) {
        setNotice(validation.reason ?? "Use a public HTTPS domain. Local and private addresses are blocked.");
        return;
      }
      const token = `cybersure-verify=${crypto.randomUUID().slice(0, 12)}`;
      setTarget({ ...target, hostname: validation.hostname, token, verified: false, consented: false });
      setNotice("Verification token generated. Add it to DNS or your .well-known file, then confirm below.");
    } catch {
      setNotice("Could not validate the target. Ensure the local app server is running, then try again.");
    }
  }

  function confirmVerification() {
    if (!target.token) {
      setNotice("Generate a verification token first.");
      return;
    }
    setTarget({ ...target, verified: true });
    setNotice(`${target.hostname} is verified for this guided demo.`);
  }

  function runScan() {
    if (!target.verified || !target.consented) {
      setNotice("Verify target ownership and accept the scan scope before starting a scan.");
      return;
    }
    setScanState("running");
    setNotice("Running low-impact checks: TLS, headers, cookies, and page resources…");
    window.setTimeout(() => {
      setScanState("complete");
      setNotice("Assessment complete. Review the prioritised fixes below.");
    }, 1250);
  }

  function updateFinding(id: string) {
    setFindings((current) => current.map((finding) => finding.id === id ? { ...finding, status: finding.status === "Open" ? "Fixed" : "Open" } : finding));
  }

  function exportReport() {
    const open = findings.filter((finding) => finding.status === "Open");
    const lines = [
      "# CyberSure MSME — Security Health Check",
      "",
      `Target: ${target.hostname || "Not verified"}`,
      `Score: ${score}/100 (${scoreLabel(score)})`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "## Fix first",
      ...open.map((finding) => `- **${finding.severity}: ${finding.title}** — ${finding.owner["English"]} Developer action: ${finding.developer}`),
      "",
      "## Assessment scope",
      "This report covers consented, low-impact checks only. It is not a penetration test or compliance certification.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `cybersure-report-${target.hostname || "draft"}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CyberSure home"><span className="brand-mark">◈</span> CyberSure <em>MSME</em></a>
        <div className="header-actions">
          <span className="safe-chip">● Consent-gated scans</span>
          <button className="text-button" onClick={exportReport} disabled={scanState !== "complete"}>Download report</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">Affordable security assessment for small businesses</p>
          <h1>Know what is exposed.<br /><span>Fix what matters first.</span></h1>
          <p className="hero-copy">CyberSure turns website security signals into a clear action plan for business owners and developers.</p>
        </div>
        <div className="language-toggle" aria-label="Report language">
          {(["English", "Hindi", "Hinglish"] as Language[]).map((option) => <button key={option} className={language === option ? "selected" : ""} onClick={() => setLanguage(option)}>{option}</button>)}
        </div>
      </section>

      <section className="steps" aria-label="Assessment process">
        <Step number="1" label="Verify target" active={!target.verified} complete={target.verified} />
        <Step number="2" label="Give consent" active={target.verified && !target.consented} complete={target.consented} />
        <Step number="3" label="Review fixes" active={scanState === "running"} complete={scanState === "complete"} />
      </section>

      {scanState !== "complete" ? (
        <section className="onboarding-grid">
          <div className="card setup-card">
            <div className="card-heading"><p className="eyebrow">Secure setup</p><h2>Verify a website you own</h2><p>CyberSure scans only explicitly verified domains. No third-party targets, credential attacks, or exploitation.</p></div>
            <label htmlFor="target-url">Website address</label>
            <div className="input-row"><input id="target-url" value={target.url} onChange={(event) => setTarget({ ...target, url: event.target.value })} placeholder="https://yourbusiness.in" /><button className="primary" onClick={generateVerification}>Generate token</button></div>
            {target.token && <div className="token-box"><div><span className="token-label">DNS TXT value or file content</span><code>{target.token}</code><small>Place the token at <strong>/.well-known/cybersure-verification.txt</strong> or add it as a DNS TXT record.</small></div><button className="outline" onClick={confirmVerification}>I added it</button></div>}
            {target.verified && <div className="verified-row">✓ <strong>{target.hostname}</strong> verified for scanning</div>}
            <label className="consent-row"><input type="checkbox" checked={target.consented} disabled={!target.verified} onChange={(event) => setTarget({ ...target, consented: event.target.checked })} /><span>I own or am authorised to assess this target. I consent to time-bounded, low-impact HTTPS checks only.</span></label>
            <button className="primary wide" onClick={runScan} disabled={!target.verified || !target.consented || scanState === "running"}>{scanState === "running" ? "Checking your website…" : "Start security health check"}</button>
            {notice && <p className="notice" role="status">{notice}</p>}
          </div>
          <aside className="card scope-card"><p className="eyebrow">What we check</p><h3>Helpful, not intrusive.</h3><ul><li>HTTPS certificate and secure connection</li><li>Browser security headers</li><li>Cookie protection settings</li><li>Mixed HTTP page resources</li><li>Safe, fixed debug indicators</li></ul><div className="scope-exclusion"><strong>Not included</strong><br />Exploitation, passwords, brute force, crawling, or scanning targets you have not verified.</div></aside>
        </section>
      ) : (
        <section className="dashboard">
          <section className="score-grid">
            <div className="card score-card"><p className="eyebrow">Security health score</p><div className="score-line"><strong>{score}</strong><span>/100</span></div><div className="score-meter"><i style={{ width: `${score}%` }} /></div><p>{scoreLabel(score)} · {findings.filter((finding) => finding.status === "Open").length} actions remain</p></div>
            <div className="card summary-card"><p className="eyebrow">Scan summary</p><h2>{target.hostname}</h2><p>Low-impact assessment completed just now.</p><div className="severity-row">{severityOrder.map((severity) => <span key={severity} className={`severity ${severity.toLowerCase()}`}><b>{severityCount(findings, severity)}</b> {severity}</span>)}</div></div>
            <div className="card rescan-card"><p className="eyebrow">Ready when you are</p><h3>Fixed something?</h3><p>Mark it fixed and run a re-scan to verify the change.</p><button className="outline" onClick={runScan}>Re-scan target</button></div>
          </section>

          <section className="findings-layout">
            <div className="card finding-list"><div className="section-title"><div><p className="eyebrow">Prioritised fixes</p><h2>Fix first</h2></div><span>{findings.filter((finding) => finding.status === "Open").length} open</span></div>{findings.map((finding) => <button key={finding.id} className={`finding-item ${activeFinding === finding.id ? "active" : ""}`} onClick={() => setActiveFinding(finding.id)}><span className={`severity-dot ${finding.severity.toLowerCase()}`} /><span className="finding-item-copy"><b>{finding.title}</b><small>{finding.category} · {finding.effort}</small></span><span className={finding.status === "Open" ? "open-status" : "fixed-status"}>{finding.status}</span></button>)}</div>
            {selected && <FindingPanel finding={selected} language={language} onToggle={() => updateFinding(selected.id)} />}
          </section>
          {notice && <p className="notice dashboard-notice" role="status">{notice}</p>}
        </section>
      )}
    </main>
  );
}

function Step({ number, label, active, complete }: { number: string; label: string; active: boolean; complete: boolean }) {
  return <div className={`step ${active ? "active" : ""} ${complete ? "complete" : ""}`}><span>{complete ? "✓" : number}</span>{label}</div>;
}

function FindingPanel({ finding, language, onToggle }: { finding: Finding; language: Language; onToggle: () => void }) {
  return <article className="card finding-panel">
    <div className="finding-panel-top"><span className={`severity-tag ${finding.severity.toLowerCase()}`}>{finding.severity}</span><span className="effort">Estimated effort: {finding.effort}</span></div>
    <p className="eyebrow">{finding.category}</p><h2>{finding.title}</h2>
    <div className="owner-view"><span>For the business owner · {language}</span><p>{finding.owner[language]}</p></div>
    <div className="developer-view"><span>For the developer</span><p>{finding.developer}</p><code>{finding.evidence}</code></div>
    <div className="panel-footer"><span className={finding.status === "Open" ? "open-status" : "fixed-status"}>{finding.status === "Open" ? "Needs action" : "Marked fixed"}</span><button className={finding.status === "Open" ? "primary" : "outline"} onClick={onToggle}>{finding.status === "Open" ? "Mark fixed" : "Reopen finding"}</button></div>
  </article>;
}
