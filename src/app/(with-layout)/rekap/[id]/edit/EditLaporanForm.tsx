"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateLaporan, type LaporState } from "@/app/report/actions";
import { MingguanDatePicker } from "@/app/report/_component/mingguan-date-picker";
import { ConfirmButton } from "@/components/FormElements/confirm-button";

const RATING_FIELDS = [
  { name: "pemahamanMateri", label: "Pemahaman Materi" },
  { name: "keaktifanBelajar", label: "Keaktifan Belajar" },
  { name: "kemandirian", label: "Kemandirian Mengerjakan Soal" },
  { name: "kedisiplinan", label: "Kedisiplinan" },
];

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-[#F35C2B] dark:border-dark-3";

function RatingFields({ 
  defaults 
}: { 
  defaults: Record<string, number> 
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {RATING_FIELDS.map((f) => (
        <div key={f.name}>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">{f.label} (1-5)</label>
          <select name={f.name} required defaultValue={String(defaults[f.name] || 3)} className={inputClass}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ))}
    </div>
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

interface LaporanData {
  id: string;
  kelasId: string;
  bulan: number;
  tahun: number;
  tipePeriode: string;
  mingguKe: number;
  jumlahHadir: number;
  jumlahIzin: number;
  norekTutor: string | null;
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
  saranBimbel: string | null;
  kelas: { siswa: { nama: string }; tutor: { nama: string } };
  tanggalPertemuan: { tanggal: Date }[];
}

export default function EditLaporanForm({ laporan }: { laporan: LaporanData }) {
  const router = useRouter();
  const [bulan, setBulan] = useState(laporan.bulan);
  const [tahun, setTahun] = useState(laporan.tahun);
  const [mingguKe, setMingguKe] = useState(String(laporan.mingguKe || ""));
  const [tanggalPertemuan, setTanggalPertemuan] = useState<string[]>(
    laporan.tanggalPertemuan.map((d) => d.tanggal.toISOString().split("T")[0])
  );
  const [existingDates, setExistingDates] = useState<Set<string>>(new Set());
  const [loadingExisting, setLoadingExisting] = useState(false);

  const [state, formAction] = useActionState<LaporState, FormData>(updateLaporan, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.push("/rekap");
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    if (!laporan.kelasId) return;
    setLoadingExisting(true);
    const params = new URLSearchParams();
    params.set("kelasId", laporan.kelasId);
    params.set("bulan", String(bulan));
    params.set("tahun", String(tahun));
    if (laporan.tipePeriode === "mingguan" && mingguKe) {
      params.set("mingguKe", mingguKe);
    }
    params.set("excludeLaporanId", laporan.id);

    fetch(`/api/kelas/existing-dates?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setExistingDates(new Set(data.dates || []));
        setLoadingExisting(false);
      })
      .catch(() => setLoadingExisting(false));
  }, [laporan.kelasId, bulan, tahun, mingguKe, laporan.id]);

  const weeksInMonth = getWeeksInCalendarGrid(bulan, tahun);

  return (
    <form action={formAction} className="space-y-5.5">
      <input type="hidden" name="laporanId" value={laporan.id} />
      <input type="hidden" name="tipePeriode" value={laporan.tipePeriode} />

      <div className="mb-4 p-3 rounded-lg bg-[#F7F9FC] dark:bg-dark-2">
        <label className="text-xs font-medium text-dark-6 uppercase tracking-wide">Tipe Laporan</label>
        <p className="text-sm font-medium text-dark dark:text-white capitalize">
          {laporan.tipePeriode}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Periode Bulan</label>
          <select name="bulan" value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className={inputClass}>
            {BULAN.map((b, i) => <option key={b} value={i + 1}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Tahun</label>
          <input name="tahun" type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} className={inputClass} />
        </div>
      </div>

      {laporan.tipePeriode === "mingguan" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Minggu Ke</label>
          <select name="mingguKe" value={mingguKe} onChange={(e) => { setMingguKe(e.target.value); setTanggalPertemuan([]); }} className={inputClass}>
            <option value="" disabled>Pilih minggu</option>
            {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>Minggu ke-{n}</option>
            ))}
          </select>
        </div>
      )}

      {laporan.tipePeriode === "mingguan" && mingguKe && (
        <MingguanDatePicker
          name="tanggalPertemuan"
          value={tanggalPertemuan}
          onChange={setTanggalPertemuan}
          mingguKe={Number(mingguKe)}
          bulan={bulan}
          tahun={tahun}
          kelasId={laporan.kelasId}
          excludeLaporanId={laporan.id}
        />
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
        <input type="number" name="jumlahIzin" defaultValue={laporan.jumlahIzin} min={0} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening / E-Wallet Tutor</label>
        <input type="text" name="norekTutor" required placeholder="Misal: BCA 1234567890 a.n. Nama Tutor" defaultValue={laporan.norekTutor ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Materi yang Dipelajari Bulan Ini</label>
        <textarea name="materiDipelajari" rows={3} defaultValue={laporan.materiDipelajari ?? ""} className={inputClass} />
      </div>

      <RatingFields defaults={{ 
        pemahamanMateri: laporan.pemahamanMateri,
        keaktifanBelajar: laporan.keaktifanBelajar,
        kemandirian: laporan.kemandirian,
        kedisiplinan: laporan.kedisiplinan,
      }} />

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Catatan & Saran untuk Siswa</label>
        <textarea name="catatanSiswa" rows={3} defaultValue={laporan.catatanSiswa ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Saran untuk Bimbel</label>
        <textarea name="saranBimbel" rows={2} defaultValue={laporan.saranBimbel ?? ""} className={inputClass} />
      </div>

      <ConfirmButton
        variant="brand"
        title="Simpan Perubahan?"
        message="Yakin ingin menyimpan perubahan laporan ini?"
        confirmLabel="Ya, Simpan"
        className="w-full rounded-lg bg-[#F35C2B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#d94e21] disabled:opacity-60"
      >
        Simpan Perubahan
      </ConfirmButton>
    </form>
  );
}