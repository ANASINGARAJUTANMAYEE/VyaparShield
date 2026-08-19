import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/Toast";

export const metadata: Metadata = {
  title: "Vyapar Shield — Security simplified for small businesses",
  description: "Vyapar Shield turns confusing website security risks into a verified, prioritised action plan for small businesses in India.",
  keywords: ["cybersecurity", "MSME", "small business security", "website security", "India"],
  openGraph: {
    title: "Vyapar Shield",
    description: "Affordable, consent-gated security assessments for small businesses.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
