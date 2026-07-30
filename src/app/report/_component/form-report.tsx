"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createLaporan, type LaporState } from "../actions";

type Kelas = { id: string; jadwal: string; tutorId: string; siswa: { nama: string } };
type Tutor = { id: string; nama: string };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const RATING_FIELDS = [
  { name: "pemahamanMateri", label: "Pemahaman Materi" },
  { name: "keaktifanBelajar", label: "Keaktifan Belajar" },
  { name: "kemandirian", label: "Kemandirian Mengerjakan Soal" },
  { name: "kedisiplinan", label: "Kedisiplinan" },
];

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-[#F35C2B] dark:border-dark-3";

export function ReportForm({ tutorList, kelasList }: { tutorList: Tutor[]; kelasList: Kelas[] }) {
  const [tutorId, setTutorId] = useState("");
  const [state, formAction, pending] = useActionState<LaporState, FormData>(createLaporan, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const kelasTutorIni = kelasList.filter((k) => k.tutorId === tutorId);
  const now = new Date();

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Nama Tutor</label>
        <select value={tutorId} onChange={(e) => setTutorId(e.target.value)} className={inputClass}>
          <option value="">Pilih nama kamu</option>
          {tutorList.map((t) => <option key={t.id} value={t.id}>{t.nama}</option>)}
        </select>
      </div>

      {tutorId && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Nama Siswa & Kelas</label>
          <select name="kelasId" required className={inputClass}>
            <option value="">Pilih siswa</option>
            {kelasTutorIni.map((k) => (
              <option key={k.id} value={k.id}>{k.siswa.nama} — {k.jadwal}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Periode Bulan</label>
          <select name="bulan" required defaultValue={now.getMonth() + 1} className={inputClass}>
            {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tahun</label>
          <input type="number" name="tahun" required defaultValue={now.getFullYear()} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Hadir</label>
          <input type="number" name="jumlahHadir" required min={0} className={inputClass} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
          <input type="number" name="jumlahIzin" defaultValue={0} min={0} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Materi yang Dipelajari Bulan Ini</label>
        <textarea name="materiDipelajari" rows={3} className={inputClass} />
      </div>

      {RATING_FIELDS.map((f) => (
        <div key={f.name}>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{f.label} (1-5)</label>
          <select name={f.name} required defaultValue="" className={inputClass}>
            <option value="" disabled>Pilih nilai</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ))}

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Catatan & Saran untuk Siswa</label>
        <textarea name="catatanSiswa" rows={3} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Saran untuk Bimbel</label>
        <textarea name="saranBimbel" rows={2} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#F35C2B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d94e21] disabled:opacity-60"
      >
        {pending ? "Mengirim..." : "Kirim Laporan"}
      </button>
    </form>
  );
}