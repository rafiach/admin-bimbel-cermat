import { db } from "@/lib/db";
import { GabunganKwitansi } from "./_component/gabungan-kwitansi";
import { Combobox } from "@/components/FormElements/combobox";

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

  const namaSiswa = laporan[0]?.kelas.siswa.nama;

  const items = laporan.map((l) => ({
    id: l.id,
    tutorNama: l.kelas.tutor.nama,
    jumlahHadir: l.jumlahHadir,
    biayaOrtu: l.kelas.biayaOrtu,
    mingguKe: l.mingguKe,
    statusBayarOrtu: l.statusBayarOrtu,
    materiDipelajari: l.materiDipelajari,
    pemahamanMateri: l.pemahamanMateri,
    keaktifanBelajar: l.keaktifanBelajar,
    kemandirian: l.kemandirian,
    kedisiplinan: l.kedisiplinan,
    catatanSiswa: l.catatanSiswa,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-5.5">
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <h4 className="mb-2 font-bold text-dark dark:text-white">Kwitansi Gabungan</h4>
        <p className="mb-4 text-sm text-dark-6">
          Buat 1 kwitansi kalau dalam 1 periode privat punya beberapa laporan.
        </p>
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Siswa</label>
            <Combobox
              name="siswaId"
              placeholder="Cari nama siswa..."
              options={siswaList.map((s) => ({ value: s.id, label: s.nama }))}
            />
          </div>
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
            <input type="number" name="tahun" defaultValue={tahun || new Date().getFullYear()} className="w-24 rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none dark:border-dark-3" />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-opacity-90">
            Tampilkan
          </button>
        </form>
      </div>

      {items.length > 0 && (
        <GabunganKwitansi
          namaSiswa={namaSiswa!}
          periodeLabel={`${BULAN[bulan - 1]} ${tahun}`}
          items={items}
          filenamePrefix={`kwitansi-gabungan-${namaSiswa}-${BULAN[bulan - 1]}-${tahun}`}
        />
      )}

      {siswaId && bulan && tahun && items.length === 0 && (
        <p className="text-dark-6">Gak ada laporan buat siswa & periode ini.</p>
      )}
    </div>
  );
}