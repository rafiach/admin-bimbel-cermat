"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSiswa(formData: FormData) {
  const nama = formData.get("nama") as string;
  const sekolah = formData.get("sekolah") as string;
  const kelas = formData.get("kelas") as string;
  const noHpOrtu = formData.get("noHpOrtu") as string;
  const noRekOrtu = formData.get("noRekOrtu") as string;
  const biayaBimbelRaw = formData.get("biayaBimbel") as string;
  const biayaBimbel = biayaBimbelRaw ? Number(biayaBimbelRaw) : null;
  const notes = formData.get("notes") as string;
  const status = "nonaktif";

  if (!nama?.trim()) {
    throw new Error("Nama wajib diisi");
  }

  await db.siswa.create({
    data: { nama, sekolah, kelas, noHpOrtu, noRekOrtu, biayaBimbel, notes,status },
  });

  revalidatePath("/siswa");
  redirect("/siswa");
}

export async function updateSiswa(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const sekolah = formData.get("sekolah") as string;
  const kelas = formData.get("kelas") as string;
  const noHpOrtu = formData.get("noHpOrtu") as string;
  const noRekOrtu = formData.get("noRekOrtu") as string;
  const biayaBimbelRaw = formData.get("biayaBimbel") as string;
  const biayaBimbel = biayaBimbelRaw ? Number(biayaBimbelRaw) : null;
  const notes = formData.get("notes") as string;
  const status = formData.get("status") as string;

  await db.siswa.update({
    where: { id },
    data: { nama, sekolah, kelas, noHpOrtu, noRekOrtu, biayaBimbel, notes, status },
  });

  revalidatePath("/siswa");
  redirect("/siswa");
}

export async function deleteSiswa(formData: FormData) {
  const id = formData.get("id") as string;

  const kelasCount = await db.kelas.count({ where: { siswaId: id } });
  if (kelasCount > 0) {
    redirect(
      `/siswa?error=${encodeURIComponent("Siswa ini masih punya kelas aktif, gak bisa dihapus. Nonaktifkan aja lewat tombol Edit.")}`,
    );
  }

  await db.siswa.delete({ where: { id } });
  revalidatePath("/siswa");
}