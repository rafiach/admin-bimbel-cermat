import { db } from "@/lib/db";
import Link from "next/link";

function getTargetPeriod(now: Date): { bulan: number; tahun: number } | null {
  const day = now.getDate();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Notif hanya aktif: 3 hari terakhir bulan (lastDay-2 .. lastDay) ATAU 7 hari pertama bulan (1..7)
  const inWindow = day <= 7 || day > lastDay - 3;
  if (!inWindow) return null;

  // Jika di awal bulan (1-7), cek laporan bulan sebelumnya (yang seharusnya sudah dikirim)
  if (day <= 7) {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { bulan: prev.getMonth() + 1, tahun: prev.getFullYear() };
  }

  // Jika di akhir bulan (lastDay-2 .. lastDay), cek laporan bulan berjalan
  return { bulan: now.getMonth() + 1, tahun: now.getFullYear() };
}

export async function TutorBelumLaporan() {
  const target = getTargetPeriod(new Date());

  // Di luar window (misal tgl 8-28), tidak tampilkan notif sama sekali
  if (!target) return null;

  const { bulan, tahun } = target;

  const [kelasTelat, kelompokTelat] = await Promise.all([
    db.kelas.findMany({
      where: {
        status: "aktif",
        laporan: { none: { bulan, tahun } },
      },
      include: { tutor: true, siswa: true },
      orderBy: { tutor: { nama: "asc" } },
    }),
    db.kelompok.findMany({
      where: {
        status: "aktif",
        laporan: { none: { bulan, tahun } },
      },
      include: { tutor: true },
      orderBy: { tutor: { nama: "asc" } },
    }),
  ]);

  const total = kelasTelat.length + kelompokTelat.length;
  if (total === 0) return null;

  const namaBulan = new Date(tahun, bulan - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-[10px] border border-[#E53935]/30 bg-[#E53935]/5 p-4 dark:bg-[#E53935]/10 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="font-medium text-dark dark:text-white">
          ⏰ {total} Kelas Belum Kirim Laporan — {namaBulan}
        </h4>
        <span className="shrink-0 rounded-full bg-[#E53935]/10 px-2.5 py-1 text-xs font-medium text-[#E53935]">
          {bulan}/{tahun}
        </span>
      </div>

      <p className="mb-3 text-sm text-dark-4 dark:text-dark-6">
        Tutor berikut belum mengirim laporan untuk periode <b>{namaBulan}</b>. Notif aktif 3 hari sebelum akhir bulan & 7 hari awal bulan berikutnya.
      </p>

      <ul className="space-y-2">
        {kelasTelat.map((k) => (
          <li
            key={k.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-gray-dark"
          >
            <div className="min-w-0">
              <span className="font-medium text-dark dark:text-white">{k.tutor.nama}</span>
              <span className="text-dark-4"> — Kelas Privat: </span>
              <span className="font-medium text-dark dark:text-white">{k.siswa.nama}</span>
            </div>
            <Link
              href={`/kelas/${k.id}`}
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Lihat
            </Link>
          </li>
        ))}
        {kelompokTelat.map((k) => (
          <li
            key={k.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-gray-dark"
          >
            <div className="min-w-0">
              <span className="font-medium text-dark dark:text-white">{k.tutor.nama}</span>
              <span className="text-dark-4"> — Kelompok: </span>
              <span className="font-medium text-dark dark:text-white">{k.nama}</span>
            </div>
            <Link
              href={`/kelompok/${k.id}`}
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Lihat
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-2">
        <Link href="/rekap" className="text-sm font-medium text-primary hover:underline">
          → Rekap Privat
        </Link>
        <span className="text-dark-6">·</span>
        <Link href="/rekap-kelompok" className="text-sm font-medium text-primary hover:underline">
          → Rekap Kelompok
        </Link>
      </div>
    </div>
  );
}

// Export helper untuk testing / reuse
export { getTargetPeriod };
