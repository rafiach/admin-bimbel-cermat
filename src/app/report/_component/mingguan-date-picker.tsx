"use client";

import { useState, useEffect } from "react";

interface Props {
  name: string;
  value: string[];
  onChange: (dates: string[]) => void;
  mingguKe: number;
  bulan: number;
  tahun: number;
  kelasId?: string;
  kelompokId?: string;
  excludeLaporanId?: string;
  disabled?: boolean;
  maxDates?: number;
  jumlahKelompok?: number;
}

const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function getCalendarGridWeeks(bulan: number, tahun: number): Date[][] {
  const firstDay = new Date(Date.UTC(tahun, bulan - 1, 1));
  const lastDay = new Date(Date.UTC(tahun, bulan, 0));
  
  // Start from Monday of first week (ISO week: Monday=0, Sunday=6)
  const startOffset = (firstDay.getUTCDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setUTCDate(gridStart.getUTCDate() - startOffset);
  
  // End on Sunday of last week
  const lastOffset = (lastDay.getUTCDay() + 6) % 7;
  const gridEnd = new Date(lastDay);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - lastOffset));
  
  const allDates: Date[] = [];
  const current = new Date(gridStart);
  while (current <= gridEnd) {
    allDates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }
  return weeks;
}

export function getWeeksInCalendarGrid(bulan: number, tahun: number): number {
  return getCalendarGridWeeks(bulan, tahun).length;
}

export function MingguanDatePicker({
  name,
  value,
  onChange,
  mingguKe,
  bulan,
  tahun,
  kelasId,
  kelompokId,
  excludeLaporanId,
  disabled,
  maxDates,
  jumlahKelompok,
}: Props) {
  const [existingDates, setExistingDates] = useState<Set<string>>(new Set());
  const [loadingExisting, setLoadingExisting] = useState(false);

  const weeks = mingguKe ? getCalendarGridWeeks(bulan, tahun) : [];
  const currentMonth = bulan - 1;

  useEffect(() => {
    if ((!kelasId && !kelompokId) || !mingguKe) return;
    setLoadingExisting(true);
    const params = new URLSearchParams();
    if (kelasId) params.set("kelasId", kelasId);
    if (kelompokId) params.set("kelompokId", kelompokId);
    params.set("bulan", String(bulan));
    params.set("tahun", String(tahun));
    params.set("mingguKe", String(mingguKe));
    if (excludeLaporanId) params.set("excludeLaporanId", excludeLaporanId);

    fetch(`/api/kelas/existing-dates?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setExistingDates(new Set(data.dates || []));
        setLoadingExisting(false);
      })
      .catch(() => setLoadingExisting(false));
  }, [kelasId, kelompokId, bulan, tahun, mingguKe, excludeLaporanId]);

  const toggleDate = (date: string) => {
    if (disabled) return;
    const newValue = value.includes(date)
      ? value.filter((d) => d !== date)
      : [...value, date];
    onChange(newValue);
  };

  const isConflict = (date: string) => existingDates.has(date) && !value.includes(date);

  if (!mingguKe || weeks.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-dark-6">Pilih minggu ke terlebih dahulu untuk menampilkan tanggal pertemuan.</p>
      </div>
    );
  }

  const selectedWeekDates = weeks[mingguKe - 1] || [];
  const validDatesInMonth = selectedWeekDates.filter(d => d.getUTCMonth() === currentMonth);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-dark dark:text-white">
          Tanggal Pertemuan (Minggu ke-{mingguKe}) <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-dark-6">
          {maxDates !== undefined 
            ? `Terpilih: ${value.length} dari ${maxDates} tanggal${existingDates.size > 0 ? ` | ⚠ ${existingDates.size} tanggal sudah terpakai` : ''}`
            : `Terpilih: ${value.length}${existingDates.size > 0 ? ` | ⚠ ${existingDates.size} tanggal sudah terpakai` : ''}`}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1" role="group" aria-label="Pilih tanggal pertemuan mingguan">
        {selectedWeekDates.map((date) => {
          const dateStr = date.toISOString().split("T")[0];
          const isCurrentMonth = date.getUTCMonth() === currentMonth;
          const isSelected = value.includes(dateStr);
          const isToday = dateStr === new Date().toISOString().split("T")[0];
          const conflict = isConflict(dateStr);
          const atMaxDates = maxDates !== undefined && value.length >= maxDates && !isSelected;
          const dayIndex = date.getUTCDay(); // 0=Sun, 1=Mon... 6=Sat
          const dayName = HARI[(dayIndex + 6) % 7]; // Convert Sun=0 to Mon=0

          if (!isCurrentMonth) {
            return <div key={dateStr} className="w-6 h-6" />;
          }

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => toggleDate(dateStr)}
              disabled={disabled || conflict || atMaxDates}
              className={`
                relative w-12 h-12 rounded border text-xs font-medium transition-all
                ${isSelected
                  ? "bg-[#F35C2B] text-white border-[#F35C2B]"
                  : conflict
                    ? "bg-red-50 text-red-500 border-red-200 cursor-not-allowed line-through"
                    : atMaxDates
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-dark-2 dark:text-dark-4 dark:border-dark-3"
                      : "bg-white text-dark border-stroke hover:bg-[#F35C2B]/10 hover:border-[#F35C2B] dark:bg-gray-dark dark:text-white dark:border-dark-3 dark:hover:bg-[#F35C2B]/20"
                }
                ${isToday && !isSelected && !conflict && !atMaxDates ? "ring-2 ring-[#F35C2B]" : ""}
              `}
              aria-pressed={isSelected}
              aria-disabled={disabled || conflict || atMaxDates}
              title={
                conflict
                  ? "Sudah digunakan di laporan lain"
                  : atMaxDates
                    ? `Maksimal ${maxDates} tanggal (${jumlahKelompok} kelompok + individu)`
                    : `${dayName}, ${date.getUTCDate()} ${date.getUTCMonth() + 1}/${tahun}`
              }
            >
              {date.getUTCDate()}
            </button>
          );
        })}
      </div>

      {value.map((d, i) => (
        <input key={`${name}-${i}`} type="hidden" name={name} value={d} />
      ))}
    </div>
  );
}