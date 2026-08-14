"use client";

import { useMemo, useState } from "react";
import { DownloadButton } from "../../../rekap/_component/download-button";

type LineItem = {
  key: string;
  label: string;
  jumlah: number;
  hargaSatuan: number;
};

type LaporanItem = {
  id: string;
  mingguKe: number;
  statusBayarOrtu: string;
  lines: LineItem[];
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
  createdAt: string;
};

export function GabunganKelompokKwitansi({
  namaKelompok,
  tutorNama,
  periodeLabel,
  items,
  filenamePrefix,
}: {
  namaKelompok: string;
  tutorNama: string;
  periodeLabel: string;
  items: LaporanItem[];
  filenamePrefix: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.filter((i) => i.statusBayarOrtu !== "lunas").map((i) => i.id),
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const allLines = selectedItems.flatMap((i) => i.lines);
  const totalTagihan = allLines.reduce((sum, l) => sum + l.jumlah * l.hargaSatuan, 0);

  const laporanTerakhir = useMemo(() => {
    if (selectedItems.length === 0) return null;
    return selectedItems.reduce((terbaru, i) => (i.createdAt > terbaru.createdAt ? i : terbaru));
  }, [selectedItems]);

  return (
    <>
      <div className="print:hidden rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-6">
        <p className="mb-3 text-sm font-medium text-dark dark:text-white">
          Pilih laporan yang mau dimasukin ke kwitansi ini — yang udah &quot;Lunas&quot; otomatis gak dicentang:
        </p>
        <div className="space-y-2">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-stroke px-3 py-2 dark:border-dark-3"
            >
              <span className="flex items-center gap-3">
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleItem(item.id)} />
                <span className="text-sm text-dark dark:text-white">
                  {item.mingguKe > 0 ? `Minggu ke-${item.mingguKe}` : "Bulanan"}
                </span>
              </span>
              <span
                className={
                  item.statusBayarOrtu === "lunas"
                    ? "rounded-full bg-[#219653]/10 px-2.5 py-0.5 text-xs font-medium text-[#219653]"
                    : "rounded-full bg-[#D34053]/10 px-2.5 py-0.5 text-xs font-medium text-[#D34053]"
                }
              >
                {item.statusBayarOrtu === "lunas" ? "Lunas" : "Belum Lunas"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {selectedItems.length > 0 ? (
        <>
          <div className="print:hidden mt-5 flex items-center justify-end">
            <DownloadButton filename={filenamePrefix} />
          </div>

          <div id="area-cetak" className="relative mx-auto mt-5 max-w-2xl overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1">
            <div className="h-2 bg-[#F35C2B]" />
            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo-icon-bimbel.svg" alt="" className="w-2/3 opacity-[0.15] grayscale" />
            </div>
            <div className="p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-stroke pb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="/images/logo/logo-icon-bimbel.svg" alt="Bimbel Cermat" className="h-18 w-18 object-contain" />
                <div>
                  <h2 className="text-heading-6 font-bold text-dark">Bimbel Cermat</h2>
                  <p className="text-sm text-dark-6">Kwitansi & Rekap Perkembangan Belajar</p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F9FC] p-4 text-sm">
                <div>
                  <p className="text-dark-6">Nama Kelompok</p>
                  <p className="font-medium text-dark">{namaKelompok}</p>
                </div>
                <div>
                  <p className="text-dark-6">Tutor</p>
                  <p className="font-medium text-dark">{tutorNama}</p>
                </div>
                <div>
                  <p className="text-dark-6">Periode</p>
                  <p className="font-medium text-dark">{periodeLabel}</p>
                </div>
              </div>

              <table className="mb-6 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-stroke text-left">
                    <th className="py-2 font-medium text-dark-6">Rincian</th>
                    <th className="py-2 text-center font-medium text-dark-6">Jumlah</th>
                    <th className="py-2 text-right font-medium text-dark-6">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {allLines.map((l) => (
                    <tr key={l.key} className="border-b border-stroke">
                      <td className="py-2 text-dark">{l.label}</td>
                      <td className="py-2 text-center text-dark">{l.jumlah}x</td>
                      <td className="py-2 text-right text-dark">
                        Rp {(l.jumlah * l.hargaSatuan).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-6 flex items-center justify-between rounded-lg bg-[#F35C2B]/10 px-5 py-4">
                <div>
                  <p className="text-sm text-dark-6">Total Tagihan</p>
                  <p className="text-heading-6 font-bold text-[#F35C2B]">
                    Rp {totalTagihan.toLocaleString("id-ID")}
                  </p>
                </div>
                <span
                  className={
                    laporanTerakhir?.statusBayarOrtu === "lunas"
                      ? "rounded-full border-2 border-[#219653] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-[#219653]"
                      : "rounded-full border-2 border-[#D34053] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-[#D34053]"
                  }
                >
                  {laporanTerakhir?.statusBayarOrtu === "lunas" ? "Lunas" : "Belum Lunas"}
                </span>
              </div>

              {laporanTerakhir && (
                <div className="mb-4">
                  <h5 className="mb-3 font-medium text-dark">
                    Rekap Perkembangan Terbaru
                    {laporanTerakhir.mingguKe > 0 && ` (Minggu ke-${laporanTerakhir.mingguKe})`}
                  </h5>

                  {laporanTerakhir.materiDipelajari && (
                    <p className="mb-3 text-sm text-dark">
                      <span className="text-dark-6">Materi dipelajari: </span>
                      {laporanTerakhir.materiDipelajari}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                      <span className="text-dark">Pemahaman Materi</span>
                      <span className="font-medium text-primary">{laporanTerakhir.pemahamanMateri}/5</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                      <span className="text-dark">Keaktifan Belajar</span>
                      <span className="font-medium text-primary">{laporanTerakhir.keaktifanBelajar}/5</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                      <span className="text-dark">Kemandirian</span>
                      <span className="font-medium text-primary">{laporanTerakhir.kemandirian}/5</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
                      <span className="text-dark">Kedisiplinan</span>
                      <span className="font-medium text-primary">{laporanTerakhir.kedisiplinan}/5</span>
                    </div>
                  </div>

                  {laporanTerakhir.catatanSiswa && (
                    <p className="mt-3 text-sm text-dark">
                      <span className="text-dark-6">Catatan & saran: </span>
                      {laporanTerakhir.catatanSiswa}
                    </p>
                  )}
                </div>
              )}

              <p className="border-t border-stroke pt-4 text-center text-xs text-dark-6">
                Terima kasih atas kepercayaannya — Bimbel Cermat
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="print:hidden mt-5 text-dark-6">Gak ada laporan yang dicentang buat ditagihin.</p>
      )}
    </>
  );
}