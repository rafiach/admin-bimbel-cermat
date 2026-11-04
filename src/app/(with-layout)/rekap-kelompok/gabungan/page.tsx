import { Combobox } from "@/components/FormElements/combobox";
import { db } from "@/lib/db";
import { GabunganKelompokKwitansi } from "./_component/gabungan-kelompok-kwitansi";
import { toItemKelompok } from "@/lib/kwitansi";
import { nomorDariWaLink } from "@/lib/wa-kwitansi";
import { waLink } from "@/lib/phone";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kwitansi Gabungan Kelompok" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const FEE_IZIN = 10000;

export default async function KwitansiGabunganKelompokPage({
  searchParams,
}: {
  searchParams: Promise<{ kelompokId?: string; bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const kelompokList = await db.kelompok.findMany({ orderBy: { nama: "asc" } });

  const kelompokId = params.kelompokId;
  const bulan = Number(params.bulan);
  const tahun = Number(params.tahun);

  const laporan =
    kelompokId && bulan && tahun
      ? await db.laporanKelompok.findMany({
          where: { kelompokId, bulan, tahun },
          include: { kelompok: { include: { tutor: true, anggota: { include: { siswa: true } } } }, anggotaLaporan: { include: { siswa: true } } },
          orderBy: { createdAt: "asc" },
        })
      : [];

  const namaKelompok = laporan[0]?.kelompok.nama;
  const tutorNama = laporan[0]?.kelompok.tutor.nama;

  const items = laporan.map(toItemKelompok);

  return (
    <div className="space-y-5.5">
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <h4 className="mb-2 font-bold text-dark dark:text-white">Kwitansi Gabungan Kelompok</h4>
        <p className="mb-4 text-sm text-dark-6">
          Buat 1 kwitansi kalau dalam 1 periode kelompok punya beberapa laporan.
        </p>
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kelompok</label>
            <Combobox
              name="kelompokId"
              placeholder="Cari nama kelompok..."
              defaultValue={kelompokId}
              options={kelompokList.map((k) => ({ value: k.id, label: k.nama }))}
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
        <GabunganKelompokKwitansi
          namaKelompok={namaKelompok!}
          namaAnggota={laporan[0].kelompok.anggota.map((a) => a.siswa.nama).join(" & ")}
          namaWali={laporan[0].kelompok.namaWali}
          nomor={nomorDariWaLink(waLink(laporan[0].kelompok.noHpWali))}
          tutorNama={tutorNama!}
          periodeLabel={`${BULAN[bulan - 1]} ${tahun}`}
          items={items}
          filenamePrefix={`kwitansi-gabungan-${namaKelompok}-${BULAN[bulan - 1]}-${tahun}`}
        />
      )}

      {kelompokId && bulan && tahun && items.length === 0 && (
        <p className="text-dark-6">Gak ada laporan buat kelompok & periode ini.</p>
      )}
    </div>
  );
}