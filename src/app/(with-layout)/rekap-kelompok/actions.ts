"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleBayarOrtuKelompok(formData: FormData) {
  const id = formData.get("id") as string;
  const current = formData.get("current") as string;

  await db.laporanKelompok.update({
    where: { id },
    data: { statusBayarOrtu: current === "lunas" ? "belum" : "lunas" },
  });

  revalidatePath("/rekap-kelompok");
  revalidatePath(`/rekap-kelompok/${id}`);
}

export async function toggleBayarTutorKelompok(formData: FormData) {
  const id = formData.get("id") as string;
  const current = formData.get("current") as string;

  await db.laporanKelompok.update({
    where: { id },
    data: { statusBayarTutor: current === "sudah" ? "belum" : "sudah" },
  });

  revalidatePath("/rekap-kelompok");
  revalidatePath(`/rekap-kelompok/${id}`);
}

export async function updateHargaFinal(formData: FormData) {
  const id = formData.get("id") as string;
  const hargaKelompokFinal = Number(formData.get("hargaKelompokFinal"));

  await db.laporanKelompok.update({
    where: { id },
    data: { hargaKelompokFinal },
  });

  revalidatePath(`/rekap-kelompok/${id}`);
}