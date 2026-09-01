import Link from "next/link";

export function StatCard({
  label,
  value,
  icon,
  subValue,
  subHref,
  subTone = "default",
  className = "",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  subValue?: string;
  subHref?: string;
  subTone?: "default" | "danger" | "muted";
  className?: string;
}) {
  const toneClass =
    subTone === "danger"
      ? "text-[#D34053]"
      : subTone === "muted"
        ? "text-dark-6"
        : "text-dark-5";

  return (
    <div className={`flex items-center gap-4 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark ${className}`}>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <dl className="min-w-0 flex-1">
        <dt className="mb-1 text-heading-6 font-bold text-dark dark:text-white">{value}</dt>
        <dd className="text-sm font-medium text-dark-6">{label}</dd>
        {subValue && (
          <dd className={`mt-1 text-xs font-medium ${toneClass}`}>
            {subHref ? (
              <Link href={subHref} className="hover:underline">
                {subValue}
              </Link>
            ) : (
              subValue
            )}
          </dd>
        )}
      </dl>
    </div>
  );
}