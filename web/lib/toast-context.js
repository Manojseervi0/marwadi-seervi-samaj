"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const STATUS_STYLES = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-orange-600",
  warning: "bg-yellow-600",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, status = "info", duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, description, status }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${STATUS_STYLES[t.status] || STATUS_STYLES.info} text-white rounded-md shadow-lg px-4 py-3`}
          >
            {t.title && <p className="font-semibold text-sm">{t.title}</p>}
            {t.description && <p className="text-sm opacity-95">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
