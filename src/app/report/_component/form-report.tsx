"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createLaporan, createLaporanKelompok, type LaporState } from "../actions";
import { SearchableSelect } from "@/components/FormElements/combobox";
import { ConfirmButton } from "@/components/FormElements/confirm-button";

type Kelas = {
  id: string;
  jadwal: string;
  tutorId: string;
  tipe: string;
  siswa: { nama: string; noHpOrtu: string | null };
};
type Kelompok = {
  id: string;
  nama: string;
  tutorId: string;
  anggota: { siswaId: string; siswa: { nama: string } }[];
};
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

function RatingAndNotesFields() {
  return (
    <>
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
    </>
  );
}

function PeriodeFields() {
  const now = new Date();
  const [tipePeriode, setTipePeriode] = useState("bulanan");

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tipe Laporan</label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F7F9FC] p-1 dark:bg-dark-2">
          <button
            type="button"
            onClick={() => setTipePeriode("bulanan")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${tipePeriode === "bulanan" ? "bg-[#F35C2B] text-white" : "text-dark-6"}`}
          >
            Bulanan
          </button>
          <button
            type="button"
            onClick={() => setTipePeriode("mingguan")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${tipePeriode === "mingguan" ? "bg-[#F35C2B] text-white" : "text-dark-6"}`}
          >
            Mingguan
          </button>
        </div>
        <input type="hidden" name="tipePeriode" value={tipePeriode} />
      </div>

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

      {tipePeriode === "mingguan" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Minggu Ke</label>
          <select name="mingguKe" required defaultValue="" className={inputClass}>
            <option value="" disabled>Pilih minggu</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Minggu ke-{n}</option>)}
          </select>
        </div>
      ) : (
        <input type="hidden" name="mingguKe" value={0} />
      )}
    </>
  );
}

export function ReportForm({
  tutorList,
  kelasList,
  kelompokList,
}: {
  tutorList: Tutor[];
  kelasList: Kelas[];
  kelompokList: Kelompok[];
}) {
  const [mode, setMode] = useState<"individual" | "kelompok">("individual");
  const [tutorId, setTutorId] = useState("");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F7F9FC] p-1 dark:bg-dark-2">
        <button
          type="button"
          onClick={() => { setMode("individual"); setTutorId(""); }}
          className={`rounded-md py-2 text-sm font-medium transition-colors ${mode === "individual" ? "bg-[#F35C2B] text-white" : "text-dark-6"}`}
        >
          Private
        </button>
        <button
          type="button"
          onClick={() => { setMode("kelompok"); setTutorId(""); }}
          className={`rounded-md py-2 text-sm font-medium transition-colors ${mode === "kelompok" ? "bg-[#F35C2B] text-white" : "text-dark-6"}`}
        >
          Kelompok
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Nama Tutor</label>
        <SearchableSelect
          value={tutorId}
          onChange={setTutorId}
          options={tutorList.map((t) => ({ value: t.id, label: t.nama }))}
          placeholder="Ketik nama kamu..."
        />
      </div>

      {mode === "individual" ? (
        <IndividualForm tutorId={tutorId} kelasList={kelasList} />
      ) : (
        <KelompokReportForm tutorId={tutorId} kelompokList={kelompokList} />
      )}
    </div>
  );
}

