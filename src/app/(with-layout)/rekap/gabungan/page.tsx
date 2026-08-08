import { db } from "@/lib/db";
import { DownloadButton } from "../_component/download-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kwitansi Gabungan" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default async function KwitansiGabunganPage({
  searchParams,
}: {
  searchParams: Promise<{ siswaId?: string; bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const siswaList = await db.siswa.findMany({ orderBy: { nama: "asc" } });

  const siswaId = params.siswaId;
  const bulan = Number(params.bulan);
  const tahun = Number(params.tahun);

  const laporan =
    siswaId && bulan && tahun
      ? await db.laporanBulanan.findMany({
          where: { bulan, tahun, kelas: { siswaId } },
          include: { kelas: { include: { siswa: true, tutor: true } } },
          orderBy: { createdAt: "asc" },
        })
      : [];

  const totalTagihan = laporan.reduce((sum, l) => sum + l.jumlahHadir * l.kelas.biayaOrtu, 0);
  const namaSiswa = laporan[0]?.kelas.siswa.nama;

  return (
    <div className="space-y-5.5">
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <h4 className="mb-2 font-bold text-dark dark:text-white">Kwitansi Gabungan</h4>
        <p className="mb-4 text-sm text-dark-6">
          Buat 1 kwitansi kalau dalam 1 periode siswa sempat diajar lebih dari 1 tutor (misal ganti tutor di tengah bulan).
        </p>
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Siswa</label>
            <select name="siswaId" defaultValue={siswaId} className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none dark:border-dark-3">
              <option value="">Pilih siswa</option>
              {siswaList.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Bulan</label>
            <select name="bulan" defaultValue={bulan || ""} className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none dark:border-dark-3">
              <option value="">Pilih bulan</option>
              {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tahun</label>
            <input type="number" name="tahun" defaultValue={tahun || new Date().getFullYear()} className="w-24 rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none dark:border-dark-3" />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
            Tampilkan
          </button>
        </form>
      </div>

      {laporan.length > 0 && (
        <>
          <div className="print:hidden flex items-center justify-end">
            <DownloadButton filename={`kwitansi-gabungan-${namaSiswa}-${BULAN[bulan - 1]}-${tahun}`} />
          </div>

          <div id="area-cetak" className="mx-auto max-w-2xl overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="h-2 bg-[#F35C2B]" />
            <div className="p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-stroke pb-6 dark:border-dark-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo/logo-bimbel.svg" alt="Bimbel Cermat" className="h-14 w-14 object-contain" />
                <div>
                  <h2 className="text-heading-6 font-bold text-dark dark:text-white">Bimbel Cermat</h2>
                  <p className="text-sm text-dark-6">Kwitansi Gabungan</p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F9FC] p-4 text-sm dark:bg-dark-2">
                <div>
                  <p className="text-dark-6">Nama Siswa</p>
                  <p className="font-medium text-dark dark:text-white">{namaSiswa}</p>
                </div>
                <div>
                  <p className="text-dark-6">Periode</p>
                  <p className="font-medium text-dark dark:text-white">{BULAN[bulan - 1]} {tahun}</p>
                </div>
              </div>

              <table className="mb-6 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-stroke text-left dark:border-dark-3">
                    <th className="py-2 font-medium text-dark-6">Tutor</th>
                    <th className="py-2 text-center font-medium text-dark-6">Hadir</th>
                    <th className="py-2 text-right font-medium text-dark-6">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {laporan.map((l) => (
                    <tr key={l.id} className="border-b border-stroke dark:border-dark-3">
                      <td className="py-2 text-dark dark:text-white">{l.kelas.tutor.nama}</td>
                      <td className="py-2 text-center text-dark dark:text-white">{l.jumlahHadir}x</td>
                      <td className="py-2 text-right text-dark dark:text-white">
                        Rp {(l.jumlahHadir * l.kelas.biayaOrtu).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-2 flex items-center justify-between rounded-lg bg-[#F35C2B]/10 px-5 py-4">
                <p className="text-sm text-dark-6">Total Tagihan</p>
                <p className="text-heading-6 font-bold text-[#F35C2B]">
                  Rp {totalTagihan.toLocaleString("id-ID")}
                </p>
              </div>

              <p className="border-t border-stroke pt-4 text-center text-xs text-dark-6 dark:border-dark-3">
                Terima kasih atas kepercayaannya — Bimbel Cermat
              </p>
            </div>
          </div>
        </>
      )}

      {siswaId && bulan && tahun && laporan.length === 0 && (
        <p className="text-dark-6">Gak ada laporan buat siswa & periode ini.</p>
      )}
    </div>
  );
}