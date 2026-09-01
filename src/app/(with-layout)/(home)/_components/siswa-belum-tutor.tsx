import { db } from "@/lib/db";
import Link from "next/link";

export async function SiswaBelumTutor() {
  const siswa = await db.siswa.findMany({
    where: { status: "nonaktif", kelasList: { none: {} } },
    orderBy: { createdAt: "desc" },
  });

  if (siswa.length === 0) return null;

  return (
    <div className="rounded-[10px] border border-[#FFA70B]/30 bg-[#FFA70B]/5 p-4 dark:bg-[#FFA70B]/10 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-dark dark:text-white">
          🏫 {siswa.length} Siswa Belum Dapat Tutor
        </h4>
        <Link href="/kelas/tambah" className="text-sm text-primary hover:underline">
          + Tambah Kelas
        </Link>
      </div>

      <ul className="flex flex-wrap gap-2">
        {siswa.map((s) => (
          <li
            key={s.id}
            className="rounded-full bg-white px-3 py-1 text-sm text-dark shadow-sm dark:bg-gray-dark dark:text-white"
          >
            {s.nama}
          </li>
        ))}
      </ul>
    </div>
  );
}