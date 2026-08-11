import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG: Record<
  ToastType,
  { icon: typeof CheckCircle; bg: string; border: string; text: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/50",
    text: "text-emerald-800 dark:text-emerald-200",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800/50",
    text: "text-red-800 dark:text-red-200",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/50",
    text: "text-amber-800 dark:text-amber-200",
    iconColor: "text-amber-500",
  },
  info: {
    icon: AlertCircle,
    bg: "bg-primary/5 dark:bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    iconColor: "text-primary",
  },
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const cfg = TOAST_CONFIG[toast.type];
  const Icon = cfg.icon;
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4 rounded-2xl border shadow-lg max-w-sm w-full
        ${cfg.bg} ${cfg.border}
        animate-in slide-in-from-bottom-4 fade-in duration-300
      `}
    >
      <Icon className={`size-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight ${cfg.text}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={`text-xs mt-0.5 leading-relaxed opacity-80 ${cfg.text}`}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${cfg.text}`}
        aria-label="Cerrar notificación"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-full px-4"
      aria-label="Notificaciones del sistema"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full max-w-sm">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const show = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, type, title, message, duration }]);
  };

  return {
    toasts,
    dismiss,
    success: (title: string, message?: string) => show("success", title, message),
    error: (title: string, message?: string) => show("error", title, message),
    warning: (title: string, message?: string) => show("warning", title, message),
    info: (title: string, message?: string) => show("info", title, message),
  };
}
