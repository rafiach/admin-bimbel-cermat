"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { TextareaGroup } from "@/components/FormElements/text-area-group";
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
      <InputGroup
        label = "Kelompok Masuk Berapa Kali"
        name="jumlahKelompok"
        type="number"
        placeholder=""
        defaultValue={String(laporan.jumlahKelompok)}
        required
      />

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

      <TextAreaGroup
        label="Materi yang Dipelajari"
        name="materiDipelajari"
        defaultValue={laporan.materiDipelajari ?? ""}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Pemahaman Materi (1-5)"
          name="pemahamanMateri"
          defaultValue={String(laporan.pemahamanMateri)}
          items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
        />
        <Select
          label="Keaktifan Belajar (1-5)"
          name="keaktifanBelajar"
          defaultValue={String(laporan.keaktifanBelajar)}
          items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
        />
        <Select
          label="Kemandirian (1-5)"
          name="kemandirian"
          defaultValue={String(laporan.kemandirian)}
          items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
        />
        <Select
          label="Kedisiplinan (1-5)"
          name="kedisiplinan"
          defaultValue={String(laporan.kedisiplinan)}
          items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
        />
      </div>      

      <TextareaGroup
        label="Catatan & Saran untuk Siswa"
        name="catatanSiswa"
        placeholder="Catatan dan saran untuk siswa"
        defaultValue={laporan.catatanSiswa ?? ""}
      />

      <TextareaGroup
        label="Saran untuk Bimbel"
        name="saranBimbel"
        placeholder="Saran untuk bimbel"
        rows={2}
        defaultValue={laporan.saranBimbel ?? ""}
      />

      <InputGroup
        label="No Rekening Tutor"
        name="norekTutor"
        type="text"
        placeholder="Misal: BCA 1234567890 a.n. ..."
        defaultValue={laporan.norekTutor ?? ""}
        required
      />

      <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
        Simpan Perubahan
      </SubmitButton>
    </form>
  );
}