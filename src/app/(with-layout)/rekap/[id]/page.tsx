import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { DownloadButton } from "../_component/download-button";
import { KwitansiPrivat } from "@/components/kwitansi/kwitansi-privat";
import { linkKwitansi, nomorDariWaLink, pesanKwitansi } from "@/lib/wa-kwitansi";
import { KirimWAButton } from "@/components/kwitansi/kirim-wa-button";
import { waLink } from "@/lib/phone";
import { labelPeriode, tagihanPrivat } from "@/lib/kwitansi";
export const dynamic = "force-dynamic";

export const metadata = { title: "Detail Laporan" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// fee kompensasi
const FEE_IZIN = 10000;

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
  const feeTutor = laporan.jumlahHadir * laporan.kelas.feeTutor + laporan.jumlahIzin * FEE_IZIN;

  return (
    <>
      <Breadcrumb pageName="Detail Laporan" />

      <div className="space-y-5.5">
        <div className="print:hidden flex items-center justify-end gap-2">
          <KirimWAButton
            nomor={nomorDariWaLink(waLink(laporan.kelas.siswa.noHpOrtu))}
            pesan={pesanKwitansi({
              namaPenerima: laporan.kelas.siswa.namaOrtu,
              namaSiswa: laporan.kelas.siswa.nama,
              periode: labelPeriode(laporan.bulan, laporan.tahun, laporan.mingguKe),
              total: tagihanPrivat(laporan.jumlahHadir, laporan.jumlahIzin, laporan.kelas.biayaOrtu),
              lunas: laporan.statusBayarOrtu === "lunas",
              link: linkKwitansi(laporan.shareToken),
            })}
          />
          <DownloadButton filename={`kwitansi-${laporan.kelas.siswa.nama}-${BULAN[laporan.bulan - 1]}-${laporan.tahun}`}/>
        </div>

        {/* Card Info Tutor — di luar area print */}
        <div className="print:hidden mx-auto max-w-2xl rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dark dark:text-white">Info Pembayaran Tutor</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-medium uppercase tracking-wide text-dark-6">Fee Tutor</p>
              <p className="mt-1 text-lg font-bold text-dark dark:text-white">Rp {feeTutor.toLocaleString("id-ID")}</p>
              <p className="mt-1 text-xs text-dark-6">
                {laporan.jumlahHadir}x @Rp {laporan.kelas.feeTutor.toLocaleString("id-ID")}
                {laporan.jumlahIzin > 0 && ` + ${laporan.jumlahIzin}x @Rp ${FEE_IZIN.toLocaleString("id-ID")} (izin)`}
              </p>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${laporan.statusBayarTutor === "sudah" ? "bg-[#219653]/10 text-[#219653]" : "bg-[#D34053]/10 text-[#D34053]"}`}>
                {laporan.statusBayarTutor === "sudah" ? "Sudah dibayar" : "Belum dibayar"}
              </span>
            </div>
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-medium uppercase tracking-wide text-dark-6">No Rekening / E-Wallet Tutor</p>
              <p className="mt-1 break-all font-mono text-lg font-bold text-dark dark:text-white">{laporan.norekTutor || "-"}</p>
              <p className="mt-1 text-xs text-dark-6">a.n. {laporan.kelas.tutor.nama}</p>
            </div>
          </div>
        </div>
        <KwitansiPrivat laporan={laporan} />
        <div className="print:hidden mx-auto max-w-2xl space-y-2 rounded-[10px] border border-dashed border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-xs font-medium uppercase tracking-wide text-dark-6">Notes Buat Bimbel</p>
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