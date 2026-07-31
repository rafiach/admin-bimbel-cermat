"use server";

import { db } from "@/lib/db";
import { combinePhone } from "@/lib/phone";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTutor(formData: FormData) {
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;
  const jenjang = formData.get("jenjang") as string;
  const noHp = combinePhone(
    formData.get("noHp_kode") as string,
    formData.get("noHp_nomor") as string,
  );
  const status = (formData.get("status") as string) || "aktif";

  if (!nama?.trim()) {
    throw new Error("Nama wajib diisi");
  }

  await db.tutor.create({
    data: { nama, alamat, jenjang, noHp, status },
  });

  revalidatePath("/tutor");
  redirect("/tutor");
}

export async function updateTutor(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const alamat = formData.get("alamat") as string;
  const jenjang = formData.get("jenjang") as string;
  const noHp = combinePhone(
    formData.get("noHp_kode") as string,
    formData.get("noHp_nomor") as string,
  );
  const status = (formData.get("status") as string) || "aktif";

  await db.tutor.update({
    where: { id },
    data: { nama, alamat, jenjang, noHp, status },
  });

  revalidatePath("/tutor");
  redirect("/tutor");
}

export async function deleteTutor(formData: FormData) {
  const id = formData.get("id") as string;

  const kelasCount = await db.kelas.count({ where: { tutorId: id } });
  if (kelasCount > 0) {
    redirect(
      `/tutor?error=${encodeURIComponent("Tutor ini masih punya kelas aktif, gak bisa dihapus. Nonaktifkan aja lewat tombol Edit.")}`,
    );
  }

  await db.tutor.delete({ where: { id } });
  revalidatePath("/tutor");
}