import { db } from "@/lib/db";
import { notFound } from "next/navigation";

import { updateHargaFinal } from "../actions";
import { DownloadButton } from "../_component/download-button";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { KwitansiKelompok } from "@/components/kwitansi/kwitansi-kelompok";
import { KirimWAButton } from "@/components/kwitansi/kirim-wa-button";
import { waLink } from "@/lib/phone";
import { linkKwitansi, nomorDariWaLink, pesanKwitansi } from "@/lib/wa-kwitansi";
import { labelPeriode } from "@/lib/kwitansi";
import { getPengaturan } from "@/lib/pengaturan";

export const metadata = { title: "Detail Laporan Kelompok" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const cfg = await getPengaturan();

export default async function DetailRekapKelompokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const laporan = await db.laporanKelompok.findUnique({
    where: { id },
    include: {
      kelompok: { include: { tutor: true, anggota: { include: { siswa: true } } } },
      anggotaLaporan: { include: { siswa: true } },
    },
  });

  if (!laporan) notFound();

  const hargaKelompok = laporan.hargaKelompokFinal ?? laporan.kelompok.hargaKelompok;
  const subtotalKelompok = laporan.jumlahKelompok * hargaKelompok;
  const feeIzinKelompok = laporan.jumlahIzin * cfg.feeIzinOrtu;

  const barisIndividu = laporan.anggotaLaporan
    .filter((a) => a.jumlahIndividu > 0)
    .map((a) => {
      const anggota = laporan.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
      return {
        nama: a.siswa.nama,
        jumlah: a.jumlahIndividu,
        harga: anggota?.hargaPrivat ?? 0,
        subtotal: a.jumlahIndividu * (anggota?.hargaPrivat ?? 0),
      };
    });

  const totalTagihan = subtotalKelompok + feeIzinKelompok + barisIndividu.reduce((sum, b) => sum + b.subtotal, 0);
  const namaAnggota = laporan.kelompok.anggota.map((a) => a.siswa.nama).join(" & ");

  // Fee tutor kelompok (sama dengan logic di rekap-kelompok/page.tsx)
  const feeTutorKelompok = laporan.jumlahKelompok * laporan.kelompok.feeTutorKelompok;
  const feeTutorIndividu = laporan.anggotaLaporan.reduce((sum, a) => {
    const anggota = laporan.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
    return sum + a.jumlahIndividu * (anggota?.feeTutor ?? 0);
  }, 0);
  const feeIzinTutor = laporan.jumlahIzin * cfg.feeIzinTutor;
  const totalFeeTutor = feeTutorKelompok + feeTutorIndividu + feeIzinTutor;

  return (

    <>
      <Breadcrumb pageName="Detail Laporan Kelompok" />
    
      <div className="space-y-5.5">
          <div className="print:hidden flex justify-end gap-2">
            <KirimWAButton
              nomor={nomorDariWaLink(waLink(laporan.kelompok.noHpWali))}
              pesan={pesanKwitansi(
                {
                  namaPenerima: laporan.kelompok.namaWali,
                  namaSiswa: namaAnggota,
                  periode: labelPeriode(laporan.bulan, laporan.tahun, laporan.mingguKe),
                  total: totalTagihan,
                  lunas: laporan.statusBayarOrtu === "lunas",
                  link: linkKwitansi(laporan.shareToken),
                },
                cfg,
              )}
            />
            <DownloadButton filename={`kwitansi-kelompok-${laporan.kelompok.nama}-${BULAN[laporan.bulan - 1]}-${laporan.tahun}`} />
          </div>

        {/* Card Info Tutor — di luar area print */}
        <div className="print:hidden mx-auto max-w-2xl rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-dark dark:text-white">Info Pembayaran Tutor</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-medium uppercase tracking-wide text-dark-6">Fee Tutor</p>
              <p className="mt-1 text-lg font-bold text-dark dark:text-white">Rp {totalFeeTutor.toLocaleString("id-ID")}</p>
              <div className="mt-1 space-y-0.5 text-xs text-dark-6">
                <p>{laporan.jumlahKelompok}x kelompok @Rp {laporan.kelompok.feeTutorKelompok.toLocaleString("id-ID")}</p>
                {barisIndividu.length > 0 && (
                  <p>
                    + {barisIndividu.map((b) => `${b.jumlah}x ${b.nama} @${b.harga.toLocaleString("id-ID")}`).join(", ")}
                  </p>
                )}
                {laporan.jumlahIzin > 0 && <p>+ {laporan.jumlahIzin}x @Rp {cfg.feeIzinTutor.toLocaleString("id-ID")} (izin)</p>}
              </div>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${laporan.statusBayarTutor === "sudah" ? "bg-[#219653]/10 text-[#219653]" : "bg-[#D34053]/10 text-[#D34053]"}`}>
                {laporan.statusBayarTutor === "sudah" ? "Sudah dibayar" : "Belum dibayar"}
              </span>
            </div>
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-medium uppercase tracking-wide text-dark-6">No Rekening / E-Wallet Tutor</p>
              <p className="mt-1 break-all font-mono text-lg font-bold text-dark dark:text-white">{laporan.norekTutor || "-"}</p>
              <p className="mt-1 text-xs text-dark-6">a.n. {laporan.kelompok.tutor.nama}</p>
            </div>
          </div>
        </div>

        <KwitansiKelompok laporan={laporan} cfg={cfg} />

        {laporan.saranBimbel && (
          <div className="print:hidden mx-auto max-w-2xl rounded-[10px] border border-dashed border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-xs font-medium uppercase tracking-wide text-dark-6">Notes Buat Bimbel</p>
            <p className="mt-1 text-sm text-dark dark:text-white">
              <span className="text-dark-6">Saran untuk Bimbel: </span>{laporan.saranBimbel}
            </p>
          </div>
        )}
      </div>
    </>
  );
}