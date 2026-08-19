"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType; }

const ToastCtx = createContext<(msg: string, type?: ToastType) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

const ICONS: Record<ToastType, string> = { success: "check_circle", error: "error", info: "info" };
const COLORS: Record<ToastType, { bg: string; color: string; border: string }> = {
  success: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  error:   { bg: "#fff1f2", color: "#991b1b", border: "#fecaca" },
  info:    { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position: "fixed", top: "80px", right: "20px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px", pointerEvents: "none" }}>
        {toasts.map((t) => {
          const c = COLORS[t.type];
          return (
            <div key={t.id} style={{
              background: c.bg, color: c.color, border: `1px solid ${c.border}`,
              borderRadius: "12px", padding: "12px 16px",
              display: "flex", alignItems: "center", gap: "10px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              fontFamily: "Manrope, sans-serif", fontSize: "14px", fontWeight: 500,
              minWidth: "260px", maxWidth: "380px", pointerEvents: "auto",
              animation: "slideInToast 0.3s ease",
            }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: "20px", flexShrink: 0 }}>{ICONS[t.type]}</span>
              {t.message}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideInToast { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </ToastCtx.Provider>
  );
}
