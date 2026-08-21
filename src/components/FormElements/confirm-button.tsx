"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function ConfirmButton({
  children,
  icon,
  pendingIcon,
  title = "Yakin?",
  message,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "default",
  className,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  pendingIcon?: React.ReactNode;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger" | "brand";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { pending } = useFormStatus();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    setOpen(false);
    buttonRef.current?.closest("form")?.requestSubmit();
  };

  const confirmClass =
    variant === "danger"
      ? "bg-red hover:bg-opacity-90"
      : variant === "brand"
        ? "bg-[#F35C2B] hover:bg-[#d94e21]"
        : "bg-primary hover:bg-opacity-90";

  return (
    <>
      <button ref={buttonRef} type="button" disabled={pending} onClick={() => setOpen(true)} className={className}>
        {pending ? pendingIcon : icon}
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-99999 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-2xl bg-white p-6 shadow-lg dark:bg-gray-dark sm:rounded-xl"
          >
            <h3 className="mb-2 text-left text-lg font-bold text-dark dark:text-white">{title}</h3>
            <p className="mb-6 text-left text-sm text-dark-6">{message}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-stroke px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}