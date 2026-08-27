import { db } from "@/lib/db";
import { StatCard } from "./stat-card";
import { KelasIcon, KelompokIcon, MarginIcon, SiswaIcon, TagihanIcon, TutorIcon } from "./icons";

export async function DashboardStats() {
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const [totalSiswa, totalTutor, totalKelas, totalKelompok, laporanBulanIni, laporanKelompokBulanIni] =
    await Promise.all([
      db.siswa.count({ where: { status: "aktif" } }),
      db.tutor.count({ where: { status: "aktif" } }),
      db.kelas.count({ where: { status: "aktif" } }),
      db.kelompok.count({ where: { status: "aktif" } }),
      db.laporanBulanan.findMany({ where: { bulan, tahun }, include: { kelas: true } }),
      db.laporanKelompok.findMany({
        where: { bulan, tahun },
        include: { kelompok: { include: { anggota: true } }, anggotaLaporan: true },
      }),
    ]);

  // Tagihan belum lunas (gabungan)
  const belumLunasKelas = laporanBulanIni
    .filter((l) => l.statusBayarOrtu !== "lunas")
    .reduce((sum, l) => sum + l.jumlahHadir * l.kelas.biayaOrtu, 0);

  const belumLunasKelompok = laporanKelompokBulanIni
    .filter((l) => l.statusBayarOrtu !== "lunas")
    .reduce((sum, l) => {
      const hargaKelompok = l.hargaKelompokFinal ?? l.kelompok.hargaKelompok;
      const totalKelompokBaris = l.jumlahKelompok * hargaKelompok;
      const totalIndividu = l.anggotaLaporan.reduce((s, a) => {
        const anggota = l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
        return s + a.jumlahIndividu * (anggota?.hargaPrivat ?? 0);
      }, 0);
      return sum + totalKelompokBaris + totalIndividu;
    }, 0);

  const belumLunas = belumLunasKelas + belumLunasKelompok;

  // Margin (tagihan ortu - fee tutor), gabungan, gak peduli status bayar
  const marginKelas = laporanBulanIni.reduce((sum, l) => {
    const tagihan = l.jumlahHadir * l.kelas.biayaOrtu;
    const feeTutor = l.jumlahHadir * l.kelas.feeTutor;
    return sum + (tagihan - feeTutor);
  }, 0);

  const marginKelompok = laporanKelompokBulanIni.reduce((sum, l) => {
    const hargaKelompok = l.hargaKelompokFinal ?? l.kelompok.hargaKelompok;
    const tagihanKelompok = l.jumlahKelompok * hargaKelompok;
    const feeTutorKelompok = l.jumlahKelompok * l.kelompok.feeTutorKelompok;

    const { tagihanIndividu, feeTutorIndividu } = l.anggotaLaporan.reduce(
      (acc, a) => {
        const anggota = l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
        return {
          tagihanIndividu: acc.tagihanIndividu + a.jumlahIndividu * (anggota?.hargaPrivat ?? 0),
          feeTutorIndividu: acc.feeTutorIndividu + a.jumlahIndividu * (anggota?.feeTutor ?? 0),
        };
      },
      { tagihanIndividu: 0, feeTutorIndividu: 0 },
    );

    return sum + (tagihanKelompok - feeTutorKelompok) + (tagihanIndividu - feeTutorIndividu);
  }, 0);

  const totalMargin = marginKelas + marginKelompok;

    return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Siswa Aktif" value={String(totalSiswa)} icon={<SiswaIcon className="h-6 w-6" />} />
        <StatCard label="Tutor Aktif" value={String(totalTutor)} icon={<TutorIcon className="h-6 w-6" />} />
        <StatCard label="Kelas Aktif" value={String(totalKelas)} icon={<KelasIcon className="h-6 w-6" />} />
        <StatCard label="Kelompok Aktif" value={String(totalKelompok)} icon={<KelompokIcon className="h-6 w-6" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Tagihan Belum Lunas (Bulan Ini)"
          value={`Rp ${belumLunas.toLocaleString("id-ID")}`}
          icon={<TagihanIcon className="h-6 w-6" />}
        />
        <StatCard
          label="Margin Bimbel (Bulan Ini)"
          value={`Rp ${totalMargin.toLocaleString("id-ID")}`}
          icon={<MarginIcon className="h-6 w-6" />}
        />
      </div>
    </div>
  );
}