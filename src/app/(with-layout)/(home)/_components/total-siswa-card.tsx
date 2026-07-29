import { db } from "@/lib/db";

export async function TotalSiswaCard() {
  const total = await db.siswa.count({ where: { status: "aktif" } });

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <dl>
        <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
          {total}
        </dt>
        <dd className="text-sm font-medium text-dark-6">Siswa Aktif</dd>
      </dl>
    </div>
  );
}