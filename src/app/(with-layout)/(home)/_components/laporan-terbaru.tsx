import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import Link from "next/link";

export async function LaporanTerbaru() {
  const [laporan, laporanKelompok] = await Promise.all([
    db.laporanBulanan.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { kelas: { include: { siswa: true, tutor: true } } },
    }),
    db.laporanKelompok.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { kelompok: { include: { tutor: true } } },
    }),
  ]);

  const gabungan = [
    ...laporan.map((l) => ({
      id: l.id,
      nama: l.kelas.siswa.nama,
      tutor: l.kelas.tutor.nama,
      jumlah: `${l.jumlahHadir}x`,
      status: l.statusBayarOrtu,
      createdAt: l.createdAt,
      href: `/rekap/${l.id}`,
    })),
    ...laporanKelompok.map((l) => ({
      id: l.id,
      nama: `${l.kelompok.nama} (Kelompok)`,
      tutor: l.kelompok.tutor.nama,
      jumlah: `${l.jumlahKelompok}x`,
      status: l.statusBayarOrtu,
      createdAt: l.createdAt,
      href: `/rekap-kelompok/${l.id}`,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-medium text-dark dark:text-white">Laporan Terbaru</h4>
        <Link href="/rekap" className="text-sm text-primary hover:underline">Lihat Semua</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-3 [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="xl:pl-5">Siswa / Kelompok</TableHead>
            <TableHead>Tutor</TableHead>
            <TableHead>Hadir</TableHead>
            <TableHead className="text-right xl:pr-5">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gabungan.map((l) => (
            <TableRow key={l.id} className="border-[#eee] dark:border-dark-3">
              <TableCell className="xl:pl-5">
                <Link href={l.href} className="text-dark hover:text-primary dark:text-white">
                  {l.nama}
                </Link>
              </TableCell>
              <TableCell className="text-dark dark:text-white">{l.tutor}</TableCell>
              <TableCell className="text-dark dark:text-white">{l.jumlah}</TableCell>
              <TableCell className="text-right xl:pr-5">
                <span className={l.status === "lunas" ? "text-[#219653]" : "text-[#D34053]"}>
                  {l.status === "lunas" ? "Lunas" : "Belum Lunas"}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {gabungan.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-dark-6">Belum ada laporan masuk.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}