"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ReportState = { success: boolean; message: string } | null;

export async function createLaporan(
  _prevState: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const kelasId = formData.get("kelasId") as string;
  const tanggal = formData.get("tanggal") as string;

  if (!kelasId || !tanggal) {
    return { success: false, message: "Lengkapi semua data dulu ya." };
  }

  await db.presensi.create({
    data: { kelasId, tanggal: new Date(tanggal), hadir: true },
  });

  revalidatePath("/kelas");

  return { success: true, message: "Berhasil dicatat, makasih!" };
}