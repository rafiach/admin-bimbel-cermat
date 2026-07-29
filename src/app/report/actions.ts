"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type LaporState = { success: boolean; message: string } | null;

export async function createLaporan(
  _prevState: LaporState,
  formData: FormData,
): Promise<LaporState> {
  const kelasId = formData.get("kelasId") as string;
  const bulan = Number(formData.get("bulan"));
  const tahun = Number(formData.get("tahun"));
  const jumlahHadir = Number(formData.get("jumlahHadir"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;

  if (!kelasId || !bulan || !tahun || !jumlahHadir) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  try {
    await db.laporanBulanan.create({
      data: {
        kelasId,
        bulan,
        tahun,
        jumlahHadir,
        jumlahIzin,
        materiDipelajari,
        pemahamanMateri,
        keaktifanBelajar,
        kemandirian,
        kedisiplinan,
        catatanSiswa,
        saranBimbel,
      },
    });
  } catch {
    return { success: false, message: "Laporan buat siswa & bulan ini udah pernah diisi sebelumnya." };
  }

  revalidatePath("/kelas");

  return { success: true, message: "Laporan berhasil dikirim, makasih!" };
}