"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizePhoneID } from "@/lib/phone";

export async function createSiswa(formData: FormData) {
  const nama = formData.get("nama") as string;
  const namaOrtu = formData.get("namaOrtu") as string;
  const sekolah = formData.get("sekolah") as string;
  const kelas = formData.get("kelas") as string;
  const noHpOrtuRaw = formData.get("noHpOrtu") as string;
  const noHpOrtu = noHpOrtuRaw ? normalizePhoneID(noHpOrtuRaw) : null;
  const biayaBimbelRaw = formData.get("biayaBimbel") as string;
  const biayaBimbel = biayaBimbelRaw ? Number(biayaBimbelRaw) : null;
  const status = "nonaktif";

  if (!nama?.trim()) {
    throw new Error("Nama wajib diisi");
  }

  await db.siswa.create({
    data: { nama, namaOrtu, sekolah, kelas, noHpOrtu, biayaBimbel, status },
  });

  revalidatePath("/siswa");
  redirect("/siswa");
}

export async function updateSiswa(id: string, formData: FormData) {
  const nama = formData.get("nama") as string;
  const namaOrtu = formData.get("namaOrtu") as string;
  const sekolah = formData.get("sekolah") as string;
  const kelas = formData.get("kelas") as string;
  const noHpOrtuRaw = formData.get("noHpOrtu") as string;
  const noHpOrtu = noHpOrtuRaw ? normalizePhoneID(noHpOrtuRaw) : null;
  const biayaBimbelRaw = formData.get("biayaBimbel") as string;
  const biayaBimbel = biayaBimbelRaw ? Number(biayaBimbelRaw) : null;
  const status = formData.get("status") as string;

  await db.siswa.update({
    where: { id },
    data: { nama, namaOrtu, sekolah, kelas, noHpOrtu, biayaBimbel, status },
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