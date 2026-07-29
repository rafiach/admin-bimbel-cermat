"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTutor(formData: FormData) {
  const nama = formData.get("nama") as string;
  const noHp = formData.get("noHp") as string;
  const alamat = formData.get("almat") as string;
  const jenjang = formData.get("jenjang") as string;
  const status = (formData.get("status") as string) || "aktif";

  if (!nama?.trim()) {
    throw new Error("Nama wajib diisi");
  }

  await db.tutor.create({
    data: { nama, jenjang, noHp, status },
  });

  revalidatePath("/tutor");
  redirect("/tutor");
}

export async function updateTutor(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const noHp = formData.get("noHp") as string;
  const alamat = formData.get("alamat") as string;
  const jenjang = formData.get("jenjang") as string;
  const status = (formData.get("status") as string) || "aktif";

  await db.tutor.update({
    where: { id },
    data: { nama, noHp, alamat, jenjang,status },
  });

  revalidatePath("/tutor");
  redirect("/tutor");
}

export async function deleteTutor(formData: FormData) {
  const id = formData.get("id") as string;
  await db.tutor.delete({ where: { id } });
  revalidatePath("/tutor");
}