function IndividualForm({ tutorId, kelasList }: { tutorId: string; kelasList: Kelas[] }) {
  const [kelasId, setKelasId] = useState("");
  const [partnerIds, setPartnerIds] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState<LaporState, FormData>(createLaporan, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  const kelasTutorIni = kelasList.filter((k) => k.tutorId === tutorId);
  const selectedKelas = kelasList.find((k) => k.id === kelasId);
  const partners =
    selectedKelas?.tipe === "kelompok"
      ? kelasList.filter(
          (k) =>
            k.id !== selectedKelas.id &&
            k.tutorId === selectedKelas.tutorId &&
            k.jadwal === selectedKelas.jadwal &&
            k.tipe === "kelompok",
        )
      : [];

  const handleSubmit = (formData: FormData) => {
    formData.set("partnerKelasIds", JSON.stringify(partnerIds));
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      {tutorId && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Nama Siswa & Kelas</label>
          <select
            name="kelasId"
            required
            value={kelasId}
            onChange={(e) => { setKelasId(e.target.value); setPartnerIds([]); }}
            className={inputClass}
          >
            <option value="">Pilih siswa</option>
            {kelasTutorIni.map((k) => (
              <option key={k.id} value={k.id}>{k.siswa.nama} — {k.jadwal}</option>
            ))}
          </select>
        </div>
      )}

      {partners.length > 0 && (
        <div className="rounded-lg border border-dashed border-[#F35C2B]/40 bg-[#F35C2B]/5 p-4">
          <p className="mb-2 text-sm font-medium text-dark dark:text-white">
            Sesi kelompok ini juga bareng siapa? (centang biar gak usah isi ulang buat mereka)
          </p>
          <div className="space-y-2">
            {partners.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-dark dark:text-white">
                <input
                  type="checkbox"
                  checked={partnerIds.includes(p.id)}
                  onChange={(e) =>
                    setPartnerIds((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)))
                  }
                />
                {p.siswa.nama}
              </label>
            ))}
          </div>
        </div>
      )}

      <PeriodeFields />

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening / E-Wallet (buat pencairan fee)</label>
        <input type="text" name="norekTutor" required placeholder="Misal: BCA 1234567890 a.n. Nama Tutor" className={inputClass} />
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

      <RatingAndNotesFields />

      <ConfirmButton
        variant="brand"
        title="Kirim Laporan?"
        message="Yakin data yang diisi udah bener? Laporan cuma bisa dikirim sekali per periode, kalau salah harus minta admin benerin manual."
        confirmLabel="Ya, Kirim"
        className="w-full rounded-lg bg-[#F35C2B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d94e21] disabled:opacity-60"
      >
        Kirim Laporan
      </ConfirmButton>
    </form>
  );
}

function KelompokReportForm({ tutorId, kelompokList }: { tutorId: string; kelompokList: Kelompok[] }) {
  const [kelompokId, setKelompokId] = useState("");
  const [jumlahIndividu, setJumlahIndividu] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState<LaporState, FormData>(createLaporanKelompok, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  const kelompokTutorIni = kelompokList.filter((k) => k.tutorId === tutorId);
  const selectedKelompok = kelompokList.find((k) => k.id === kelompokId);

  const handleSubmit = (formData: FormData) => {
    const anggotaIndividuData = Object.entries(jumlahIndividu)
      .filter(([, v]) => v !== "" && Number(v) > 0)
      .map(([siswaId, v]) => ({ siswaId, jumlahIndividu: Number(v) }));

    formData.set("anggotaIndividuData", JSON.stringify(anggotaIndividuData));
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      {tutorId && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kelompok</label>
          <select
            name="kelompokId"
            required
            value={kelompokId}
            onChange={(e) => setKelompokId(e.target.value)}
            className={inputClass}
          >
            <option value="">Pilih kelompok</option>
            {kelompokTutorIni.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>
      )}

      {selectedKelompok && (
        <>
          <PeriodeFields />

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening / E-Wallet (buat pencairan fee)</label>
            <input type="text" name="norekTutor" required placeholder="Misal: BCA 1234567890 a.n. Nama Tutor" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kelompok Masuk Berapa Kali</label>
            <input type="number" name="jumlahKelompok" required min={0} className={inputClass} />
          </div>

          <div className="rounded-lg border border-dashed border-stroke p-4 dark:border-dark-3">
            <p className="mb-3 text-sm font-medium text-dark dark:text-white">Apakah ada yang masuk sendiri? (kalau ada isi di samping nama siawa, kalau tidak biarkan kosong)</p>
            <div className="space-y-3">
              {selectedKelompok.anggota.map((a) => (
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

          <RatingAndNotesFields />
        </>
      )}

      <ConfirmButton
        variant="brand"
        title="Kirim Laporan?"
        message="Yakin data yang diisi udah bener? Laporan cuma bisa dikirim sekali per periode, kalau salah harus minta admin benerin manual."
        confirmLabel="Ya, Kirim"
        className="w-full rounded-lg bg-[#F35C2B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d94e21] disabled:opacity-60"
      >
        Kirim Laporan
      </ConfirmButton>
    </form>
  );
}