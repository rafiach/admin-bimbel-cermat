"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createLaporan, createLaporanKelompok, type LaporState } from "../actions";
import { SearchableSelect } from "@/components/FormElements/combobox";
import { ConfirmButton } from "@/components/FormElements/confirm-button";
import { MingguanDatePicker } from "./mingguan-date-picker";

type Kelas = {
  id: string;
  jadwal: string;
  tutorId: string;
  tipePeriode: string;
  siswa: { nama: string; noHpOrtu: string | null };
};
type Kelompok = {
  id: string;
  nama: string;
  tutorId: string;
  tipePeriode: string;
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

const DEFAULT_RATING = 3;

const ASSESSMENT_DEFAULTS = {
  pemahamanMateri: DEFAULT_RATING,
  keaktifanBelajar: DEFAULT_RATING,
  kemandirian: DEFAULT_RATING,
  kedisiplinan: DEFAULT_RATING,
  materiDipelajari: "",
  catatanSiswa: "",
  saranBimbel: "",
};

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-base outline-none focus:border-[#F35C2B] dark:border-dark-3";
function RatingAndNotesFields({
  isExpanded,
  required = true,
  defaults = ASSESSMENT_DEFAULTS,
}: {
  isExpanded: boolean;
  required?: boolean;
  defaults?: typeof ASSESSMENT_DEFAULTS;
}) {
  if (!isExpanded) {
    return (
      <>
        {Object.entries(defaults).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      </>
    );
  }

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Materi yang Dipelajari Bulan Ini</label>
        <textarea name="materiDipelajari" rows={3} required={required} className={inputClass} />
      </div>

      {RATING_FIELDS.map((f) => (
        <div key={f.name}>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{f.label} (1-5)</label>
          <select name={f.name} required={required} defaultValue={defaults[f.name as keyof typeof defaults] as string} className={inputClass}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ))}

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Catatan & Saran untuk Siswa</label>
        <textarea name="catatanSiswa" rows={3} required={required} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Saran untuk Bimbel</label>
        <textarea name="saranBimbel" rows={2} required={required} className={inputClass} />
      </div>
    </>
  );
}

function getWeeksInCalendarGrid(bulan: number, tahun: number): number {
  const firstDay = new Date(Date.UTC(tahun, bulan - 1, 1));
  const lastDay = new Date(Date.UTC(tahun, bulan, 0));
  
  const startOffset = (firstDay.getUTCDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setUTCDate(gridStart.getUTCDate() - startOffset);
  
  const lastOffset = (lastDay.getUTCDay() + 6) % 7;
  const gridEnd = new Date(lastDay);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - lastOffset));
  
  const totalDays = Math.floor((gridEnd.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.ceil(totalDays / 7);
}

export function PeriodeFields({ 
  bulan, 
  tahun, 
  onBulanChange, 
  onTahunChange, 
  onTipePeriodeChange,
  onMingguKeChange,
  tipePeriode,
  mingguKe,
}: {
  bulan: number;
  tahun: number;
  onBulanChange: (v: number) => void;
  onTahunChange: (v: number) => void;
  onTipePeriodeChange: (v: string) => void;
  onMingguKeChange: (v: string) => void;
  tipePeriode: string;
  mingguKe: string;
}) {
  const weeksInMonth = getWeeksInCalendarGrid(bulan, tahun);

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tipe Laporan</label>
        <div className="rounded-lg bg-[#F7F9FC] px-4 py-3 text-sm font-medium capitalize text-dark dark:bg-dark-2 dark:text-white">
          {tipePeriode}
        </div>
        <input type="hidden" name="tipePeriode" value={tipePeriode} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Periode Bulan</label>
          <select name="bulan" value={bulan} onChange={(e) => onBulanChange(Number(e.target.value))} className={inputClass}>
            {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tahun</label>
          <input name="tahun" type="number" value={tahun} onChange={(e) => onTahunChange(Number(e.target.value))} className={inputClass} />
        </div>
      </div>

      {tipePeriode === "mingguan" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Minggu Ke</label>
          <select name="mingguKe" required value={mingguKe} onChange={(e) => onMingguKeChange(e.target.value)} className={inputClass}>
            <option value="" disabled>Pilih minggu</option>
            {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>Minggu ke-{n}</option>
            ))}
          </select>
        </div>
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
  const [state, formAction, pending] = useActionState<LaporState, FormData>(createLaporan, null);

  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tipePeriode, setTipePeriode] = useState("bulanan");
  const [mingguKe, setMingguKe] = useState("");
  const [tanggalPertemuan, setTanggalPertemuan] = useState<string[]>([]);
  const [showAssessment, setShowAssessment] = useState(true);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  const kelasTutorIni = kelasList.filter((k) => k.tutorId === tutorId);
  const selectedKelas = kelasTutorIni.find((k) => k.id === kelasId);

  // Saat kelas dipilih: tipe periode ikut pengaturan kelas
  useEffect(() => {
    if (!selectedKelas) return;
    setTipePeriode(selectedKelas.tipePeriode);
    setShowAssessment(selectedKelas.tipePeriode === "bulanan");
    setMingguKe("");
    setTanggalPertemuan([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKelas?.id]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-5">
        {tutorId && (
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Nama Siswa & Kelas</label>
            <select
              name="kelasId"
              required
              value={kelasId}
              onChange={(e) => setKelasId(e.target.value)}
              className={inputClass}
            >
              <option value="">Pilih siswa</option>
              {kelasTutorIni.map((k) => (
                <option key={k.id} value={k.id}>{k.siswa.nama} — {k.jadwal}</option>
              ))}
            </select>
          </div>
        )}

        {selectedKelas && (
          <>
            <PeriodeFields
              bulan={bulan}
              tahun={tahun}
              onBulanChange={setBulan}
              onTahunChange={setTahun}
              onTipePeriodeChange={setTipePeriode}
              onMingguKeChange={setMingguKe}
              tipePeriode={tipePeriode}
              mingguKe={mingguKe}
            />

            {tipePeriode === "mingguan" && mingguKe && (
              <MingguanDatePicker
                name="tanggalPertemuan"
                value={tanggalPertemuan}
                onChange={setTanggalPertemuan}
                mingguKe={Number(mingguKe)}
                bulan={bulan}
                tahun={tahun}
                kelasId={kelasId}
              />
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening / E-Wallet (buat pencairan fee)</label>
              <input type="text" name="norekTutor" required placeholder="Misal: BCA 1234567890 a.n. Nama Tutor" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Hadir</label>
                <input
                  key={tipePeriode}
                  type="number"
                  name="jumlahHadir"
                  required
                  min={0}
                  value={tipePeriode === "mingguan" ? tanggalPertemuan.length : undefined}
                  readOnly={tipePeriode === "mingguan"}
                  className={`${inputClass} ${tipePeriode === "mingguan" ? "bg-[#F7F9FC] dark:bg-dark-2" : ""}`}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
                <input type="number" name="jumlahIzin" defaultValue={0} min={0} className={inputClass} />
              </div>
            </div>
          </>
        )}
      </div>

      {selectedKelas && (
        <>
          {tipePeriode === "bulanan" ? (
            <div className="space-y-4 rounded-lg border border-dashed border-[#F35C2B]/40 bg-[#F35C2B]/5 p-4 dark:bg-[#F35C2B]/10">
              <RatingAndNotesFields isExpanded={true} />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowAssessment(!showAssessment)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#F35C2B] px-4 py-3 text-sm font-medium text-[#F35C2B] transition-colors hover:bg-[#F35C2B]/10"
              >
                <span className={`transition-transform duration-200 ${showAssessment ? "rotate-180" : ""}`}>▼</span>
                <span>{showAssessment ? "Sembunyikan Penilaian & Catatan" : "Tampilkan Penilaian & Catatan (opsional)"}</span>
              </button>

              <div className={showAssessment ? "space-y-4 rounded-lg border border-dashed border-[#F35C2B]/40 bg-[#F35C2B]/5 p-4 dark:bg-[#F35C2B]/10" : "hidden"}>
                <RatingAndNotesFields isExpanded={true} required={false} />
              </div>
            </>
          )}

          <div className="sticky bottom-0 -mx-5 border-t border-stroke bg-white/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur dark:border-dark-3 dark:bg-gray-dark/95 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
            <ConfirmButton
              variant="brand"
              title="Kirim Laporan?"
              message="Yakin data yang diisi udah bener? Laporan cuma bisa dikirim sekali per periode, kalau salah harus minta admin benerin manual."
              confirmLabel="Ya, Kirim"
              className="w-full rounded-lg bg-[#F35C2B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d94e21] disabled:opacity-60"
            >
              Kirim Laporan
            </ConfirmButton>
          </div>
        </>
      )}
    </form>
  );
}

function KelompokReportForm({ tutorId, kelompokList }: { tutorId: string; kelompokList: Kelompok[] }) {
  const [kelompokId, setKelompokId] = useState("");
  const [jumlahIndividu, setJumlahIndividu] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState<LaporState, FormData>(createLaporanKelompok, null);

  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tipePeriode, setTipePeriode] = useState("bulanan");
  const [mingguKe, setMingguKe] = useState("");
  const [tanggalPertemuan, setTanggalPertemuan] = useState<string[]>([]);
  const [showAssessment, setShowAssessment] = useState(true);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  const kelompokTutorIni = kelompokList.filter((k) => k.tutorId === tutorId);
  const selectedKelompok = kelompokTutorIni.find((k) => k.id === kelompokId);

  // Saat kelompok dipilih: tipe periode ikut pengaturan kelompok
  useEffect(() => {
    if (!selectedKelompok) return;
    setTipePeriode(selectedKelompok.tipePeriode);
    setShowAssessment(selectedKelompok.tipePeriode === "bulanan");
    setMingguKe("");
    setTanggalPertemuan([]);
    setJumlahIndividu({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKelompok?.id]);

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
        <div className="space-y-5">
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

          {selectedKelompok && (
            <>
              <PeriodeFields
                bulan={bulan}
                tahun={tahun}
                onBulanChange={setBulan}
                onTahunChange={setTahun}
                onTipePeriodeChange={setTipePeriode}
                onMingguKeChange={setMingguKe}
                tipePeriode={tipePeriode}
                mingguKe={mingguKe}
              />

              {tipePeriode === "mingguan" && mingguKe && (
                <MingguanDatePicker
                  name="tanggalPertemuan"
                  value={tanggalPertemuan}
                  onChange={setTanggalPertemuan}
                  mingguKe={Number(mingguKe)}
                  bulan={bulan}
                  tahun={tahun}
                  kelompokId={kelompokId}
                />
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening / E-Wallet (buat pencairan fee)</label>
                <input type="text" name="norekTutor" required placeholder="Misal: BCA 1234567890 a.n. Nama Tutor" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Kelompok Masuk Berapa Kali
                  </label>
                  <input
                    key={tipePeriode}
                    type="number"
                    name="jumlahKelompok"
                    required
                    min={0}
                    value={tipePeriode === "mingguan" ? tanggalPertemuan.length : undefined}
                    readOnly={tipePeriode === "mingguan"}
                    className={`${inputClass} ${tipePeriode === "mingguan" ? "bg-[#F7F9FC] dark:bg-dark-2" : ""}`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
                  <input type="number" name="jumlahIzin" defaultValue={0} min={0} className={inputClass} />
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-stroke p-4 dark:border-dark-3">
                <p className="mb-3 text-sm font-medium text-dark dark:text-white">Apakah ada yang masuk sendiri? (kalau ada isi di samping nama siswa, kalau tidak biarkan kosong)</p>
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
            </>
          )}
        </div>
      )}

      {selectedKelompok && (
        <>
          {tipePeriode === "bulanan" ? (
            <div className="space-y-4 rounded-lg border border-dashed border-[#F35C2B]/40 bg-[#F35C2B]/5 p-4 dark:bg-[#F35C2B]/10">
              <RatingAndNotesFields isExpanded={true} />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowAssessment(!showAssessment)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#F35C2B] px-4 py-3 text-sm font-medium text-[#F35C2B] transition-colors hover:bg-[#F35C2B]/10"
              >
                <span className={`transition-transform duration-200 ${showAssessment ? "rotate-180" : ""}`}>▼</span>
                <span>{showAssessment ? "Sembunyikan Penilaian & Catatan" : "Tampilkan Penilaian & Catatan (opsional)"}</span>
              </button>

              <div className={showAssessment ? "space-y-4 rounded-lg border border-dashed border-[#F35C2B]/40 bg-[#F35C2B]/5 p-4 dark:bg-[#F35C2B]/10" : "hidden"}>
                <RatingAndNotesFields isExpanded={true} required={false} />
              </div>
            </>
          )}

          <div className="sticky bottom-0 -mx-5 border-t border-stroke bg-white/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur dark:border-dark-3 dark:bg-gray-dark/95 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
            <ConfirmButton
              variant="brand"
              title="Kirim Laporan?"
              message="Yakin data yang diisi udah bener? Laporan cuma bisa dikirim sekali per periode, kalau salah harus minta admin benerin manual."
              confirmLabel="Ya, Kirim"
              className="w-full rounded-lg bg-[#F35C2B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d94e21] disabled:opacity-60"
            >
              Kirim Laporan
            </ConfirmButton>
          </div>
        </>
      )}
    </form>
  );
}