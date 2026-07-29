"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSiswa(formData: FormData) {
  const nama = formData.get("nama") as string;
  const sekolah = formData.get("sekolah") as string;
  const kelas = formData.get("kelas") as string;
  const noHpOrtu = formData.get("noHpOrtu") as string;
  const status = (formData.get("status") as string) || "aktif";

  if (!nama?.trim()) {
    throw new Error("Nama wajib diisi");
  }

  await db.siswa.create({
    data: { nama, sekolah, kelas, noHpOrtu, status },
  });

  revalidatePath("/siswa");
  redirect("/siswa");
}

export async function updateSiswa(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const sekolah = formData.get("sekolah") as string;
  const kelas = formData.get("kelas") as string;
  const noHpOrtu = formData.get("noHpOrtu") as string;
  const status = formData.get("status") as string;

  await db.siswa.update({
    where: { id },
    data: { nama, sekolah, kelas, noHpOrtu, status },
  });

  revalidatePath("/siswa");
  redirect("/siswa");
}

export async function deleteSiswa(formData: FormData) {
  const id = formData.get("id") as string;
  await db.siswa.delete({ where: { id } });
  revalidatePath("/siswa");
}