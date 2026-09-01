import { Combobox } from "@/components/FormElements/combobox";

export const BULAN_LABELS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

export function PeriodeFilterForm({
  bulan,
  tahun,
  compact = false,
}: {
  bulan: number;
  tahun: number;
  compact?: boolean;
}) {
  return (
    <form method="get" className={`flex flex-wrap items-end ${compact ? "gap-2" : "mb-5 gap-3"}`}>
      <div className={compact ? "w-40" : "w-48"}>
        <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Bulan</label>
        <Combobox
          name="bulan"
          placeholder="Pilih bulan..."
          defaultValue={bulan ? String(bulan) : undefined}
          options={BULAN_LABELS.map((b, i) => ({ value: String(i + 1), label: b }))}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Tahun</label>
        <input
          type="number"
          name="tahun"
          defaultValue={tahun}
          className={`rounded-lg border border-stroke bg-transparent outline-none dark:border-dark-3 ${compact ? "w-20 px-4 py-3 text-sm" : "w-28 px-5 py-3"}`}
        />
      </div>
      <button
        type="submit"
        className={`rounded-lg bg-primary text-sm font-medium text-white hover:bg-opacity-90 ${compact ? "px-4 py-3" : "px-5 py-3"}`}
      >
        Tampilkan
      </button>
    </form>
  );
}
