"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Brand */}
        <Link href="/" className="brand">
          <span className="material-symbols-outlined fill" style={{ color: "var(--color-primary)" }}>shield_locked</span>
          Vyapar <em style={{ fontStyle: "normal", color: "var(--color-primary-container)", fontSize: "13px", letterSpacing: "0.5px" }}>Shield</em>
        </Link>

        {/* Nav Links */}
        <ul className="nav-links">
          <li><Link href="/dashboard" className={pathname?.startsWith("/dashboard") ? "active" : ""}>Dashboard</Link></li>
          <li><Link href="/targets" className={pathname?.startsWith("/targets") ? "active" : ""}>Targets</Link></li>
          <li><Link href="/reports" className={pathname?.startsWith("/reports") ? "active" : ""}>Reports</Link></li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <button className="btn-ghost" aria-label="Change language" style={{ display: "flex", alignItems: "center", padding: "6px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>language</span>
          </button>
          <Link href="/auth" className="btn btn-primary" style={{ padding: "8px 20px" }}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
