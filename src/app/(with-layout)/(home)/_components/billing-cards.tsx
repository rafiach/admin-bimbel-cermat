import { db } from "@/lib/db";
import Link from "next/link";
import { StatCard } from "./stat-card";
import { MarginIcon, TagihanIcon } from "./icons";

export async function BillingCards({
  bulan,
  tahun,
}: {
  bulan: number;
  tahun: number;
}) {
  const [laporanBulanIni, laporanKelompokBulanIni, carryKelas, carryKelompok, allLaporanKelas, allLaporanKelompok] =
    await Promise.all([
      db.laporanBulanan.findMany({ where: { bulan, tahun }, include: { kelas: true } }),
      db.laporanKelompok.findMany({
        where: { bulan, tahun },
        include: { kelompok: { include: { anggota: true } }, anggotaLaporan: true },
      }),
      db.laporanBulanan.findMany({
        where: {
          statusBayarOrtu: { not: "lunas" },
          OR: [{ tahun: { lt: tahun } }, { tahun, bulan: { lt: bulan } }],
        },
        include: { kelas: true },
      }),
      db.laporanKelompok.findMany({
        where: {
          statusBayarOrtu: { not: "lunas" },
          OR: [{ tahun: { lt: tahun } }, { tahun, bulan: { lt: bulan } }],
        },
        include: { kelompok: { include: { anggota: true } }, anggotaLaporan: true },
      }),
      db.laporanBulanan.findMany({ include: { kelas: true } }),
      db.laporanKelompok.findMany({
        include: { kelompok: { include: { anggota: true } }, anggotaLaporan: true },
      }),
    ]);

  // Tagihan belum lunas periode terpilih
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

  // Margin periode terpilih
  const marginKelas = laporanBulanIni.reduce((sum, l) => sum + (l.jumlahHadir * l.kelas.biayaOrtu - l.jumlahHadir * l.kelas.feeTutor), 0);
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

  // Carry-over
  const carryKelasAmt = carryKelas.reduce((sum, l) => sum + l.jumlahHadir * l.kelas.biayaOrtu, 0);
  const carryKelompokAmt = carryKelompok.reduce((sum, l) => {
    const hargaKelompok = l.hargaKelompokFinal ?? l.kelompok.hargaKelompok;
    const totalKelompokBaris = l.jumlahKelompok * hargaKelompok;
    const totalIndividu = l.anggotaLaporan.reduce((s, a) => {
      const anggota = l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId);
      return s + a.jumlahIndividu * (anggota?.hargaPrivat ?? 0);
    }, 0);
    return sum + totalKelompokBaris + totalIndividu;
  }, 0);
  const carryOver = carryKelasAmt + carryKelompokAmt;

  // Margin total sepanjang waktu
  const marginAllKelas = allLaporanKelas.reduce((sum, l) => sum + (l.jumlahHadir * l.kelas.biayaOrtu - l.jumlahHadir * l.kelas.feeTutor), 0);
  const marginAllKelompok = allLaporanKelompok.reduce((sum, l) => {
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
  const totalMarginAll = marginAllKelas + marginAllKelompok;

  const bulanLabel = new Date(tahun, bulan - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <StatCard
          label={`Tagihan Belum Lunas — ${bulanLabel}`}
          value={`Rp ${belumLunas.toLocaleString("id-ID")}`}
          icon={<TagihanIcon className="h-6 w-6" />}
          className="flex-1"
        />
        <StatCard
          label={`Margin Bimbel — ${bulanLabel}`}
          value={`Rp ${totalMargin.toLocaleString("id-ID")}`}
          icon={<MarginIcon className="h-6 w-6" />}
          className="flex-1"
        />
      </div>
    </div>
  );
}
