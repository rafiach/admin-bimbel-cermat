"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { PLACEHOLDER_INFO } from "@/lib/pengaturan-default";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type SettingState = { success: boolean; message: string } | null;

const DIKENAL = new Set<string>(PLACEHOLDER_INFO.map((p) => p.key));

function placeholderAsing(tpl: string) {
  return [...tpl.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((k) => !DIKENAL.has(k));
}

export async function savePengaturan(
  _prev: SettingState,
  formData: FormData,
): Promise<SettingState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, message: "Sesi login habis, silakan login ulang." };

  // textarea mengirim baris baru sebagai \r\n, kita rapikan jadi \n
  const str = (k: string) => String(formData.get(k) ?? "").replace(/\r\n/g, "\n").trim();

  const data = {
    feeIzinOrtu: Number(formData.get("feeIzinOrtu")),
    feeIzinTutor: Number(formData.get("feeIzinTutor")),
    infoPembayaran: str("infoPembayaran"),
    templatePesanBelumLunas: str("templatePesanBelumLunas"),
    templatePesanLunas: str("templatePesanLunas"),
    namaBimbel: str("namaBimbel"),
    subjudulPrivat: str("subjudulPrivat"),
    subjudulKelompok: str("subjudulKelompok"),
    penutupKwitansi: str("penutupKwitansi"),
  };

  for (const fee of [data.feeIzinOrtu, data.feeIzinTutor]) {
    if (!Number.isInteger(fee) || fee < 0) {
      return { success: false, message: "Fee izin harus berupa angka bulat, minimal 0." };
    }
  }

  if (!data.namaBimbel || !data.templatePesanBelumLunas || !data.templatePesanLunas) {
    return { success: false, message: "Nama bimbel dan kedua template pesan tidak boleh kosong." };
  }

  const asing = [
    ...placeholderAsing(data.templatePesanBelumLunas),
    ...placeholderAsing(data.templatePesanLunas),
  ];
  if (asing.length > 0) {
    return {
      success: false,
      message: `Placeholder tidak dikenal: ${[...new Set(asing)].map((k) => `{${k}}`).join(", ")}`,
    };
  }

  await db.pengaturan.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });

  revalidatePath("/", "layout");
  return { success: true, message: "Pengaturan disimpan." };
}[]