import { db } from "@/lib/db";

function getMonthlyTarget(now: Date): { bulan: number; tahun: number } | null {
  const day = now.getDate();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const inWindow = day <= 7 || day > lastDay - 3;
  if (!inWindow) return null;
  if (day <= 7) {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { bulan: prev.getMonth() + 1, tahun: prev.getFullYear() };
  }
  return { bulan: now.getMonth() + 1, tahun: now.getFullYear() };
}

function getWeeklyTarget(now: Date): { bulan: number; tahun: number; mingguKe: number; monday: Date } {
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();
  let mingguKe = Math.ceil(now.getDate() / 7);
  if (mingguKe < 1) mingguKe = 1;
  if (mingguKe > 5) mingguKe = 5;
  // Senin minggu ini untuk label/reset
  const day = now.getDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  return { bulan, tahun, mingguKe, monday };
}

export async function NotifGroup({ bulan, tahun: _tahun }: { bulan: number; tahun: number }) {
  const now = new Date();
  const monthlyTarget = getMonthlyTarget(now);
  const weeklyTarget = getWeeklyTarget(now);
  const isInMonthlyWindow = !!monthlyTarget;

  // Siswa tanpa tutor
  const siswaPromise = db.siswa.findMany({
    where: { status: "nonaktif", kelasList: { none: {} } },
    orderBy: { createdAt: "desc" },
    select: { id: true, nama: true },
  });

  // Infer tipe tanpa ubah DB: kelas/kelompok yang pernah punya laporan mingguan dianggap mingguan, sisanya bulanan
  const mingguanKelasIdsPromise = db.laporanBulanan
    .findMany({
      where: { tipePeriode: "mingguan" },
      select: { kelasId: true },
      distinct: ["kelasId"],
    })
    .then((rows) => rows.map((r) => r.kelasId));

  const mingguanKelompokIdsPromise = db.laporanKelompok
    .findMany({
      where: { tipePeriode: "mingguan" },
      select: { kelompokId: true },
      distinct: ["kelompokId"],
    })
    .then((rows) => rows.map((r) => r.kelompokId));

  const [siswa, mingguanKelasIds, mingguanKelompokIds] = await Promise.all([
    siswaPromise,
    mingguanKelasIdsPromise,
    mingguanKelompokIdsPromise,
  ]);

  // --- Bulanan: hanya untuk kelas/kelompok yang BUKAN mingguan (infer bulanan) ---
  // Jika monthlyTarget null (di luar window), skip query
  const monthlyKelasPromise = monthlyTarget
    ? db.kelas.findMany({
        where: {
          status: "aktif",
          ...(mingguanKelasIds.length > 0 ? { id: { notIn: mingguanKelasIds } } : {}),
          laporan: { none: { bulan: monthlyTarget.bulan, tahun: monthlyTarget.tahun, tipePeriode: "bulanan" } },
        },
        include: { tutor: true, siswa: true },
        orderBy: { tutor: { nama: "asc" } },
      })
    : Promise.resolve([] as any[]);

  const monthlyKelompokPromise = monthlyTarget
    ? db.kelompok.findMany({
        where: {
          status: "aktif",
          ...(mingguanKelompokIds.length > 0 ? { id: { notIn: mingguanKelompokIds } } : {}),
          laporan: { none: { bulan: monthlyTarget.bulan, tahun: monthlyTarget.tahun, tipePeriode: "bulanan" } },
        },
        include: { tutor: true },
        orderBy: { tutor: { nama: "asc" } },
      })
    : Promise.resolve([] as any[]);

  // --- Mingguan: hanya untuk kelas/kelompok yang pernah mingguan (infer mingguan), reset tiap Senin ---
  const weeklyKelasPromise =
    mingguanKelasIds.length > 0
      ? db.kelas.findMany({
          where: {
            status: "aktif",
            id: { in: mingguanKelasIds },
            laporan: {
              none: {
                bulan: weeklyTarget.bulan,
                tahun: weeklyTarget.tahun,
                mingguKe: weeklyTarget.mingguKe,
                tipePeriode: "mingguan",
              },
            },
          },
          include: { tutor: true, siswa: true },
          orderBy: { tutor: { nama: "asc" } },
        })
      : Promise.resolve([] as any[]);

  const weeklyKelompokPromise =
    mingguanKelompokIds.length > 0
      ? db.kelompok.findMany({
          where: {
            status: "aktif",
            id: { in: mingguanKelompokIds },
            laporan: {
              none: {
                bulan: weeklyTarget.bulan,
                tahun: weeklyTarget.tahun,
                mingguKe: weeklyTarget.mingguKe,
                tipePeriode: "mingguan",
              },
            },
          },
          include: { tutor: true },
          orderBy: { tutor: { nama: "asc" } },
        })
      : Promise.resolve([] as any[]);

  const [kelasBulananRaw, kelompokBulananRaw, kelasMingguanRaw, kelompokMingguanRaw] = await Promise.all([
    monthlyKelasPromise,
    monthlyKelompokPromise,
    weeklyKelasPromise,
    weeklyKelompokPromise,
  ]);

  const kelasTelatBulanan = (kelasBulananRaw as any[]).map((k: any) => ({
    id: k.id as string,
    tutorNama: k.tutor.nama as string,
    siswaNama: k.siswa.nama as string,
    jadwal: k.jadwal as string,
  }));
  const kelompokTelatBulanan = (kelompokBulananRaw as any[]).map((k: any) => ({
    id: k.id as string,
    tutorNama: k.tutor.nama as string,
    nama: k.nama as string,
    jadwal: k.jadwal as string,
  }));
  const kelasTelatMingguan = (kelasMingguanRaw as any[]).map((k: any) => ({
    id: k.id as string,
    tutorNama: k.tutor.nama as string,
    siswaNama: k.siswa.nama as string,
    jadwal: k.jadwal as string,
  }));
  const kelompokTelatMingguan = (kelompokMingguanRaw as any[]).map((k: any) => ({
    id: k.id as string,
    tutorNama: k.tutor.nama as string,
    nama: k.nama as string,
    jadwal: k.jadwal as string,
  }));

  const namaBulanBulanan = monthlyTarget
    ? new Date(monthlyTarget.tahun, monthlyTarget.bulan - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "";

  const weeklyLabel = `Minggu ke-${weeklyTarget.mingguKe} — ${new Date(weeklyTarget.tahun, weeklyTarget.bulan - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;

  // Import client dynamically to avoid circular? use direct
  const { NotifGroupClient } = await import("./notif-group-client");

  return (
    <NotifGroupClient
      siswa={siswa}
      kelasTelatBulanan={kelasTelatBulanan}
      kelompokTelatBulanan={kelompokTelatBulanan}
      kelasTelatMingguan={kelasTelatMingguan}
      kelompokTelatMingguan={kelompokTelatMingguan}
      isInMonthlyWindow={isInMonthlyWindow}
      namaBulanBulanan={namaBulanBulanan}
      weeklyLabel={weeklyLabel}
      mingguKe={weeklyTarget.mingguKe}
    />
  );
}
