import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateLaporan } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Laporan" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3";

export default async function EditLaporanPage({
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

  const updateLaporanWithId = updateLaporan.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Laporan" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">
          {laporan.kelas.siswa.nama} — {laporan.kelas.tutor.nama} — {BULAN[laporan.bulan - 1]} {laporan.tahun}
        </p>

        <form action={updateLaporanWithId} className="space-y-5.5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Hadir</label>
              <input type="number" name="jumlahHadir" defaultValue={laporan.jumlahHadir} required min={0} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
              <input type="number" name="jumlahIzin" defaultValue={laporan.jumlahIzin} min={0} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Materi yang Dipelajari</label>
            <textarea name="materiDipelajari" rows={3} defaultValue={laporan.materiDipelajari ?? ""} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Pemahaman Materi (1-5)</label>
              <select name="pemahamanMateri" defaultValue={laporan.pemahamanMateri} required className={inputClass}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Keaktifan Belajar (1-5)</label>
              <select name="keaktifanBelajar" defaultValue={laporan.keaktifanBelajar} required className={inputClass}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kemandirian (1-5)</label>
              <select name="kemandirian" defaultValue={laporan.kemandirian} required className={inputClass}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kedisiplinan (1-5)</label>
              <select name="kedisiplinan" defaultValue={laporan.kedisiplinan} required className={inputClass}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Catatan & Saran untuk Siswa</label>
            <textarea name="catatanSiswa" rows={3} defaultValue={laporan.catatanSiswa ?? ""} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Saran untuk Bimbel</label>
            <textarea name="saranBimbel" rows={2} defaultValue={laporan.saranBimbel ?? ""} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening Tutor</label>
            <input type="text" name="norekTutor" defaultValue={laporan.norekTutor ?? ""} className={inputClass} />
          </div>

          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </>
  );
}