"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

function getWeekDates(bulan: number, tahun: number, mingguKe: number): Date[] {
  const weeks = getCalendarGridWeeks(bulan, tahun);
  const week = weeks[mingguKe - 1];
  if (!week) return [];
  
  // Filter to only current month dates
  return week.filter(d => d.getUTCMonth() === bulan - 1);
}

export async function createLaporan(
  _prevState: LaporState,
  formData: FormData,
): Promise<LaporState> {
  const kelasId = formData.get("kelasId") as string;
  const bulan = Number(formData.get("bulan"));
  const tahun = Number(formData.get("tahun"));
  const jumlahHadirInput = Number(formData.get("jumlahHadir"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
  const norekTutor = formData.get("norekTutor") as string;
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const mingguKe = Number(formData.get("mingguKe") || 0);
  const partnerRaw = formData.get("partnerKelasIds") as string;
  const partnerKelasIds = partnerRaw ? JSON.parse(partnerRaw) : [];

  const kelasData = await db.kelas.findUnique({ where: { id: kelasId }, select: { tipePeriode: true } });
  if (!kelasData) return { success: false, message: "Kelas tidak ditemukan." };
  const tipePeriode = kelasData.tipePeriode;

  if (tipePeriode === "bulanan" && (!materiDipelajari?.trim() || !catatanSiswa?.trim() || !saranBimbel?.trim())) {
    return { success: false, message: "Laporan bulanan wajib mengisi materi, catatan siswa, dan saran." };
  }
  const tanggalRaw = formData.getAll("tanggalPertemuan") as string[];
  const tanggalDipilih = tanggalRaw.filter((d) => d).map((d) => new Date(d));

  // For mingguan, jumlahHadir is auto-calculated from selected dates
  const jumlahHadir = tipePeriode === "mingguan" ? tanggalDipilih.length : jumlahHadirInput;

  if (!kelasId || !bulan || !tahun || !jumlahHadir || !norekTutor) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  if (tipePeriode === "mingguan") {
    if (!mingguKe || mingguKe < 1 || mingguKe > 5) {
      return { success: false, message: "Minggu ke harus dipilih untuk laporan mingguan." };
    }
    const validDates = getWeekDates(bulan, tahun, mingguKe);
    const validDateStrings = new Set(validDates.map(d => d.toISOString().split("T")[0]));
    const invalidDates = tanggalDipilih.filter(d => !validDateStrings.has(d.toISOString().split("T")[0]));
    if (invalidDates.length > 0) {
      return { success: false, message: "Tanggal pertemuan harus berada di minggu yang dipilih." };
    }
    if (tanggalDipilih.length === 0) {
      return { success: false, message: "Minimal 1 tanggal pertemuan wajib dipilih untuk laporan mingguan." };
    }
  }

  try {
    await db.$transaction(async (tx) => {
      const data: any = {
        kelasId,
        bulan,
        tahun,
        tipePeriode,
        mingguKe: tipePeriode === "mingguan" ? mingguKe : 0,
        jumlahHadir,
        jumlahIzin,
        norekTutor,
        materiDipelajari,
        pemahamanMateri,
        keaktifanBelajar,
        kemandirian,
        kedisiplinan,
        catatanSiswa,
        saranBimbel,
      };

      if (tipePeriode === "mingguan" && tanggalDipilih.length > 0) {
        data.tanggalPertemuan = {
          create: tanggalDipilih.map((tgl) => ({
            kelasId,
            tanggal: tgl,
          })),
        };
      }

      await tx.laporanBulanan.create({ data });

      if (partnerKelasIds.length > 0) {
        for (const partnerId of partnerKelasIds) {
          const partnerData = { ...data, kelasId: partnerId };
          await tx.laporanBulanan.create({ data: partnerData });
        }
      }
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      if (tipePeriode === "mingguan" && mingguKe > 0) {
        return { success: false, message: `Laporan minggu ke-${mingguKe} buat siswa & bulan ini udah pernah diisi.` };
      }
      return { success: false, message: "Laporan bulanan buat siswa & periode ini udah pernah diisi." };
    }
    return { success: false, message: "Gagal menyimpan laporan." };
  }

  revalidatePath("/kelas");

  return { success: true, message: "Laporan berhasil dikirim, makasih!" };
}

export async function createLaporanKelompok(
  _prevState: LaporState,
  formData: FormData,
): Promise<LaporState> {
  const kelompokId = formData.get("kelompokId") as string;
  const bulan = Number(formData.get("bulan"));
  const tahun = Number(formData.get("tahun"));
  const mingguKe = Number(formData.get("mingguKe") || 0);
  const jumlahKelompokInput = Number(formData.get("jumlahKelompok"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const norekTutor = formData.get("norekTutor") as string;
  const anggotaRaw = formData.get("anggotaIndividuData") as string;
  const kelompokData = await db.kelompok.findUnique({ where: { id: kelompokId }, select: { tipePeriode: true } });
  if (!kelompokData) return { success: false, message: "Kelompok tidak ditemukan." };
  const tipePeriode = kelompokData.tipePeriode;

  if (tipePeriode === "bulanan" && (!materiDipelajari?.trim() || !catatanSiswa?.trim() || !saranBimbel?.trim())) {
    return { success: false, message: "Laporan bulanan wajib mengisi materi, catatan siswa, dan saran." };
  }
  const tanggalRaw = formData.getAll("tanggalPertemuan") as string[];
  const tanggalDipilih = tanggalRaw.filter((d) => d).map((d) => new Date(d));

  // For mingguan, jumlahKelompok is auto-calculated from selected dates
  const jumlahKelompok = tipePeriode === "mingguan" ? tanggalDipilih.length : jumlahKelompokInput;

  if (!kelompokId || !bulan || !tahun || !norekTutor) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  if (tipePeriode === "mingguan") {
    if (!mingguKe || mingguKe < 1 || mingguKe > 5) {
      return { success: false, message: "Minggu ke harus dipilih untuk laporan mingguan." };
    }
    const validDates = getWeekDates(bulan, tahun, mingguKe);
    const validDateStrings = new Set(validDates.map(d => d.toISOString().split("T")[0]));
    const invalidDates = tanggalDipilih.filter(d => !validDateStrings.has(d.toISOString().split("T")[0]));
    if (invalidDates.length > 0) {
      return { success: false, message: "Tanggal pertemuan harus berada di minggu yang dipilih." };
    }
    if (tanggalDipilih.length === 0) {
      return { success: false, message: "Minimal 1 tanggal pertemuan wajib dipilih untuk laporan mingguan." };
    }
  }

  const anggotaIndividu: { siswaId: string; jumlahIndividu: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  try {
    await db.$transaction(async (tx) => {
      const data: any = {
        kelompokId,
        bulan,
        tahun,
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
          create: anggotaIndividu
            .filter((a) => a.jumlahIndividu > 0)
            .map((a) => ({ siswaId: a.siswaId, jumlahIndividu: a.jumlahIndividu })),
        },
      };

      if (tipePeriode === "mingguan" && tanggalDipilih.length > 0) {
        data.tanggalPertemuan = {
          create: tanggalDipilih.map((tgl) => ({
            kelompokId,
            tanggal: tgl,
          })),
        };
      }

      await tx.laporanKelompok.create({ data });
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      if (tipePeriode === "mingguan" && mingguKe > 0) {
        return { success: false, message: `Laporan minggu ke-${mingguKe} buat kelompok & bulan ini udah pernah diisi.` };
      }
      return { success: false, message: "Laporan bulanan buat kelompok & periode ini udah pernah diisi." };
    }
    return { success: false, message: "Gagal menyimpan laporan kelompok." };
  }

  revalidatePath("/kelompok");
  revalidatePath("/rekap");
  revalidatePath("/");

  return { success: true, message: "Laporan kelompok berhasil dikirim, makasih!" };
}

export async function updateLaporan(
  _prevState: LaporState,
  formData: FormData,
): Promise<LaporState> {
  const laporanId = formData.get("laporanId") as string;
  const bulan = Number(formData.get("bulan"));
  const tahun = Number(formData.get("tahun"));
  const jumlahHadirInput = Number(formData.get("jumlahHadir"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
  const norekTutor = formData.get("norekTutor") as string;
  const materiDipelajari = formData.get("materiDipelajari") as string;
  const pemahamanMateri = Number(formData.get("pemahamanMateri"));
  const keaktifanBelajar = Number(formData.get("keaktifanBelajar"));
  const kemandirian = Number(formData.get("kemandirian"));
  const kedisiplinan = Number(formData.get("kedisiplinan"));
  const catatanSiswa = formData.get("catatanSiswa") as string;
  const saranBimbel = formData.get("saranBimbel") as string;
  const tipePeriode = (formData.get("tipePeriode") as string) || "bulanan";
  const mingguKe = Number(formData.get("mingguKe") || 0);

  const tanggalRaw = formData.getAll("tanggalPertemuan") as string[];
  const tanggalDipilih = tanggalRaw.filter((d) => d).map((d) => new Date(d));

  // For mingguan, jumlahHadir is auto-calculated from selected dates
  const jumlahHadir = tipePeriode === "mingguan" ? tanggalDipilih.length : jumlahHadirInput;

  if (!laporanId || !bulan || !tahun || !jumlahHadir || !norekTutor) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  if (tipePeriode === "mingguan") {
    if (!mingguKe || mingguKe < 1 || mingguKe > 5) {
      return { success: false, message: "Minggu ke harus dipilih untuk laporan mingguan." };
    }
    const validDates = getWeekDates(bulan, tahun, mingguKe);
    const validDateStrings = new Set(validDates.map(d => d.toISOString().split("T")[0]));
    const invalidDates = tanggalDipilih.filter(d => !validDateStrings.has(d.toISOString().split("T")[0]));
    if (invalidDates.length > 0) {
      return { success: false, message: "Tanggal pertemuan harus berada di minggu yang dipilih." };
    }
    if (tanggalDipilih.length === 0) {
      return { success: false, message: "Minimal 1 tanggal pertemuan wajib dipilih untuk laporan mingguan." };
    }
  }

  try {
    await db.$transaction(async (tx) => {
      const existing = await tx.laporanBulanan.findUnique({
        where: { id: laporanId },
        select: { kelasId: true },
      });

      if (!existing) {
        throw new Error("Laporan tidak ditemukan");
      }

      await tx.laporanTanggalPertemuan.deleteMany({
        where: { laporanId },
      });

      const data: any = {
        bulan,
        tahun,
        tipePeriode,
        mingguKe: tipePeriode === "mingguan" ? mingguKe : 0,
        jumlahHadir,
        jumlahIzin,
        norekTutor,
        materiDipelajari,
        pemahamanMateri,
        keaktifanBelajar,
        kemandirian,
        kedisiplinan,
        catatanSiswa,
        saranBimbel,
      };

      if (tipePeriode === "mingguan" && tanggalDipilih.length > 0) {
        data.tanggalPertemuan = {
          create: tanggalDipilih.map((tgl) => ({
            kelasId: existing.kelasId,
            tanggal: tgl,
          })),
        };
      }

      await tx.laporanBulanan.update({
        where: { id: laporanId },
        data,
      });
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      if (tipePeriode === "mingguan" && mingguKe > 0) {
        return { success: false, message: `Laporan minggu ke-${mingguKe} buat siswa & bulan ini udah pernah diisi.` };
      }
      return { success: false, message: "Laporan bulanan buat siswa & periode ini udah pernah diisi." };
    }
    return { success: false, message: "Gagal memperbarui laporan." };
  }

  revalidatePath("/kelas");
  revalidatePath("/rekap");

  return { success: true, message: "Laporan berhasil diperbarui." };
}

export async function updateLaporanKelompok(
  _prevState: LaporState,
  formData: FormData,
): Promise<LaporState> {
  const laporanId = formData.get("laporanId") as string;
  const bulan = Number(formData.get("bulan"));
  const tahun = Number(formData.get("tahun"));
  const tipePeriode = (formData.get("tipePeriode") as string) || "bulanan";
  const mingguKe = Number(formData.get("mingguKe") || 0);
  const jumlahKelompokInput = Number(formData.get("jumlahKelompok"));
  const jumlahIzin = Number(formData.get("jumlahIzin") || 0);
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

  // For mingguan, jumlahKelompok is auto-calculated from selected dates
  const jumlahKelompok = tipePeriode === "mingguan" ? tanggalDipilih.length : jumlahKelompokInput;

  if (!laporanId || !bulan || !tahun || !norekTutor) {
    return { success: false, message: "Lengkapi semua data wajib dulu ya." };
  }

  if (tipePeriode === "mingguan") {
    if (!mingguKe || mingguKe < 1 || mingguKe > 5) {
      return { success: false, message: "Minggu ke harus dipilih untuk laporan mingguan." };
    }
    const validDates = getWeekDates(bulan, tahun, mingguKe);
    const validDateStrings = new Set(validDates.map(d => d.toISOString().split("T")[0]));
    const invalidDates = tanggalDipilih.filter(d => !validDateStrings.has(d.toISOString().split("T")[0]));
    if (invalidDates.length > 0) {
      return { success: false, message: "Tanggal pertemuan harus berada di minggu yang dipilih." };
    }
    if (tanggalDipilih.length === 0) {
      return { success: false, message: "Minimal 1 tanggal pertemuan wajib dipilih untuk laporan mingguan." };
    }
  }

  const anggotaIndividu: { siswaId: string; jumlahIndividu: number }[] = anggotaRaw
    ? JSON.parse(anggotaRaw)
    : [];

  try {
    await db.$transaction(async (tx) => {
      const existing = await tx.laporanKelompok.findUnique({
        where: { id: laporanId },
        select: { kelompokId: true },
      });

      if (!existing) {
        throw new Error("Laporan tidak ditemukan");
      }

      await tx.laporanTanggalPertemuanKelompok.deleteMany({
        where: { laporanKelompokId: laporanId },
      });

      const data: any = {
        bulan,
        tahun,
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
      };

      if (tipePeriode === "mingguan" && tanggalDipilih.length > 0) {
        data.tanggalPertemuan = {
          create: tanggalDipilih.map((tgl) => ({
            kelompokId: existing.kelompokId,
            tanggal: tgl,
          })),
        };
      }

      await tx.laporanKelompok.update({
        where: { id: laporanId },
        data,
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

  revalidatePath("/kelompok");
  revalidatePath("/rekap");
  revalidatePath("/");

  return { success: true, message: "Laporan kelompok berhasil diperbarui." };
}