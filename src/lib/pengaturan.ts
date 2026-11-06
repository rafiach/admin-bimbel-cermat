import { db } from "@/lib/db";
import { PENGATURAN_DEFAULT, type Pengaturan } from "@/lib/pengaturan-default";
import { cache } from "react";

export const getPengaturan = cache(async (): Promise<Pengaturan> => {
  const row = await db.pengaturan.findUnique({ where: { id: "default" } });
  if (!row) return PENGATURAN_DEFAULT;

  return {
    feeIzinOrtu: row.feeIzinOrtu,
    feeIzinTutor: row.feeIzinTutor,
    infoPembayaran: row.infoPembayaran,
    templatePesanBelumLunas: row.templatePesanBelumLunas,
    templatePesanLunas: row.templatePesanLunas,
    namaBimbel: row.namaBimbel,
    subjudulPrivat: row.subjudulPrivat,
    subjudulKelompok: row.subjudulKelompok,
    penutupKwitansi: row.penutupKwitansi,
  };
});