import { db } from "@/lib/db";
import { StatCard } from "./stat-card";
import { KelasIcon, KelompokIcon, SiswaIcon, TutorIcon } from "./icons";

export async function DashboardStats() {
  const [totalSiswa, totalTutor, totalKelas, totalKelompok] = await Promise.all([
    db.siswa.count({ where: { status: "aktif" } }),
    db.tutor.count({ where: { status: "aktif" } }),
    db.kelas.count({ where: { status: "aktif" } }),
    db.kelompok.count({ where: { status: "aktif" } }),
  ]);

  return (
    <div className="grid h-full grid-cols-2 gap-4">
      <StatCard label="Siswa Aktif" value={String(totalSiswa)} icon={<SiswaIcon className="h-6 w-6" />} />
      <StatCard label="Tutor Aktif" value={String(totalTutor)} icon={<TutorIcon className="h-6 w-6" />} />
      <StatCard label="Kelas Aktif" value={String(totalKelas)} icon={<KelasIcon className="h-6 w-6" />} />
      <StatCard label="Kelompok Aktif" value={String(totalKelompok)} icon={<KelompokIcon className="h-6 w-6" />} />
    </div>
  );
}