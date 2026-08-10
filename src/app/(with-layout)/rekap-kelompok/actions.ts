"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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

export async function updateLaporanKelompok(id: string, formData: FormData) {
  const jumlahKelompok = Number(formData.get("jumlahKelompok"));
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const norekTutor = formData.get("norekTutor") as string;
  const anggotaRaw = formData.get("anggotaIndividuData") as string;
  const anggotaIndividu: { siswaId: string; jumlahIndividu: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  await db.$transaction([
    db.laporanKelompok.update({
      where: { id },
      data: {
        jumlahKelompok,
        materiDipelajari,
        pemahamanMateri,
        keaktifanBelajar,
        kemandirian,
        kedisiplinan,
        catatanSiswa,
        saranBimbel,
        norekTutor,
      },
    }),
    db.anggotaLaporanKelompok.deleteMany({ where: { laporanKelompokId: id } }),
    ...anggotaIndividu
      .filter((a) => a.jumlahIndividu > 0)
      .map((a) =>
        db.anggotaLaporanKelompok.create({
          data: { laporanKelompokId: id, siswaId: a.siswaId, jumlahIndividu: a.jumlahIndividu },
        }),
      ),
  ]);

  revalidatePath("/rekap-kelompok");
  revalidatePath(`/rekap-kelompok/${id}`);
  redirect("/rekap-kelompok");
}

export async function deleteLaporanKelompok(formData: FormData) {
  const id = formData.get("id") as string;
  await db.laporanKelompok.delete({ where: { id } });
  revalidatePath("/rekap-kelompok");
  redirect("/rekap-kelompok");
}