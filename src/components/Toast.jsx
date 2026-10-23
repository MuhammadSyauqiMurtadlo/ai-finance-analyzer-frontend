import { useEffect } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const Icon = isError ? CircleAlert : CircleCheck;

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[60] sm:left-auto sm:right-6 sm:bottom-6"
    >
      <div
        className={`mx-auto flex max-w-sm items-start gap-2.5 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg sm:mx-0 ${
          isError ? "border-rose-200" : "border-emerald-200"
        }`}
      >
        <Icon
          size={18}
          className={`mt-0.5 shrink-0 ${isError ? "text-rose-600" : "text-emerald-600"}`}
        />
        <p className="flex-1 text-slate-700">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="rounded p-0.5 text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
