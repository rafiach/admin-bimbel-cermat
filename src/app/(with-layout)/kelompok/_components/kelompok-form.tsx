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
  const [query, setQuery] = useState("");

  const addSiswa = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: { hargaPrivat: "", feeTutorPrivat: "" } }));
    setQuery("");
  };

  const removeSiswa = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[id];
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

  const belumDipilih = siswaList.filter((s) => !(s.id in selected));
  const hasilCari = query
    ? belumDipilih.filter((s) => s.nama.toLowerCase().includes(query.toLowerCase()))
    : belumDipilih;

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

        {/* Anggota yang udah dipilih */}
        {Object.keys(selected).length > 0 && (
          <div className="mb-3 space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            {Object.entries(selected).map(([id, v]) => {
              const siswa = siswaList.find((s) => s.id === id);
              return (
                <div key={id} className="flex flex-wrap items-center gap-3">
                  <div className="flex min-w-[140px] flex-1 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeSiswa(id)}
                      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red text-white hover:bg-opacity-80"
                      aria-label={`Hapus ${siswa?.nama}`}
                    >
                      ×
                    </button>
                    <span className="text-dark dark:text-white">{siswa?.nama}</span>
                  </div>

                  <input
                    type="number"
                    placeholder="Harga privat"
                    value={v.hargaPrivat}
                    onChange={(e) => updateField(id, "hargaPrivat", e.target.value)}
                    className="w-32 rounded-lg border border-stroke bg-white px-3 py-2 text-sm outline-none dark:border-dark-3 dark:bg-dark-2"
                  />
                  <input
                    type="number"
                    placeholder="Fee tutor privat"
                    value={v.feeTutorPrivat}
                    onChange={(e) => updateField(id, "feeTutorPrivat", e.target.value)}
                    className="w-32 rounded-lg border border-stroke bg-white px-3 py-2 text-sm outline-none dark:border-dark-3 dark:bg-dark-2"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Cari & tambah anggota baru */}
        <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama siswa buat ditambahin..."
            className="mb-3 w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-dark-3"
          />

          <div className="max-h-56 space-y-1 overflow-y-auto">
            {hasilCari.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => addSiswa(s.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-2 dark:hover:bg-dark-2"
              >
                <span className="text-dark dark:text-white">{s.nama}</span>
                <span className="text-primary">+ Tambah</span>
              </button>
            ))}

            {hasilCari.length === 0 && (
              <p className="px-3 py-2 text-sm text-dark-6">
                {siswaList.length === 0 ? "Belum ada siswa." : "Gak ketemu."}
              </p>
            )}
          </div>
        </div>
      </div>

      <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
        Simpan Kelompok
      </SubmitButton>
    </form>
  );
}