import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateLaporanKelompok } from "../../actions";
import LaporanKelompokEditForm from "../../_components/laporan-kelompok-edit-form";

export const metadata = { title: "Edit Laporan Kelompok" };

export default async function EditLaporanKelompokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const laporan = await db.laporanKelompok.findUnique({
    where: { id },
    include: {
      kelompok: { 
        include: { 
          tutor: true, 
          anggota: { include: { siswa: true } } 
        } 
      },
      anggotaLaporan: true,
      tanggalPertemuan: { orderBy: { tanggal: "asc" } },
    },
  });

  if (!laporan) notFound();

  return (
    <>
      <Breadcrumb pageName="Edit Laporan Kelompok" />
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">
          {laporan.kelompok.nama} — {laporan.kelompok.tutor.nama}
        </p>
        <LaporanKelompokEditForm 
          laporan={{
            id: laporan.id,
            kelompokId: laporan.kelompokId,
            bulan: laporan.bulan,
            tahun: laporan.tahun,
            tipePeriode: laporan.tipePeriode,
            mingguKe: laporan.mingguKe,
            jumlahKelompok: laporan.jumlahKelompok,
            jumlahIzin: laporan.jumlahIzin,
            hargaKelompokFinal: laporan.hargaKelompokFinal,
            materiDipelajari: laporan.materiDipelajari,
            pemahamanMateri: laporan.pemahamanMateri,
            keaktifanBelajar: laporan.keaktifanBelajar,
            kemandirian: laporan.kemandirian,
            kedisiplinan: laporan.kedisiplinan,
            catatanSiswa: laporan.catatanSiswa,
            saranBimbel: laporan.saranBimbel,
            norekTutor: laporan.norekTutor,
            kelompok: { 
              nama: laporan.kelompok.nama, 
              tutor: { nama: laporan.kelompok.tutor.nama },
              anggota: laporan.kelompok.anggota.map(a => ({ 
                siswaId: a.siswaId, 
                siswa: { nama: a.siswa.nama } 
              })) 
            },
            tanggalPertemuan: laporan.tanggalPertemuan.map(d => ({ tanggal: d.tanggal })),
            anggotaLaporan: laporan.anggotaLaporan.map(a => ({ 
              siswaId: a.siswaId, 
              jumlahIndividu: a.jumlahIndividu 
            })),
          }} 
        />
      </div>
    </>
  );
}