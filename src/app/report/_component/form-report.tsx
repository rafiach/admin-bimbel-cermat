"use client";

import { useActionState, useState } from "react";
import { createLaporan, type ReportState } from "../actions";

type Kelas = { id: string; jadwal: string; tutorId: string; siswa: { nama: string } };
type Tutor = { id: string; nama: string };

export function LaporForm({ tutorList, kelasList }: { tutorList: Tutor[]; kelasList: Kelas[] }) {
  const [tutorId, setTutorId] = useState("");
  const [state, formAction, pending] = useActionState<ReportState, FormData>(createLaporan, null);

  const kelasTutorIni = kelasList.filter((k) => k.tutorId === tutorId);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Nama kamu (Tutor)</label>
        <select
          value={tutorId}
          onChange={(e) => setTutorId(e.target.value)}
          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
        >
          <option value="">Pilih nama kamu</option>
          {tutorList.map((t) => <option key={t.id} value={t.id}>{t.nama}</option>)}
        </select>
      </div>

      {tutorId && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Siswa & Jadwal</label>
          <select
            name="kelasId"
            required
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
          >
            <option value="">Pilih siswa</option>
            {kelasTutorIni.map((k) => (
              <option key={k.id} value={k.id}>{k.siswa.nama} — {k.jadwal}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tanggal Les</label>
        <input type="date" name="tanggal" required className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Catat Kehadiran"}
      </button>

      {state && <p className={state.success ? "text-[#219653]" : "text-red"}>{state.message}</p>}
    </form>
  );
}