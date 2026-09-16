import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EditLaporanForm from "./EditLaporanForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Laporan" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default async function EditLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const laporan = await db.laporanBulanan.findUnique({
    where: { id },
    include: { 
      kelas: { include: { siswa: true, tutor: true } },
      tanggalPertemuan: { orderBy: { tanggal: "asc" } },
    },
  });

  if (!laporan) notFound();

  return (
    <>
      <Breadcrumb pageName="Edit Laporan" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">
          {laporan.kelas.siswa.nama} — {laporan.kelas.tutor.nama} — {BULAN[laporan.bulan - 1]} {laporan.tahun}
        </p>

        <EditLaporanForm 
          laporan={{
            id: laporan.id,
            kelasId: laporan.kelasId,
            bulan: laporan.bulan,
            tahun: laporan.tahun,
            tipePeriode: laporan.tipePeriode,
            mingguKe: laporan.mingguKe,
            jumlahHadir: laporan.jumlahHadir,
            jumlahIzin: laporan.jumlahIzin,
            norekTutor: laporan.norekTutor,
            materiDipelajari: laporan.materiDipelajari,
            pemahamanMateri: laporan.pemahamanMateri,
            keaktifanBelajar: laporan.keaktifanBelajar,
            kemandirian: laporan.kemandirian,
            kedisiplinan: laporan.kedisiplinan,
            catatanSiswa: laporan.catatanSiswa,
            saranBimbel: laporan.saranBimbel,
            kelas: { siswa: { nama: laporan.kelas.siswa.nama }, tutor: { nama: laporan.kelas.tutor.nama } },
            tanggalPertemuan: laporan.tanggalPertemuan.map(d => ({ tanggal: d.tanggal })),
          }} 
        />
      </div>
    </>
  );
}