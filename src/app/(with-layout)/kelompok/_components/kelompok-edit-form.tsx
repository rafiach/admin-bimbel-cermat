"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { PhoneInputGroup } from "@/components/FormElements/phone-input";
import { Select } from "@/components/FormElements/select";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { splitPhone } from "@/lib/phone";
import { useState } from "react";

type Anggota = { id: string; hargaPrivat: number; feeTutor: number; siswa: { nama: string } };
type KelompokData = {
  nama: string;
  jadwal: string;
  hargaKelompok: number;
  feeTutorKelompok: number;
  namaWali: string | null;
  noHpWali: string | null;
  status: string;
  anggota: Anggota[];
};

export function KelompokEditForm({
  kelompok,
  action,
}: {
  kelompok: KelompokData;
  action: (formData: FormData) => void;
}) {
  const [anggotaValues, setAnggotaValues] = useState<Record<string, { hargaPrivat: string; feeTutor: string }>>(
    Object.fromEntries(
      kelompok.anggota.map((a) => [a.id, { hargaPrivat: String(a.hargaPrivat), feeTutor: String(a.feeTutor) }]),
    ),
  );

  const handleSubmit = (formData: FormData) => {
    const anggotaUpdateData = Object.entries(anggotaValues).map(([id, v]) => ({
      id,
      hargaPrivat: Number(v.hargaPrivat),
      feeTutor: Number(v.feeTutor),
    }));
    formData.set("anggotaUpdateData", JSON.stringify(anggotaUpdateData));
    action(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-5.5">
      <InputGroup label="Nama Kelompok" name="nama" type="text" placeholder="" defaultValue={kelompok.nama} required />
      <InputGroup label="Jadwal" name="jadwal" type="text" placeholder="" defaultValue={kelompok.jadwal} required />

      <div className="grid grid-cols-2 gap-4">
        <InputGroup label="Harga Kelompok (per sesi)" name="hargaKelompok" type="number" placeholder="" defaultValue={String(kelompok.hargaKelompok)} required />
        <InputGroup label="Fee Tutor (per sesi kelompok)" name="feeTutorKelompok" type="number" placeholder="" defaultValue={String(kelompok.feeTutorKelompok)} required />
      </div>

      <InputGroup label="Nama Wali" name="namaWali" type="text" placeholder="" defaultValue={kelompok.namaWali ?? ""} />
      <PhoneInputGroup label="No HP Wali (WhatsApp)" name="noHpWali" defaultValue={kelompok.noHpWali} />

      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Harga Privat per Anggota</label>
        <div className="space-y-3 rounded-lg border border-stroke p-4 dark:border-dark-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="min-w-[120px] flex-1"></span>
            <span className="w-32 text-left text-sm text-dark-6">Harga ke Ortu</span>
            <span className="w-32 text-left text-sm text-dark-6">Fee Tutor</span>
          </div>
          {kelompok.anggota.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-3">
              <span className="min-w-[120px] flex-1 text-dark dark:text-white">{a.siswa.nama}</span>
              <input
                type="number"
                value={anggotaValues[a.id].hargaPrivat}
                onChange={(e) => setAnggotaValues((prev) => ({ ...prev, [a.id]: { ...prev[a.id], hargaPrivat: e.target.value } }))}
                placeholder="Harga privat"
                className="w-32 rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-dark-3"
              />
              <input
                type="number"
                value={anggotaValues[a.id].feeTutor}
                onChange={(e) => setAnggotaValues((prev) => ({ ...prev, [a.id]: { ...prev[a.id], feeTutor: e.target.value } }))}
                placeholder="Fee tutor privat"
                className="w-32 rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none dark:border-dark-3"
              />
            </div>
          ))}
        </div>
      </div>

      <Select
        label="Status"
        name="status"
        defaultValue={kelompok.status}
        items={[
          { value: "aktif", label: "Aktif" },
          { value: "nonaktif", label: "Nonaktif" },
        ]}
      />

      <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
        Simpan Perubahan
      </SubmitButton>
    </form>
  );
}