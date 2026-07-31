"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleBayarOrtu(formData: FormData) {
  const id = formData.get("id") as string;
  const current = formData.get("current") as string;

  await db.laporanBulanan.update({
    where: { id },
    data: { statusBayarOrtu: current === "lunas" ? "belum" : "lunas" },
  });

  revalidatePath("/rekap");
}

export async function toggleBayarTutor(formData: FormData) {
  const id = formData.get("id") as string;
  const current = formData.get("current") as string;

  await db.laporanBulanan.update({
    where: { id },
    data: { statusBayarTutor: current === "sudah" ? "belum" : "sudah" },
  });

  revalidatePath("/rekap");
}

export async function updateLaporan(id: string, formData: FormData) {
  const jumlahHadir = Number(formData.get("jumlahHadir"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const norekTutor = formData.get("norekTutor") as string;

  await db.laporanBulanan.update({
    where: { id },
    data: {
      jumlahHadir,
      jumlahIzin,
      materiDipelajari,
      pemahamanMateri,
      keaktifanBelajar,
      kemandirian,
      kedisiplinan,
      catatanSiswa,
      saranBimbel,
      norekTutor,
    },
  });

  revalidatePath("/rekap");
  revalidatePath(`/rekap/${id}`);
  redirect("/rekap");
}

export async function deleteLaporan(formData: FormData) {
  const id = formData.get("id") as string;
  await db.laporanBulanan.delete({ where: { id } });
  revalidatePath("/rekap");
  redirect("/rekap");
}

