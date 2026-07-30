export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <dl>
        <dt className="mb-1 text-heading-6 font-bold text-dark dark:text-white">{value}</dt>
        <dd className="text-sm font-medium text-dark-6">{label}</dd>
      </dl>
    </div>
  );
}