"use server";

import { combinePhone } from "@/lib/phone";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKelompok(formData: FormData) {
  const nama = formData.get("nama") as string;
  const tutorId = formData.get("tutorId") as string;
  const jadwal = formData.get("jadwal") as string;
  const hargaKelompok = Number(formData.get("hargaKelompok"));
  const feeTutorKelompok = Number(formData.get("feeTutorKelompok"));
  const namaWali = formData.get("namaWali") as string;
  const noHpWali = combinePhone(
    formData.get("noHpWali_kode") as string,
    formData.get("noHpWali_nomor") as string,
  );
  const anggotaRaw = formData.get("anggotaData") as string;
  const anggotaData: { siswaId: string; hargaPrivat: number; feeTutorPrivat: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  if (!nama || !tutorId || !jadwal || anggotaData.length < 2) {
    throw new Error("Lengkapi data kelompok, minimal 2 anggota");
  }

  const siswaIds = anggotaData.map((a) => a.siswaId);

  await db.$transaction([
    db.kelompok.create({
      data: {
        nama,
        tutorId,
        jadwal,
        hargaKelompok,
        feeTutorKelompok,
        namaWali,
        noHpWali,
        anggota: {
          create: anggotaData.map((a) => ({
            siswaId: a.siswaId,
            hargaPrivat: a.hargaPrivat,
            feeTutor: a.feeTutorPrivat,
          })),
        },
      },
    }),
    db.siswa.updateMany({ where: { id: { in: siswaIds } }, data: { status: "aktif" } }),
  ]);

  revalidatePath("/kelompok");
  revalidatePath("/siswa");
  revalidatePath("/report");
  redirect("/kelompok");
}

export async function deleteKelompok(formData: FormData) {
  const id = formData.get("id") as string;

  const laporanCount = await db.laporanKelompok.count({ where: { kelompokId: id } });
  if (laporanCount > 0) {
    redirect(
      `/kelompok?error=${encodeURIComponent("Kelompok ini udah punya riwayat laporan, gak bisa dihapus. Nonaktifkan aja.")}`,
    );
  }

  await db.kelompok.delete({ where: { id } });
  revalidatePath("/kelompok");
  revalidatePath("/report");
}

export async function updateKelompok(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const jadwal = formData.get("jadwal") as string;
  const hargaKelompok = Number(formData.get("hargaKelompok"));
  const feeTutorKelompok = Number(formData.get("feeTutorKelompok"));
  const namaWali = formData.get("namaWali") as string;
  const noHpWali = combinePhone(
    formData.get("noHpWali_kode") as string,
    formData.get("noHpWali_nomor") as string,
  );
  const status = formData.get("status") as string;
  const anggotaRaw = formData.get("anggotaUpdateData") as string;
  const anggotaUpdate: { id: string; hargaPrivat: number; feeTutor: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  await db.$transaction([
    db.kelompok.update({
      where: { id },
      data: { nama, jadwal, hargaKelompok, feeTutorKelompok, namaWali, noHpWali, status },
    }),
    ...anggotaUpdate.map((a) =>
      db.anggotaKelompok.update({
        where: { id: a.id },
        data: { hargaPrivat: a.hargaPrivat, feeTutor: a.feeTutor },
      }),
    ),
  ]);

  revalidatePath("/kelompok");
  revalidatePath("/report");
  redirect("/kelompok");
}