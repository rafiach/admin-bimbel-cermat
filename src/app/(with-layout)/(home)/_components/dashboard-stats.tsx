import { db } from "@/lib/db";
import { StatCard } from "./stat-card";
import { KelasIcon, SiswaIcon, TagihanIcon, TutorIcon } from "./icons";

export async function DashboardStats() {
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const [totalSiswa, totalTutor, totalKelas, laporanBulanIni] = await Promise.all([
    db.siswa.count({ where: { status: "aktif" } }),
    db.tutor.count({ where: { status: "aktif" } }),
    db.kelas.count({ where: { status: "aktif" } }),
    db.laporanBulanan.findMany({ where: { bulan, tahun }, include: { kelas: true } }),
  ]);

  const belumLunas = laporanBulanIni
    .filter((l) => l.statusBayarOrtu !== "lunas")
    .reduce((sum, l) => sum + l.jumlahHadir * l.kelas.biayaOrtu, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Siswa Aktif" value={String(totalSiswa)} icon={<SiswaIcon className="h-6 w-6" />} />
      <StatCard label="Tutor Aktif" value={String(totalTutor)} icon={<TutorIcon className="h-6 w-6" />} />
      <StatCard label="Kelas Aktif" value={String(totalKelas)} icon={<KelasIcon className="h-6 w-6" />} />
      <StatCard label="Tagihan Belum Lunas (Bulan Ini)" value={`Rp ${belumLunas.toLocaleString("id-ID")}`} icon={<TagihanIcon className="h-6 w-6" />} />
    </div>
  );
}