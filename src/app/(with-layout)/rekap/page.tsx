import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { deleteLaporan, toggleBayarOrtu, toggleBayarTutor } from "./actions";
import Link from "next/link";
import { formatPhoneDisplay, waLink } from "@/lib/phone";


export const metadata = { title: "Rekap & Pembayaran" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// fee kompensasi
const FEE_IZIN = 5000;

export default async function RekapPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const bulan = Number(params.bulan) || now.getMonth() + 1;
  const tahun = Number(params.tahun) || now.getFullYear();

  const laporan = await db.laporanBulanan.findMany({
    where: { bulan, tahun },
    include: { kelas: { include: { siswa: true, tutor: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = laporan.map((l) => {
    const tagihanOrtu = l.jumlahHadir * l.kelas.biayaOrtu + l.jumlahIzin * FEE_IZIN;
    const feeTutor = l.jumlahHadir * l.kelas.feeTutor + l.jumlahIzin * FEE_IZIN;
    return { ...l, tagihanOrtu, feeTutor };
  });

  const totalTagihanOrtu = rows.reduce((sum, r) => sum + r.tagihanOrtu, 0);
  const totalFeeTutor = rows.reduce((sum, r) => sum + r.feeTutor, 0);
  const totalMargin = totalTagihanOrtu - totalFeeTutor;

  return (
    <>
      <Breadcrumb pageName="Rekap & Pembayaran" />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            Rp {totalTagihanOrtu.toLocaleString("id-ID")}
          </dt>
          <dd className="text-sm font-medium text-dark-6">Total Tagihan Ortu</dd>
        </div>
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            Rp {totalFeeTutor.toLocaleString("id-ID")}
          </dt>
          <dd className="text-sm font-medium text-dark-6">Total Fee Tutor</dd>
        </div>
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            Rp {totalMargin.toLocaleString("id-ID")}
          </dt>
          <dd className="text-sm font-medium text-dark-6">Margin Bimbel</dd>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <form method="get" className="mb-5 flex items-center gap-3">
          <select name="bulan" defaultValue={bulan} className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none dark:border-dark-3">
            {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
          </select>
          <input type="number" name="tahun" defaultValue={tahun} className="w-24 rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none dark:border-dark-3" />
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
            Tampilkan
          </button>
        </form>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Siswa</TableHead>
              <TableHead>No HP Ortu</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Hadir</TableHead>
              <TableHead>Izin</TableHead>
              <TableHead>Tagihan Ortu</TableHead>
              <TableHead>Fee Tutor</TableHead>
              <TableHead>Bayar Ortu</TableHead>
              <TableHead>Bayar Tutor</TableHead>
              <TableHead className="text-right xl:pr-7.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="xl:pl-7.5 text-dark dark:text-white">{r.kelas.siswa.nama}</TableCell>
                <TableCell>
                  {waLink(r.kelas.siswa.noHpOrtu) ? (
                    <a href={waLink(r.kelas.siswa.noHpOrtu)!} target="_blank" className="text-primary hover:underline">
                      {formatPhoneDisplay(r.kelas.siswa.noHpOrtu)}
                    </a>
                  ) : (
                    <span className="text-dark dark:text-white">-</span>
                  )}
                </TableCell>
                <TableCell className="text-dark dark:text-white">{r.kelas.tutor.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">{r.jumlahHadir}</TableCell>
                <TableCell className="text-dark dark:text-white">{r.jumlahIzin}</TableCell>
                <TableCell className="text-dark dark:text-white">Rp {r.tagihanOrtu.toLocaleString("id-ID")}</TableCell>
                <TableCell className="text-dark dark:text-white">Rp {r.feeTutor.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <form action={toggleBayarOrtu}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="current" value={r.statusBayarOrtu} />
                    <button type="submit" className={cn("rounded-full px-3.5 py-1 text-sm font-medium", r.statusBayarOrtu === "lunas" ? "bg-[#219653]/8 text-[#219653]" : "bg-[#D34053]/8 text-[#D34053]")}>
                      {r.statusBayarOrtu === "lunas" ? "Lunas ✓" : "Belum"}
                    </button>
                  </form>
                </TableCell>
                <TableCell>
                  <form action={toggleBayarTutor}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="current" value={r.statusBayarTutor} />
                    <button type="submit" className={cn("rounded-full px-3.5 py-1 text-sm font-medium", r.statusBayarTutor === "sudah" ? "bg-[#219653]/8 text-[#219653]" : "bg-[#D34053]/8 text-[#D34053]")}>
                      {r.statusBayarTutor === "sudah" ? "Sudah ✓" : "Belum"}
                    </button>
                  </form>
                </TableCell>
                <TableCell className="text-right xl:pr-7.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/rekap/${r.id}`} className="hover:text-primary">Lihat</Link>
                    <Link href={`/rekap/${r.id}/edit`} className="hover:text-primary">Edit</Link>
                    <form action={deleteLaporan}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="text-red hover:underline">Hapus</button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="py-6 text-center text-dark-6">Belum ada laporan buat periode ini.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}