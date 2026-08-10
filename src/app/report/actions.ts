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
  const norekTutor = formData.get("norekTutor") as string;
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const tipePeriode = (formData.get("tipePeriode") as string) || "bulanan";
  const mingguKe = Number(formData.get("mingguKe") || 0);

  if (!kelasId || !bulan || !tahun || !jumlahHadir || !norekTutor) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  try {
    await db.laporanBulanan.create({
      data: {
        kelasId,
        bulan,
        tahun,
        tipePeriode,
        mingguKe,
        jumlahHadir,
        jumlahIzin,
        norekTutor,
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
    return {
      success: false,
      message:
        mingguKe > 0
          ? `Laporan minggu ke-${mingguKe} buat siswa & bulan ini udah pernah diisi.`
          : "Laporan bulanan buat siswa & periode ini udah pernah diisi.",
    };
  }

  revalidatePath("/kelas");

  return { success: true, message: "Laporan berhasil dikirim, makasih!" };
}

export async function createLaporanKelompok(
  _prevState: LaporState,
  formData: FormData,
): Promise<LaporState> {
  const kelompokId = formData.get("kelompokId") as string;
  const bulan = Number(formData.get("bulan"));
  const tahun = Number(formData.get("tahun"));
  const tipePeriode = (formData.get("tipePeriode") as string) || "bulanan";
  const mingguKe = Number(formData.get("mingguKe") || 0);
  const jumlahKelompok = Number(formData.get("jumlahKelompok"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const norekTutor = formData.get("norekTutor") as string;
  const anggotaRaw = formData.get("anggotaIndividuData") as string;

  if (!kelompokId || !bulan || !tahun || !norekTutor) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  const anggotaIndividu: { siswaId: string; jumlahIndividu: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  try {
    await db.laporanKelompok.create({
      data: {
        kelompokId,
        bulan,
        tahun,
        tipePeriode,
        mingguKe,
        jumlahKelompok,
        jumlahIzin,
        materiDipelajari,
        pemahamanMateri,
        keaktifanBelajar,
        kemandirian,
        kedisiplinan,
        catatanSiswa,
        saranBimbel,
        norekTutor,
        anggotaLaporan: {
          create: anggotaIndividu
            .filter((a) => a.jumlahIndividu > 0)
            .map((a) => ({ siswaId: a.siswaId, jumlahIndividu: a.jumlahIndividu })),
        },
      },
    });
  } catch {
    return {
      success: false,
      message:
        mingguKe > 0
          ? `Laporan minggu ke-${mingguKe} buat siswa & bulan ini udah pernah diisi.`
          : "Laporan bulanan buat siswa & periode ini udah pernah diisi.",
    };
  }

  revalidatePath("/kelompok");
  revalidatePath("/rekap");
  revalidatePath("/");

  return { success: true, message: "Laporan kelompok berhasil dikirim, makasih!" };
}