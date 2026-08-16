import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberSure MSME | Security health check",
  description: "Consent-gated cybersecurity assessments for small businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
