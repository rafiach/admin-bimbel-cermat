import { db } from "@/lib/db";
import { notFound } from "next/navigation";

import { updateHargaFinal } from "../actions";
import { DownloadButton } from "../_component/download-button";

export const metadata = { title: "Detail Laporan Kelompok" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

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

  const totalTagihan = subtotalKelompok + barisIndividu.reduce((sum, b) => sum + b.subtotal, 0);
  const namaAnggota = laporan.kelompok.anggota.map((a) => a.siswa.nama).join(" & ");

  return (
    <div className="space-y-5.5">
      <div className="print:hidden space-y-3">
        <form action={updateHargaFinal} className="flex items-end gap-3 rounded-[10px] border border-dashed border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark">
          <input type="hidden" name="id" value={laporan.id} />
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Harga Kelompok Final (buat kwitansi ini aja, default Rp{laporan.kelompok.hargaKelompok.toLocaleString("id-ID")})
            </label>
            <input
              type="number"
              name="hargaKelompokFinal"
              defaultValue={hargaKelompok}
              className="w-48 rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-dark-3"
            />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
            Simpan
          </button>
        </form>

        <div className="flex justify-end">
          <DownloadButton filename={`kwitansi-kelompok-${laporan.kelompok.nama}-${BULAN[laporan.bulan - 1]}-${laporan.tahun}`} />
        </div>
      </div>

      <div id="area-cetak" className="relative mx-auto max-w-2xl overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1">
        <div className="h-2 bg-[#F35C2B]" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo-bimbel.svg" alt="" className="w-2/3 opacity-[0.06] grayscale" />
        </div>

        <div className="relative z-10 p-8">
          <div className="mb-6 flex items-center gap-4 border-b border-stroke pb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo-bimbel.svg" alt="Bimbel Cermat" className="h-14 w-14 object-contain" />
            <div>
              <h2 className="text-heading-6 font-bold text-dark">Bimbel Cermat</h2>
              <p className="text-sm text-dark-6">Kwitansi Kelompok</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F9FC] p-4 text-sm">
            <div>
              <p className="text-dark-6">Nama Kelompok</p>
              <p className="font-medium text-dark">{namaAnggota}</p>
            </div>
            <div>
              <p className="text-dark-6">Tutor</p>
              <p className="font-medium text-dark">{laporan.kelompok.tutor.nama}</p>
            </div>
            <div>
              <p className="text-dark-6">Periode</p>
              <p className="font-medium text-dark">{BULAN[laporan.bulan - 1]} {laporan.tahun}</p>
            </div>
            <div>
              <p className="text-dark-6">Jadwal</p>
              <p className="font-medium text-dark">{laporan.kelompok.jadwal}</p>
            </div>
          </div>

          <table className="mb-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-stroke text-left">
                <th className="py-2 font-medium text-dark-6">Rincian</th>
                <th className="py-2 text-center font-medium text-dark-6">Jumlah</th>
                <th className="py-2 text-right font-medium text-dark-6">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stroke">
                <td className="py-2 text-dark">Kelompok @ Rp{hargaKelompok.toLocaleString("id-ID")}</td>
                <td className="py-2 text-center text-dark">{laporan.jumlahKelompok}x</td>
                <td className="py-2 text-right text-dark">Rp {subtotalKelompok.toLocaleString("id-ID")}</td>
              </tr>
              {barisIndividu.map((b) => (
                <tr key={b.nama} className="border-b border-stroke">
                  <td className="py-2 text-dark">{b.nama} (privat) @ Rp{b.harga.toLocaleString("id-ID")}</td>
                  <td className="py-2 text-center text-dark">{b.jumlah}x</td>
                  <td className="py-2 text-right text-dark">Rp {b.subtotal.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-6 flex items-center justify-between rounded-lg bg-[#F35C2B]/10 px-5 py-4">
            <p className="text-sm text-dark-6">Total Tagihan</p>
            <p className="text-heading-6 font-bold text-[#F35C2B]">Rp {totalTagihan.toLocaleString("id-ID")}</p>
          </div>

          {laporan.materiDipelajari && (
            <p className="mb-3 text-sm text-dark">
              <span className="text-dark-6">Materi dipelajari: </span>{laporan.materiDipelajari}
            </p>
          )}

          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
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
            <p className="mb-3 text-sm text-dark">
              <span className="text-dark-6">Catatan & saran: </span>{laporan.catatanSiswa}
            </p>
          )}

          <p className="border-t border-stroke pt-4 text-center text-xs text-dark-6">
            Terima kasih atas kepercayaannya — Bimbel Cermat
          </p>
        </div>
      </div>

      {laporan.saranBimbel && (
        <div className="print:hidden mx-auto max-w-2xl rounded-[10px] border border-dashed border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-xs font-medium uppercase tracking-wide text-dark-6">Internal — gak ikut ke-download</p>
          <p className="mt-1 text-sm text-dark dark:text-white">
            <span className="text-dark-6">No Rekening Tutor: </span>{laporan.norekTutor}
          </p>
          <p className="mt-1 text-sm text-dark dark:text-white">
            <span className="text-dark-6">Saran untuk Bimbel: </span>{laporan.saranBimbel}
          </p>
        </div>
      )}
    </div>
  );
}