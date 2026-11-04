"use client";

import { KirimWAButton } from "@/components/kwitansi/kirim-wa-button";
import { KwitansiGabunganPrivat } from "@/components/kwitansi/kwitansi-gabungan";
import { type ItemGabunganPrivat, totalGabunganPrivat } from "@/lib/kwitansi";

import { useState } from "react";
import { DownloadButton } from "../../_component/download-button";
import { linkGabungan, pesanKwitansi } from "@/lib/wa-kwitansi";

export function GabunganKwitansi({
  namaSiswa,
  namaOrtu,
  nomor,
  periodeLabel,
  items,
  filenamePrefix,
}: {
  namaSiswa: string;
  namaOrtu: string | null;
  nomor: string | null;
  periodeLabel: string;
  items: ItemGabunganPrivat[];
  filenamePrefix: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.filter((i) => i.statusBayarOrtu !== "lunas").map((i) => i.id),
  );

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));

  const pesan = pesanKwitansi({
    namaPenerima: namaOrtu,
    namaSiswa,
    periode: periodeLabel,
    total: totalGabunganPrivat(selectedItems),
    lunas: selectedItems.every((i) => i.statusBayarOrtu === "lunas"),
    link: linkGabungan(selectedItems.map((i) => i.shareToken)),
  });

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
                  {item.tutorNama} — {item.mingguKe > 0 ? `Minggu ke-${item.mingguKe}` : "Bulanan"} ({item.jumlahHadir}x)
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
          <div className="print:hidden mt-5 flex items-center justify-end gap-2">
            <KirimWAButton nomor={nomor} pesan={pesan} />
            <DownloadButton filename={filenamePrefix} />
          </div>

          <div className="mt-5">
            <KwitansiGabunganPrivat namaSiswa={namaSiswa} periodeLabel={periodeLabel} items={selectedItems} />
          </div>
        </>
      ) : (
        <p className="print:hidden mt-5 text-dark-6">Gak ada laporan yang dicentang buat ditagihin.</p>
      )}
    </>
  );
}