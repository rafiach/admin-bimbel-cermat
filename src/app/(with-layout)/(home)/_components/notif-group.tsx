import { db } from "@/lib/db";
import { NotifGroupClient } from "./notif-group-client";

function getTargetPeriod(now: Date): { bulan: number; tahun: number } | null {
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

export async function NotifGroup({ bulan, tahun }: { bulan: number; tahun: number }) {
  const target = getTargetPeriod(new Date());
  const isInWindow = !!target;

  // query siswa tanpa tutor & tutor telat (window) + carryOver (filter periode)
  const siswaPromise = db.siswa.findMany({
    where: { status: "nonaktif", kelasList: { none: {} } },
    orderBy: { createdAt: "desc" },
    select: { id: true, nama: true },
  });

  const tutorPromise = target
    ? Promise.all([
        db.kelas.findMany({
          where: { status: "aktif", laporan: { none: { bulan: target.bulan, tahun: target.tahun } } },
          include: { tutor: true, siswa: true },
          orderBy: { tutor: { nama: "asc" } },
        }),
        db.kelompok.findMany({
          where: { status: "aktif", laporan: { none: { bulan: target.bulan, tahun: target.tahun } } },
          include: { tutor: true },
          orderBy: { tutor: { nama: "asc" } },
        }),
      ])
    : Promise.resolve([[], []] as const);

  const carryKelasPromise = db.laporanBulanan.findMany({
    where: { statusBayarOrtu: { not: "lunas" }, OR: [{ tahun: { lt: tahun } }, { tahun, bulan: { lt: bulan } }] },
    include: { kelas: true },
  });
  const carryKelompokPromise = db.laporanKelompok.findMany({
    where: { statusBayarOrtu: { not: "lunas" }, OR: [{ tahun: { lt: tahun } }, { tahun, bulan: { lt: bulan } }] },
    include: { kelompok: { include: { anggota: true } }, anggotaLaporan: true },
  });

  const [siswa, tutorRes, carryKelas, carryKelompok] = await Promise.all([
    siswaPromise,
    tutorPromise,
    carryKelasPromise,
    carryKelompokPromise,
  ]);
  const [kelasTelatRaw, kelompokTelatRaw] = tutorRes as [any[], any[]];

  // sederhanakan payload untuk client
  const kelasTelat = (kelasTelatRaw as any[]).map((k: any) => ({
    id: k.id as string,
    tutorNama: k.tutor.nama as string,
    siswaNama: k.siswa.nama as string,
    jadwal: k.jadwal as string,
  }));
  const kelompokTelat = (kelompokTelatRaw as any[]).map((k: any) => ({
    id: k.id as string,
    tutorNama: k.tutor.nama as string,
    nama: k.nama as string,
    jadwal: k.jadwal as string,
  }));

  const carryKelasAmt = carryKelas.reduce((sum, l) => sum + l.jumlahHadir * l.kelas.biayaOrtu, 0);
  const carryKelompokAmt = carryKelompok.reduce((sum, l) => {
    const hargaKelompok = (l as any).hargaKelompokFinal ?? (l as any).kelompok.hargaKelompok;
    const totalKelompokBaris = (l as any).jumlahKelompok * hargaKelompok;
    const totalIndividu = (l as any).anggotaLaporan.reduce((s: number, a: any) => {
      const anggota = (l as any).kelompok.anggota.find((ag: any) => ag.siswaId === a.siswaId);
      return s + a.jumlahIndividu * (anggota?.hargaPrivat ?? 0);
    }, 0);
    return sum + totalKelompokBaris + totalIndividu;
  }, 0);
  const carryOver = carryKelasAmt + carryKelompokAmt;

  const carryLabel = new Date(tahun, bulan - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const namaBulan = target
    ? new Date(target.tahun, target.bulan - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "";

  return (
    <NotifGroupClient
      siswa={siswa}
      kelasTelat={kelasTelat}
      kelompokTelat={kelompokTelat}
      carryOver={carryOver}
      carryLabel={carryLabel}
      isInWindow={isInWindow}
      namaBulan={namaBulan}
    />
  );
}
