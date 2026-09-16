"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateLaporanKelompok } from "@/app/(with-layout)/rekap-kelompok/actions";
import { MingguanDatePicker, getWeeksInCalendarGrid } from "@/app/report/_component/mingguan-date-picker";
import { ConfirmButton } from "@/components/FormElements/confirm-button";

type LaporState = { success: boolean; message: string } | null;

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

interface LaporanKelompokData {
  id: string;
  kelompokId: string;
  bulan: number;
  tahun: number;
  tipePeriode: string;
  mingguKe: number;
  jumlahKelompok: number;
  jumlahIzin: number;
  hargaKelompokFinal: number | null;
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
  saranBimbel: string | null;
  norekTutor: string | null;
  kelompok: { 
    nama: string; 
    tutor: { nama: string }; 
    anggota: { siswaId: string; siswa: { nama: string } }[] 
  };
  tanggalPertemuan: { tanggal: Date }[];
  anggotaLaporan: { siswaId: string; jumlahIndividu: number }[];
}

export default function LaporanKelompokEditForm({ 
  laporan 
}: { 
  laporan: LaporanKelompokData 
}) {
  const router = useRouter();
  const [bulan, setBulan] = useState(laporan.bulan);
  const [tahun, setTahun] = useState(laporan.tahun);
  const [mingguKe, setMingguKe] = useState(String(laporan.mingguKe || ""));
  const [tanggalPertemuan, setTanggalPertemuan] = useState<string[]>(
    laporan.tanggalPertemuan.map((d) => d.tanggal.toISOString().split("T")[0])
  );
  const [jumlahIndividu, setJumlahIndividu] = useState<Record<string, string>>(
    Object.fromEntries(
      laporan.anggotaLaporan.map((a) => [a.siswaId, String(a.jumlahIndividu)])
    )
  );
  const [existingDates, setExistingDates] = useState<Set<string>>(new Set());
  const [loadingExisting, setLoadingExisting] = useState(false);

  const [state, formAction] = useActionState<LaporState, FormData>(updateLaporanKelompok, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.push("/rekap-kelompok");
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    if (!laporan.kelompokId) return;
    setLoadingExisting(true);
    const params = new URLSearchParams();
    params.set("kelompokId", laporan.kelompokId);
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
  }, [laporan.kelompokId, bulan, tahun, mingguKe, laporan.id]);

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
          kelompokId={laporan.kelompokId}
          excludeLaporanId={laporan.id}
        />
      )}

      {laporan.tipePeriode === "bulanan" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Kelompok Masuk Berapa Kali</label>
            <input type="number" name="jumlahKelompok" required min={0} defaultValue={laporan.jumlahKelompok} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
            <input type="number" name="jumlahIzin" defaultValue={laporan.jumlahIzin} min={0} className={inputClass} />
          </div>
        </div>
      )}

      {laporan.tipePeriode === "mingguan" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Kelompok Masuk Berapa Kali <span className="text-xs text-dark-6">(otomatis dari tanggal)</span>
            </label>
            <input
              type="number"
              name="jumlahKelompok"
              required
              min={0}
              value={tanggalPertemuan.length}
              readOnly
              className={`${inputClass} bg-[#F7F9FC] dark:bg-dark-2`}
            />
            <p className="mt-1 text-xs text-dark-6">Terpilih: {tanggalPertemuan.length} tanggal</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jumlah Izin Mendadak</label>
            <input type="number" name="jumlahIzin" defaultValue={laporan.jumlahIzin} min={0} className={inputClass} />
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">No Rekening / E-Wallet Tutor</label>
        <input type="text" name="norekTutor" required placeholder="Misal: BCA 1234567890 a.n. Nama Tutor" defaultValue={laporan.norekTutor ?? ""} className={inputClass} />
      </div>

      <div className="rounded-lg border border-dashed border-stroke p-4 dark:border-dark-3">
        <p className="mb-3 text-sm font-medium text-dark dark:text-white">Apakah ada yang masuk sendiri? (kalau ada isi di samping nama siawa, kalau tidak biarkan kosong)</p>
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

      <div className="space-y-4">
        <div className="rounded-lg border border-dashed border-[#F35C2B]/40 bg-[#F35C2B]/5 p-5 dark:border-[#F35C2B]/40 dark:bg-[#F35C2B]/10 max-h-[70vh] overflow-auto">
          <RatingFields defaults={{ 
            pemahamanMateri: laporan.pemahamanMateri,
            keaktifanBelajar: laporan.keaktifanBelajar,
            kemandirian: laporan.kemandirian,
            kedisiplinan: laporan.kedisiplinan,
          }} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Catatan & Saran untuk Siswa</label>
          <textarea name="catatanSiswa" rows={3} defaultValue={laporan.catatanSiswa ?? ""} className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Saran untuk Bimbel</label>
          <textarea name="saranBimbel" rows={2} defaultValue={laporan.saranBimbel ?? ""} className={inputClass} />
        </div>
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