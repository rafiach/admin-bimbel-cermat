import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import Link from "next/link";

export async function LaporanTerbaru() {
  const laporan = await db.laporanBulanan.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { kelas: { include: { siswa: true, tutor: true } } },
  });

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-medium text-dark dark:text-white">Laporan Terbaru</h4>
        <Link href="/rekap" className="text-sm text-primary hover:underline">Lihat Semua</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-3 [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="xl:pl-5">Siswa</TableHead>
            <TableHead>Tutor</TableHead>
            <TableHead>Hadir</TableHead>
            <TableHead className="text-right xl:pr-5">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laporan.map((l) => (
            <TableRow key={l.id} className="border-[#eee] dark:border-dark-3">
              <TableCell className="xl:pl-5 text-dark dark:text-white">{l.kelas.siswa.nama}</TableCell>
              <TableCell className="text-dark dark:text-white">{l.kelas.tutor.nama}</TableCell>
              <TableCell className="text-dark dark:text-white">{l.jumlahHadir}x</TableCell>
              <TableCell className="text-right xl:pr-5">
                <span className={l.statusBayarOrtu === "lunas" ? "text-[#219653]" : "text-[#D34053]"}>
                  {l.statusBayarOrtu === "lunas" ? "Lunas" : "Belum Lunas"}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {laporan.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-dark-6">Belum ada laporan masuk.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}