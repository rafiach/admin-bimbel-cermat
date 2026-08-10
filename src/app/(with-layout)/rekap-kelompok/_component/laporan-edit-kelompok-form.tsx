"use client";

import { SubmitButton } from "@/components/FormElements/submit-button";
import { useState } from "react";

type Anggota = { siswaId: string; siswa: { nama: string } };
type AnggotaLaporan = { siswaId: string; jumlahIndividu: number };
type LaporanData = {
  jumlahKelompok: number;
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
  saranBimbel: string | null;
  norekTutor: string | null;
  kelompok: { anggota: Anggota[] };
  anggotaLaporan: AnggotaLaporan[];
};

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3";

export function LaporanKelompokEditForm({
  laporan,
  action,
}: {
  laporan: LaporanData;
  action: (formData: FormData) => void;
}) {
  const [jumlahIndividu, setJumlahIndividu] = useState<Record<string, string>>(
    Object.fromEntries(
      laporan.kelompok.anggota.map((a) => {
        const existing = laporan.anggotaLaporan.find((al) => al.siswaId === a.siswaId);
        return [a.siswaId, existing ? String(existing.jumlahIndividu) : ""];
      }),
    ),
  );

  const handleSubmit = (formData: FormData) => {
    const anggotaIndividuData = Object.entries(jumlahIndividu)
      .filter(([, v]) => v !== "" && Number(v) > 0)
      .map(([siswaId, v]) => ({ siswaId, jumlahIndividu: Number(v) }));

    formData.set("anggotaIndividuData", JSON.stringify(anggotaIndividuData));
    action(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-5.5">
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kelompok Masuk Berapa Kali</label>
        <input type="number" name="jumlahKelompok" defaultValue={laporan.jumlahKelompok} required min={0} className={inputClass} />
      </div>

      <div className="rounded-lg border border-dashed border-stroke p-4 dark:border-dark-3">
        <p className="mb-3 text-sm font-medium text-dark dark:text-white">Yang masuk sendiri-sendiri</p>
        <div className="space-y-3">
          {laporan.kelompok.anggota.map((a) => (
            <div key={a.siswaId} className="flex items-center justify-between gap-3">
              <span className="text-sm text-dark dark:text-white">{a.siswa.nama}</span>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={jumlahIndividu[a.siswaId] ?? ""}
                onChange={(e) => setJumlahIndividu((prev) => ({ ...prev, [a.siswaId]: e.target.value }))}
                className="w-24 rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-dark-3"
              />
            </div>
          ))}
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

      <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
        Simpan Perubahan
      </SubmitButton>
    </form>
  );
}