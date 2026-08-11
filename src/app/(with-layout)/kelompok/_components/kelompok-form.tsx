"use client";

import { Combobox } from "@/components/FormElements/combobox";
import InputGroup from "@/components/FormElements/InputGroup";
import { PhoneInputGroup } from "@/components/FormElements/phone-input";
import { Select } from "@/components/FormElements/select";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { useState } from "react";

type Opsi = { id: string; nama: string };
type AnggotaState = { hargaPrivat: string; feeTutorPrivat: string };

export function KelompokForm({
  tutorList,
  siswaList,
  action,
}: {
  tutorList: Opsi[];
  siswaList: Opsi[];
  action: (formData: FormData) => void;
}) {
  const [selected, setSelected] = useState<Record<string, AnggotaState>>({});

  const toggleSiswa = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = { hargaPrivat: "", feeTutorPrivat: "" };
      return next;
    });
  };

  const updateField = (id: string, field: keyof AnggotaState, value: string) => {
    setSelected((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSubmit = (formData: FormData) => {
    const anggotaData = Object.entries(selected)
      .filter(([, v]) => v.hargaPrivat !== "" && v.feeTutorPrivat !== "")
      .map(([siswaId, v]) => ({
        siswaId,
        hargaPrivat: Number(v.hargaPrivat),
        feeTutorPrivat: Number(v.feeTutorPrivat),
      }));

    formData.set("anggotaData", JSON.stringify(anggotaData));
    action(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-5.5">
      <InputGroup label="Nama Kelompok" name="nama" type="text" placeholder="Misal: A & B - Senin Kamis" required />

      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Tutor</label>
        <Combobox
          name="tutorId"
          placeholder="Ketik nama tutor..."
          options={tutorList.map((t) => ({ value: t.id, label: t.nama }))}
          required
        />
      </div>

      <InputGroup label="Jadwal" name="jadwal" type="text" placeholder="Misal: Senin & Kamis, 15:00" required />

      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="Harga Kelompok (per sesi)" name="hargaKelompok" type="number" placeholder="Misal: 50000" required />
        <InputGroup label="Fee Tutor (per sesi kelompok)" name="feeTutorKelompok" type="number" placeholder="Misal: 40000" required />
      </div>

      <InputGroup label="Nama Wali (penerima tagihan gabungan)" name="namaWali" type="text" placeholder="Nama orang tua/wali" />

      <PhoneInputGroup label="No HP Wali (WhatsApp)" name="noHpWali" />

      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Anggota Kelompok (minimal 2) — isi harga kalau anak ini sesekali masuk sendiri
        </label>

        <div className="space-y-3 rounded-lg border border-stroke p-4 dark:border-dark-3">
          {siswaList.map((s) => {
            const isChecked = s.id in selected;
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-3">
                <label className="flex min-w-[140px] flex-1 items-center gap-2">
                  <input type="checkbox" checked={isChecked} onChange={() => toggleSiswa(s.id)} />
                  <span className="text-dark dark:text-white">{s.nama}</span>
                </label>

                {isChecked && (
                  <>
                    <input
                      type="number"
                      placeholder="Harga privat"
                      value={selected[s.id].hargaPrivat}
                      onChange={(e) => updateField(s.id, "hargaPrivat", e.target.value)}
                      className="w-32 rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-dark-3"
                    />
                    <input
                      type="number"
                      placeholder="Fee tutor privat"
                      value={selected[s.id].feeTutorPrivat}
                      onChange={(e) => updateField(s.id, "feeTutorPrivat", e.target.value)}
                      className="w-32 rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-dark-3"
                    />
                  </>
                )}
              </div>
            );
          })}

          {siswaList.length === 0 && <p className="text-dark-6">Belum ada siswa aktif.</p>}
        </div>
      </div>

      <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
        Simpan Kelompok
      </SubmitButton>
    </form>
  );
}