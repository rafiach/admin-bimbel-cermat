import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteLaporanKelompok, toggleBayarOrtuKelompok, toggleBayarTutorKelompok } from "./actions";
import { Combobox } from "@/components/FormElements/combobox";
import { Button } from "@/components/ui-elements/button";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { ConfirmButton } from "@/components/FormElements/confirm-button";

export const metadata = { title: "Rekap Kelompok" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default async function RekapKelompokPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const bulan = Number(params.bulan) || now.getMonth() + 1;
  const tahun = Number(params.tahun) || now.getFullYear();

  const laporan = await db.laporanKelompok.findMany({
    where: { bulan, tahun },
    include: { kelompok: { include: { tutor: true, anggota: { include: { siswa: true } } } }, anggotaLaporan: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = laporan.map((l) => {
    const hargaKelompok = l.hargaKelompokFinal ?? l.kelompok.hargaKelompok;
    const totalKelompok = l.jumlahKelompok * hargaKelompok;
    const totalIndividu = l.anggotaLaporan.reduce((sum, a) => {
      const anggota = l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
      return sum + a.jumlahIndividu * (anggota?.hargaPrivat ?? 0);
    }, 0);

    const feeTutorKelompok = l.jumlahKelompok * l.kelompok.feeTutorKelompok;
    const feeTutorIndividu = l.anggotaLaporan.reduce((sum, a) => {
      const anggota = l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
      return sum + a.jumlahIndividu * (anggota?.feeTutor ?? 0);
    }, 0);

    const totalTagihan = totalKelompok + totalIndividu;
    const totalFeeTutor = feeTutorKelompok + feeTutorIndividu;

    return { ...l, totalTagihan, totalFeeTutor };
  });

  const totalKelompok = rows.reduce((sum, r) => sum + r.totalTagihan, 0);
  const totalFeeTutorKelompok = rows.reduce((sum, r) => sum + r.totalFeeTutor, 0);
  const totalMargin = totalKelompok - totalFeeTutorKelompok;

  return (
    <>
      <Breadcrumb pageName="Rekap Kelompok" />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            Rp {totalKelompok.toLocaleString("id-ID")}
          </dt>
          <dd className="text-sm font-medium text-dark-6">Total Tagihan Ortu</dd>
        </div>
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            Rp {totalFeeTutorKelompok.toLocaleString("id-ID")}
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
        <form method="get" className="mb-5 flex items-end gap-3">
          <div className="w-48">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Bulan</label>
            <Combobox
              name="bulan"
              placeholder="Pilih bulan..."
              defaultValue={bulan ? String(bulan) : undefined}
              options={BULAN.map((b, i) => ({ value: String(i + 1), label: b }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tahun</label>
            <input type="number" name="tahun" defaultValue={tahun} className="w-24 rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none dark:border-dark-3" />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-opacity-90">
            Tampilkan
          </button>
        </form>

        <div className="mb-5">
          <Link href="/rekap-kelompok/gabungan" className="text-sm text-primary hover:underline">
            + Buat Kwitansi Gabungan
          </Link>
        </div>

        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Kelompok</TableHead>
              <TableHead>No Hp Ortu</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Kehadiaran Kelompok</TableHead>
              <TableHead>Tagihan Ortu</TableHead>
              <TableHead>Fee Tutor</TableHead>
              <TableHead>Bayar Ortu</TableHead>
              <TableHead>Bayar Tutor</TableHead>
              <TableHead className="text-right xl:pr-7.5">Detail</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="xl:pl-7.5 text-dark dark:text-white">{r.kelompok.nama}</TableCell>
                <TableCell className="xl:pl-7.5 text-dark dark:text-white">{r.kelompok.noHpWali}</TableCell>
                <TableCell className="text-dark dark:text-white">{r.kelompok.tutor.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">
                  {r.mingguKe > 0 ? `Minggu ke-${r.mingguKe}` : "Bulanan"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">{r.jumlahKelompok}x</TableCell>
                <TableCell className="text-dark dark:text-white">Rp {r.totalTagihan.toLocaleString("id-ID")}</TableCell>
                <TableCell className="text-dark dark:text-white">Rp {r.totalFeeTutor.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <form action={toggleBayarOrtuKelompok}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="current" value={r.statusBayarOrtu} />
                    <button type="submit" className={cn("rounded-full px-3.5 py-1 text-sm font-medium", r.statusBayarOrtu === "lunas" ? "bg-[#219653]/8 text-[#219653]" : "bg-[#D34053]/8 text-[#D34053]")}>
                      {r.statusBayarOrtu === "lunas" ? "Lunas ✓" : "Belum"}
                    </button>
                  </form>
                </TableCell>
                <TableCell>
                  <form action={toggleBayarTutorKelompok}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="current" value={r.statusBayarTutor} />
                    <button type="submit" className={cn("rounded-full px-3.5 py-1 text-sm font-medium", r.statusBayarTutor === "sudah" ? "bg-[#219653]/8 text-[#219653]" : "bg-[#D34053]/8 text-[#D34053]")}>
                      {r.statusBayarTutor === "sudah" ? "Sudah ✓" : "Belum"}
                    </button>
                  </form>
                </TableCell>
                <TableCell className="text-right xl:pr-7.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/rekap-kelompok/${r.id}`}
                      title="Lihat"
                      className="rounded-md p-2 text-gray-500 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={17} />
                    </Link>

                    <Link
                      href={`/rekap-kelompok/${r.id}/edit`}
                      title="Edit"
                      className="rounded-md p-2 text-gray-500 hover:bg-green/10 hover:text-green"
                    >
                      <Pencil size={17} />
                    </Link>

                    <form action={deleteLaporanKelompok}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmButton
                        variant="danger"
                        title="Hapus Data Rekap Kelompok?"
                        message={`Yakin mau hapus data rekap kelompok ${r.kelompok.nama}?`}
                        confirmLabel="Ya, Hapus"
                        icon={<Trash2 className="size-4.5" />}
                        pendingIcon={<Loader2 className="size-4.5 animate-spin" />}
                        className="rounded-md p-2 text-gray-500 hover:bg-red/10 hover:text-red"
                      />
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-dark-6">Belum ada laporan kelompok buat periode ini.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}