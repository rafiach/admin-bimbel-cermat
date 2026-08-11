import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  extraParams = {},
}: {
  currentPage: number;
  totalPages: number;
  extraParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-dark-6">Halaman {currentPage} dari {totalPages}</p>
      <div className="flex gap-2">
        <Link
          href={buildUrl(Math.max(1, currentPage - 1))}
          className={`rounded-lg border border-stroke px-3 py-1.5 dark:border-dark-3 ${
            currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-2 dark:hover:bg-dark-2"
          }`}
        >
          ← Sebelumnya
        </Link>
        <Link
          href={buildUrl(Math.min(totalPages, currentPage + 1))}
          className={`rounded-lg border border-stroke px-3 py-1.5 dark:border-dark-3 ${
            currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-2 dark:hover:bg-dark-2"
          }`}
        >
          Selanjutnya →
        </Link>
      </div>
    </div>
  );
}