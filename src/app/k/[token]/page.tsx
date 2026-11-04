import { DownloadButton } from "@/app/(with-layout)/rekap/_component/download-button";
import { KwitansiKelompok } from "@/components/kwitansi/kwitansi-kelompok";
import { KwitansiPrivat } from "@/components/kwitansi/kwitansi-privat";
import { db } from "@/lib/db";
import { BULAN, hitungKelompok, tagihanPrivat } from "@/lib/kwitansi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";

const getKwitansi = cache(async (token: string) => {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;

  const privat = await db.laporanBulanan.findUnique({
    where: { shareToken: token },
    include: { kelas: { include: { siswa: true, tutor: true } } },
  });
  if (privat) return { tipe: "privat" as const, laporan: privat };

  const kelompok = await db.laporanKelompok.findUnique({
    where: { shareToken: token },
    include: {
      kelompok: { include: { tutor: true, anggota: { include: { siswa: true } } } },
      anggotaLaporan: { include: { siswa: true } },
    },
  });
  if (kelompok) return { tipe: "kelompok" as const, laporan: kelompok };

  return null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const data = await getKwitansi(token);
  const noIndex = { index: false, follow: false };

  if (!data) return { title: { absolute: "Kwitansi tidak ditemukan" }, robots: noIndex };

  const l = data.laporan;
  const nama = data.tipe === "privat" ? data.laporan.kelas.siswa.nama : data.laporan.kelompok.nama;
  const total =
    data.tipe === "privat"
      ? tagihanPrivat(data.laporan.jumlahHadir, data.laporan.jumlahIzin, data.laporan.kelas.biayaOrtu)
      : hitungKelompok(data.laporan).totalTagihan;

  const title = `Kwitansi Bimbel Cermat — ${nama}, ${BULAN[l.bulan - 1]} ${l.tahun}`;
  const description = `Total tagihan Rp ${total.toLocaleString("id-ID")} · ${
    l.statusBayarOrtu === "lunas" ? "Lunas" : "Belum Lunas"
  }`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    title: { absolute: title },
    description,
    robots: noIndex,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/images/logo/logo-icon-bimbel.png"],
    },
  };
}

export default async function KwitansiPublikPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getKwitansi(token);
  if (!data) notFound();

  const l = data.laporan;
  const nama = data.tipe === "privat" ? data.laporan.kelas.siswa.nama : data.laporan.kelompok.nama;

  return (
    <main className="min-h-screen bg-gray-2 px-4 py-6">
      <div className="mx-auto mb-4 flex max-w-2xl justify-end">
        <DownloadButton filename={`kwitansi-${nama}-${BULAN[l.bulan - 1]}-${l.tahun}`} />
      </div>

      {data.tipe === "privat" ? (
        <KwitansiPrivat laporan={data.laporan} />
      ) : (
        <KwitansiKelompok laporan={data.laporan} />
      )}
    </main>
  );
}