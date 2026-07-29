"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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