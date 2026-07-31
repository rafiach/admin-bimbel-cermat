import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { DownloadButton } from "../_component/download-button";
export const dynamic = "force-dynamic";

export const metadata = { title: "Detail Laporan" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// fee kompensasi
const FEE_IZIN = 5000;

export default async function DetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const laporan = await db.laporanBulanan.findUnique({
    where: { id },
    include: { kelas: { include: { siswa: true, tutor: true } } },
  });

  if (!laporan) notFound();

  const tagihanOrtu = laporan.jumlahHadir * laporan.kelas.biayaOrtu + laporan.jumlahIzin * FEE_IZIN;

  return (
    <>
      <Breadcrumb pageName="Detail Laporan" />

      <div className="space-y-5.5">
        <div className="print:hidden flex items-center justify-end">
          <DownloadButton filename={`kwitansi-${laporan.kelas.siswa.nama}-${BULAN[laporan.bulan - 1]}-${laporan.tahun}`}/>
        </div>

        <div
          id="area-cetak"
          className="relative mx-auto max-w-2xl overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1"
        >
          <div className="h-2 bg-[#F35C2B]" />

          {/* Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo-icon-bimbel.svg" alt="" className="w-2/3 opacity-[0.2] grayscale" />
          </div>

          <div className="relative z-10 p-8">
            <div className="mb-6 flex items-center gap-4 border-b border-stroke pb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo-icon-bimbel.svg" alt="Bimbel Cermat" className="h-18 w-18 object-contain" />
              <div>
                <h2 className="text-heading-6 font-bold text-dark">Bimbel Cermat</h2>
                <p className="text-sm text-dark-6">Kwitansi & Rekap Perkembangan Belajar</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4 text-sm">
              <div>
                <p className="text-dark-6">Nama Siswa</p>
                <p className="font-medium text-dark">{laporan.kelas.siswa.nama}</p>
              </div>
              <div>
                <p className="text-dark-6">Tutor</p>
                <p className="font-medium text-dark">{laporan.kelas.tutor.nama}</p>
              </div>
              <div>
                <p className="text-dark-6">Periode</p>
                <p className="font-medium text-dark">{BULAN[laporan.bulan - 1]} {laporan.tahun}</p>
              </div>
              <div>
                <p className="text-dark-6">Jadwal</p>
                <p className="font-medium text-dark">{laporan.kelas.jadwal}</p>
              </div>
            </div>

            <table className="mb-6 w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-stroke">
                  <td className="py-2 text-dark">Jumlah Hadir</td>
                  <td className="py-2 text-right text-dark">{laporan.jumlahHadir}x</td>
                </tr>
                <tr className="border-b border-stroke">
                  <td className="py-2 text-dark">Biaya per Pertemuan</td>
                  <td className="py-2 text-right text-dark">
                    Rp {laporan.kelas.biayaOrtu.toLocaleString("id-ID")}
                  </td>
                </tr>
                {laporan.jumlahIzin > 0 && (
                  <tr className="border-b border-stroke">
                    <td className="py-2 text-dark">Izin Mendadak</td>
                    <td className="py-2 text-right text-dark-6">{laporan.jumlahIzin}x (tidak ditagih)</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mb-6 flex items-center justify-between rounded-lg bg-[#F35C2B]/10 px-5 py-4">
              <div>
                <p className="text-sm text-dark-6">Total Tagihan</p>
                <p className="text-heading-6 font-bold text-[#F35C2B]">
                  Rp {tagihanOrtu.toLocaleString("id-ID")}
                </p>
              </div>
              <span
                className={
                  laporan.statusBayarOrtu === "lunas"
                    ? "rounded-full border-2 border-[#219653] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-[#219653]"
                    : "rounded-full border-2 border-[#D34053] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-[#D34053]"
                }
              >
                {laporan.statusBayarOrtu === "lunas" ? "Lunas" : "Belum Lunas"}
              </span>
            </div>

            <div className="mb-4">
              <h5 className="mb-3 font-medium text-dark">Rekap Perkembangan Belajar</h5>

              {laporan.materiDipelajari && (
                <p className="mb-3 text-sm text-dark">
                  <span className="text-dark-6">Materi dipelajari: </span>{laporan.materiDipelajari}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                  <span className="text-dark">Pemahaman Materi</span>
                  <span className="font-medium text-primary">{laporan.pemahamanMateri}/5</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                  <span className="text-dark">Keaktifan Belajar</span>
                  <span className="font-medium text-primary">{laporan.keaktifanBelajar}/5</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                  <span className="text-dark">Kemandirian</span>
                  <span className="font-medium text-primary">{laporan.kemandirian}/5</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                  <span className="text-dark">Kedisiplinan</span>
                  <span className="font-medium text-primary">{laporan.kedisiplinan}/5</span>
                </div>
              </div>

              {laporan.catatanSiswa && (
                <p className="mt-3 text-sm text-dark">
                  <span className="text-dark-6">Catatan & saran untuk siswa: </span>{laporan.catatanSiswa}
                </p>
              )}
            </div>

            <p className="border-t border-stroke pt-4 text-center text-xs text-dark-6">
              Terima kasih atas kepercayaannya — Bimbel Cermat
            </p>
          </div>
        </div>
        <div className="print:hidden mx-auto max-w-2xl space-y-2 rounded-[10px] border border-dashed border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-xs font-medium uppercase tracking-wide text-dark-6">Notes Buat Bimbel</p>
          <p className="text-sm text-dark dark:text-white">
            <span className="text-dark-6">No Rekening Tutor: </span>{laporan.norekTutor}
          </p>
          {laporan.saranBimbel && (
            <p className="text-sm text-dark dark:text-white">
              <span className="text-dark-6">Saran untuk Bimbel: </span>{laporan.saranBimbel}
            </p>
          )}
        </div>
      </div>
    </>
  );
}