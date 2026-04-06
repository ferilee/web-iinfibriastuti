"use client";

import type { CSSProperties, ReactNode } from "react";
import { toast } from "sonner";

type AdminToastVariant = "success" | "error" | "info" | "warning";

type AdminToastOptions = {
  durationMs?: number;
  description?: ReactNode;
};

const variantBars: Record<AdminToastVariant, string> = {
  success: "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400",
  error: "bg-gradient-to-r from-red-400 via-rose-400 to-orange-400",
  info: "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400",
  warning: "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400",
};

const defaultDurationMs = 4000;

function showAdminToast(
  variant: AdminToastVariant,
  title: ReactNode,
  options?: AdminToastOptions,
) {
  const durationMs = options?.durationMs ?? defaultDurationMs;

  toast.custom(
    () => (
      <div
        className="w-[320px] rounded-2xl border border-white/10 bg-slate-900/95 px-5 py-4 text-white shadow-xl"
        style={
          {
            "--toast-duration": `${durationMs}ms`,
          } as CSSProperties
        }
      >
        <p className="text-sm font-semibold">{title}</p>
        {options?.description ? (
          <p className="text-sm text-white/70 mt-1">{options.description}</p>
        ) : null}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`toast-progress h-full w-full ${variantBars[variant]}`}
          />
        </div>
      </div>
    ),
    { duration: durationMs },
  );
}

export const adminToast = {
  success: (title: ReactNode, options?: AdminToastOptions) =>
    showAdminToast("success", title, options),
  error: (title: ReactNode, options?: AdminToastOptions) =>
    showAdminToast("error", title, options),
  info: (title: ReactNode, options?: AdminToastOptions) =>
    showAdminToast("info", title, options),
  warning: (title: ReactNode, options?: AdminToastOptions) =>
    showAdminToast("warning", title, options),
};
