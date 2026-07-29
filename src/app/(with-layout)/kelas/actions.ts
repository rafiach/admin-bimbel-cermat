"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKelas(formData: FormData) {
  const siswaId = formData.get("siswaId") as string;
  const tutorId = formData.get("tutorId") as string;
  const tipe = formData.get("tipe") as string;
  const jadwal = formData.get("jadwal") as string;
  const biayaOrtu = Number(formData.get("biayaOrtu"));
  const feeTutor = Number(formData.get("feeTutor"));

  await db.kelas.create({
    data: { siswaId, tutorId, tipe, jadwal, biayaOrtu, feeTutor },
  });

  revalidatePath("/kelas");
  redirect("/kelas");
}

export async function updateKelas(id: string, formData: FormData) {
  const jadwal = formData.get("jadwal") as string;
  const tipe = formData.get("tipe") as string;
  const biayaOrtu = Number(formData.get("biayaOrtu"));
  const feeTutor = Number(formData.get("feeTutor"));
  const status = formData.get("status") as string;

  await db.kelas.update({
    where: { id },
    data: { jadwal, tipe, biayaOrtu, feeTutor, status },
  });

  revalidatePath("/kelas");
  redirect("/kelas");
}

export async function deleteKelas(formData: FormData) {
  const id = formData.get("id") as string;
  await db.kelas.delete({ where: { id } });
  revalidatePath("/kelas");
}