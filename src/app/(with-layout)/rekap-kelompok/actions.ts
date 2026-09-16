"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type LaporState = { success: boolean; message: string } | null;

function getCalendarGridWeeks(bulan: number, tahun: number): Date[][] {
  const firstDay = new Date(Date.UTC(tahun, bulan - 1, 1));
  const lastDay = new Date(Date.UTC(tahun, bulan, 0));
  
  const startOffset = (firstDay.getUTCDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setUTCDate(gridStart.getUTCDate() - startOffset);
  
  const lastOffset = (lastDay.getUTCDay() + 6) % 7;
  const gridEnd = new Date(lastDay);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - lastOffset));
  
  const allDates: Date[] = [];
  const current = new Date(gridStart);
  while (current <= gridEnd) {
    allDates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }
  return weeks;
}

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

export async function updateLaporanKelompok(_prevState: LaporState, formData: FormData): Promise<LaporState> {
  const id = formData.get("laporanId") as string;
  const tipePeriode = (formData.get("tipePeriode") as string) || "bulanan";
  const mingguKe = Number(formData.get("mingguKe") || 0);
  const jumlahKelompokInput = Number(formData.get("jumlahKelompok"));
  const jumlahIzin = Number(formData.get("jumlahIzin"));
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const norekTutor = formData.get("norekTutor") as string;
  const anggotaRaw = formData.get("anggotaIndividuData") as string;

  const tanggalRaw = formData.getAll("tanggalPertemuan") as string[];
  const tanggalDipilih = tanggalRaw.filter((d) => d).map((d) => new Date(d));

  const anggotaIndividu: { siswaId: string; jumlahIndividu: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  if (tipePeriode === "mingguan") {
    if (!mingguKe || mingguKe < 1) {
      return { success: false, message: "Minggu ke harus dipilih untuk laporan mingguan." };
    }
    const weeks = getCalendarGridWeeks(
      Number(formData.get("bulan")),
      Number(formData.get("tahun"))
    );
    const selectedWeek = weeks[mingguKe - 1];
    const validDates = selectedWeek?.filter((d) => d.getUTCMonth() === Number(formData.get("bulan")) - 1) || [];
    const invalidDates = tanggalDipilih.filter(
      (d) => !validDates.some((v) => v.toISOString().split("T")[0] === d.toISOString().split("T")[0])
    );
    if (invalidDates.length > 0) {
      return { success: false, message: "Tanggal pertemuan harus berada di minggu yang dipilih." };
    }
    if (tanggalDipilih.length === 0) {
      return { success: false, message: "Minimal 1 tanggal pertemuan wajib dipilih untuk laporan mingguan." };
    }
  }

  const jumlahKelompok = tipePeriode === "mingguan" ? tanggalDipilih.length : jumlahKelompokInput;

  try {
    await db.$transaction(async (tx) => {
      const existing = await tx.laporanKelompok.findUnique({
        where: { id },
        select: { kelompokId: true },
      });

      if (!existing) {
        throw new Error("Laporan tidak ditemukan");
      }

      await tx.laporanTanggalPertemuanKelompok.deleteMany({
        where: { laporanKelompokId: id },
      });

      await tx.laporanKelompok.update({
        where: { id },
        data: {
          tipePeriode,
          mingguKe: tipePeriode === "mingguan" ? mingguKe : 0,
          jumlahKelompok,
          jumlahIzin,
          materiDipelajari,
          pemahamanMateri,
          keaktifanBelajar,
          kemandirian,
          kedisiplinan,
          catatanSiswa,
          saranBimbel,
          norekTutor,
          anggotaLaporan: {
            deleteMany: {},
            create: anggotaIndividu
              .filter((a) => a.jumlahIndividu > 0)
              .map((a) => ({ siswaId: a.siswaId, jumlahIndividu: a.jumlahIndividu })),
          },
          tanggalPertemuan: tipePeriode === "mingguan" && tanggalDipilih.length > 0
            ? {
                create: tanggalDipilih.map((tgl) => ({
                  kelompokId: existing.kelompokId,
                  tanggal: tgl,
                })),
              }
            : undefined,
        },
      });
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      if (tipePeriode === "mingguan" && mingguKe > 0) {
        return { success: false, message: `Laporan minggu ke-${mingguKe} buat kelompok & bulan ini udah pernah diisi.` };
      }
      return { success: false, message: "Laporan bulanan buat kelompok & periode ini udah pernah diisi." };
    }
    return { success: false, message: "Gagal memperbarui laporan kelompok." };
  }

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