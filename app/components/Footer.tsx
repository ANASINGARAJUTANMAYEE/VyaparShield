import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-primary)" }}>Vyapar Shield</span>
          <span className="text-body-md" style={{ color: "var(--color-secondary)" }}>
            © {new Date().getFullYear()} Vyapar Shield. Empowering small businesses with trust.
          </span>
        </div>
        <nav className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/help">Help Center</Link>
          <Link href="/security">Security Promise</Link>
        </nav>
      </div>
    </footer>
  );
}
