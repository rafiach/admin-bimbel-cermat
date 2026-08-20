"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  icon,
  pendingIcon,
  className,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  pendingIcon?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? pendingIcon : icon}
      {children}
    </button>
  );
}