import { DownloadButton } from "@/app/(with-layout)/rekap/_component/download-button";
import { KwitansiGabunganKelompok, KwitansiGabunganPrivat } from "@/components/kwitansi/kwitansi-gabungan";
import { db } from "@/lib/db";
import {
  BULAN,
  toItemKelompok,
  toItemPrivat,
  totalBaris,
  totalGabunganPrivat,
} from "@/lib/kwitansi";
import { getPengaturan } from "@/lib/pengaturan";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";

const MAX_TOKEN = 12;
const cfg = await getPengaturan();

const getGabungan = cache(async (raw: string) => {
  const tokens = [...new Set(raw.split("-"))];
  if (tokens.length === 0 || tokens.length > MAX_TOKEN) return null;
  if (!tokens.every((t) => /^[a-f0-9]{64}$/.test(t))) return null;

  const privat = await db.laporanBulanan.findMany({
    where: { shareToken: { in: tokens } },
    include: { kelas: { include: { siswa: true, tutor: true } } },
    orderBy: { createdAt: "asc" },
  });
  if (privat.length > 0) {
    const f = privat[0];
    const sama = privat.every(
      (l) => l.kelas.siswaId === f.kelas.siswaId && l.bulan === f.bulan && l.tahun === f.tahun,
    );
    return sama ? { tipe: "privat" as const, laporan: privat } : null;
  }

  const kelompok = await db.laporanKelompok.findMany({
    where: { shareToken: { in: tokens } },
    include: {
      kelompok: { include: { tutor: true, anggota: { include: { siswa: true } } } },
      anggotaLaporan: { include: { siswa: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  if (kelompok.length > 0) {
    const f = kelompok[0];
    const sama = kelompok.every(
      (l) => l.kelompokId === f.kelompokId && l.bulan === f.bulan && l.tahun === f.tahun,
    );
    return sama ? { tipe: "kelompok" as const, laporan: kelompok } : null;
  }

  return null;
});

function ringkas(
  data: NonNullable<Awaited<ReturnType<typeof getGabungan>>>,
  hargaIzin: number,
) {
  const f = data.laporan[0];
  const periode = `${BULAN[f.bulan - 1]} ${f.tahun}`;

  if (data.tipe === "privat") {
    const items = data.laporan.map(toItemPrivat);
    return {
      nama: data.laporan[0].kelas.siswa.nama,
      periode,
      total: totalGabunganPrivat(items, hargaIzin),
      lunas: items.every((i) => i.statusBayarOrtu === "lunas"),
    };
  }

  const items = data.laporan.map((l) => toItemKelompok(l, hargaIzin));
  return {
    nama: data.laporan[0].kelompok.nama,
    periode,
    total: totalBaris(items.flatMap((i) => i.lines)),
    lunas: items.every((i) => i.statusBayarOrtu === "lunas"),
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}): Promise<Metadata> {
  const { t } = await searchParams;
  const data = await getGabungan(t ?? "");

  const noIndex = { index: false, follow: false };

  if (!data) return { title: { absolute: "Kwitansi tidak ditemukan" }, robots: noIndex };

  const r = ringkas(data, cfg.feeIzinOrtu);
  const title = `Kwitansi ${cfg.namaBimbel} — ${r.nama}, ${r.periode}`;
  const description = `Total tagihan Rp ${r.total.toLocaleString("id-ID")} · ${r.lunas ? "Lunas" : "Belum Lunas"}`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    title: { absolute: title },
    description,
    robots: noIndex,
    openGraph: { title, description, type: "website", images: ["/images/logo/og-bimbel.png"] },
  };
}

export default async function KwitansiGabunganPublikPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const data = await getGabungan(t ?? "");
  if (!data) notFound();

  const r = ringkas(data, cfg.feeIzinOrtu);

  return (
    <main className="min-h-screen bg-gray-2 px-4 py-6">
      <div className="mx-auto mb-4 flex max-w-2xl justify-end">
        <DownloadButton filename={`kwitansi-gabungan-${r.nama}-${r.periode}`} />
      </div>

      {data.tipe === "privat" ? (
        <KwitansiGabunganPrivat namaSiswa={r.nama} periodeLabel={r.periode} items={data.laporan.map(toItemPrivat)} cfg={cfg} />
      ) : (
        <KwitansiGabunganKelompok
          namaKelompok={r.nama}
          tutorNama={data.laporan[0].kelompok.tutor.nama}
          periodeLabel={r.periode}
          items={data.laporan.map((l) => toItemKelompok(l, cfg.feeIzinOrtu))}
          cfg={cfg}
        />
      )}
    </main>
  );
}