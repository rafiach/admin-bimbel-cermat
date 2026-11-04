export const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

export const FEE_IZIN = 10000;

export function labelPeriode(bulan: number, tahun: number, mingguKe: number) {
  return `${BULAN[bulan - 1]} ${tahun}${mingguKe > 0 ? ` — Minggu ke-${mingguKe}` : ""}`;
}

export function tagihanPrivat(jumlahHadir: number, jumlahIzin: number, biayaOrtu: number) {
  return jumlahHadir * biayaOrtu + jumlahIzin * FEE_IZIN;
}

export function hitungKelompok(l: {
  jumlahKelompok: number;
  jumlahIzin: number;
  hargaKelompokFinal: number | null;
  kelompok: { hargaKelompok: number; anggota: { siswaId: string; hargaPrivat: number }[] };
  anggotaLaporan: { siswaId: string; jumlahIndividu: number; siswa: { nama: string } }[];
}) {
  const hargaKelompok = l.hargaKelompokFinal ?? l.kelompok.hargaKelompok;
  const subtotalKelompok = l.jumlahKelompok * hargaKelompok;
  const feeIzin = l.jumlahIzin * FEE_IZIN;

  const barisIndividu = l.anggotaLaporan
    .filter((a) => a.jumlahIndividu > 0)
    .map((a) => {
      const harga = l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId)?.hargaPrivat ?? 0;
      return { nama: a.siswa.nama, jumlah: a.jumlahIndividu, harga, subtotal: a.jumlahIndividu * harga };
    });

  const totalTagihan =
    subtotalKelompok + feeIzin + barisIndividu.reduce((sum, b) => sum + b.subtotal, 0);

  return { hargaKelompok, subtotalKelompok, feeIzin, barisIndividu, totalTagihan };
}

type RekapFields = {
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
};

export type BarisKwitansi = { key: string; label: string; jumlah: number; hargaSatuan: number };

export type ItemGabunganPrivat = RekapFields & {
  id: string;
  shareToken: string;
  tutorNama: string;
  mingguKe: number;
  jumlahHadir: number;
  jumlahIzin: number;
  biayaOrtu: number;
  statusBayarOrtu: string;
  createdAt: string;
};

export type ItemGabunganKelompok = RekapFields & {
  id: string;
  shareToken: string;
  mingguKe: number;
  statusBayarOrtu: string;
  lines: BarisKwitansi[];
  createdAt: string;
};

export function totalGabunganPrivat(
  items: { jumlahHadir: number; jumlahIzin: number; biayaOrtu: number }[],
) {
  return items.reduce((s, i) => s + tagihanPrivat(i.jumlahHadir, i.jumlahIzin, i.biayaOrtu), 0);
}

export function totalBaris(lines: BarisKwitansi[]) {
  return lines.reduce((s, l) => s + l.jumlah * l.hargaSatuan, 0);
}

export function barisKelompok(l: {
  id: string;
  mingguKe: number;
  jumlahKelompok: number;
  jumlahIzin: number;
  hargaKelompokFinal: number | null;
  kelompok: { hargaKelompok: number; anggota: { siswaId: string; hargaPrivat: number }[] };
  anggotaLaporan: { siswaId: string; jumlahIndividu: number; siswa: { nama: string } }[];
}): BarisKwitansi[] {
  const periode = l.mingguKe > 0 ? `Minggu ke-${l.mingguKe}` : "Bulanan";
  const hargaKelompok = l.hargaKelompokFinal ?? l.kelompok.hargaKelompok;

  return [
    { key: `${l.id}-kelompok`, label: `Kelompok — ${periode}`, jumlah: l.jumlahKelompok, hargaSatuan: hargaKelompok },
    ...(l.jumlahIzin > 0
      ? [{ key: `${l.id}-izin`, label: `Izin Mendadak — ${periode}`, jumlah: l.jumlahIzin, hargaSatuan: FEE_IZIN }]
      : []),
    ...l.anggotaLaporan
      .filter((a) => a.jumlahIndividu > 0)
      .map((a) => ({
        key: `${l.id}-${a.siswaId}`,
        label: `${a.siswa.nama} (individu) — ${periode}`,
        jumlah: a.jumlahIndividu,
        hargaSatuan: l.kelompok.anggota.find((ag) => ag.siswaId === a.siswaId)?.hargaPrivat ?? 0,
      })),
  ];
}

export function toItemPrivat(
  l: RekapFields & {
    id: string;
    shareToken: string;
    mingguKe: number;
    jumlahHadir: number;
    jumlahIzin: number;
    statusBayarOrtu: string;
    createdAt: Date;
    kelas: { biayaOrtu: number; tutor: { nama: string } };
  },
): ItemGabunganPrivat {
  return {
    id: l.id,
    shareToken: l.shareToken,
    tutorNama: l.kelas.tutor.nama,
    mingguKe: l.mingguKe,
    jumlahHadir: l.jumlahHadir,
    jumlahIzin: l.jumlahIzin,
    biayaOrtu: l.kelas.biayaOrtu,
    statusBayarOrtu: l.statusBayarOrtu,
    materiDipelajari: l.materiDipelajari,
    pemahamanMateri: l.pemahamanMateri,
    keaktifanBelajar: l.keaktifanBelajar,
    kemandirian: l.kemandirian,
    kedisiplinan: l.kedisiplinan,
    catatanSiswa: l.catatanSiswa,
    createdAt: l.createdAt.toISOString(),
  };
}

export function toItemKelompok(
  l: RekapFields &
    Parameters<typeof barisKelompok>[0] & {
      shareToken: string;
      statusBayarOrtu: string;
      createdAt: Date;
    },
): ItemGabunganKelompok {
  return {
    id: l.id,
    shareToken: l.shareToken,
    mingguKe: l.mingguKe,
    statusBayarOrtu: l.statusBayarOrtu,
    lines: barisKelompok(l),
    materiDipelajari: l.materiDipelajari,
    pemahamanMateri: l.pemahamanMateri,
    keaktifanBelajar: l.keaktifanBelajar,
    kemandirian: l.kemandirian,
    kedisiplinan: l.kedisiplinan,
    catatanSiswa: l.catatanSiswa,
    createdAt: l.createdAt.toISOString(),
  };
}