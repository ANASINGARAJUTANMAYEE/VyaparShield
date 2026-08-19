"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = "480px" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(12,30,34,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeInBg 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-outline-variant)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          width: "100%", maxWidth,
          animation: "slideUpModal 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--color-outline-variant)" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--color-on-surface)", fontFamily: "Manrope, sans-serif" }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-secondary)", display: "flex", alignItems: "center", padding: "4px", borderRadius: "6px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeInBg { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUpModal { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
