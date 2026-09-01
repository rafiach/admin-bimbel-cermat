import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

export const metadata = { title: "Detail Kelas" };

const BULAN = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

export default async function DetailKelasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kelas = await db.kelas.findUnique({
    where: { id },
    include: {
      siswa: true,
      tutor: true,
      laporan: { orderBy: [{ tahun: "desc" }, { bulan: "desc" }, { mingguKe: "desc" }] },
    },
  });

  if (!kelas) notFound();

  return (
    <>
      <Breadcrumb pageName="Detail Kelas" />

      <div className="space-y-6">
        {/* Header card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-dark dark:text-white">
                Kelas Privat — {kelas.siswa.nama}
              </h3>
              <p className="mt-1 text-sm text-dark-6">
                {kelas.tipe} · {kelas.jadwal} · Dibuat {new Date(kelas.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/kelas"
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white"
              >
                Kembali
              </Link>
              <Link
                href={`/kelas/${kelas.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <Pencil size={16} /> Edit
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-sm text-dark-6">Siswa</p>
              <p className="font-medium text-dark dark:text-white">{kelas.siswa.nama}</p>
              <p className="text-sm text-dark-6">{kelas.siswa.sekolah || "-"} {kelas.siswa.kelas ? `· ${kelas.siswa.kelas}` : ""}</p>
              {kelas.siswa.namaOrtu && <p className="mt-1 text-sm text-dark dark:text-white">Ortu: {kelas.siswa.namaOrtu} {kelas.siswa.noHpOrtu ? `· ${kelas.siswa.noHpOrtu}` : ""}</p>}
            </div>
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-sm text-dark-6">Tutor</p>
              <p className="font-medium text-dark dark:text-white">{kelas.tutor.nama}</p>
              <p className="text-sm text-dark-6">{kelas.tutor.jenjang || "-"} {kelas.tutor.noHp ? `· ${kelas.tutor.noHp}` : ""}</p>
              <p className="text-sm text-dark-6">{kelas.tutor.alamat || ""}</p>
            </div>
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-sm text-dark-6">Biaya & Fee (per pertemuan)</p>
              <p className="font-medium text-dark dark:text-white">Ortu: Rp {kelas.biayaOrtu.toLocaleString("id-ID")}</p>
              <p className="font-medium text-dark dark:text-white">Tutor: Rp {kelas.feeTutor.toLocaleString("id-ID")}</p>
              <p className="mt-2">
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", kelas.status === "aktif" ? "bg-[#219653]/10 text-[#219653]" : "bg-[#D34053]/10 text-[#D34053]")}>{kelas.status}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div><p className="text-sm text-dark-6">Jadwal</p><p className="font-medium text-dark dark:text-white">{kelas.jadwal}</p></div>
            <div><p className="text-sm text-dark-6">Tipe</p><p className="font-medium text-dark dark:text-white capitalize">{kelas.tipe}</p></div>
            <div><p className="text-sm text-dark-6">ID Kelas</p><p className="font-mono text-xs text-dark-6">{kelas.id}</p></div>
          </div>
        </div>

        {/* Laporan history */}
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-dark dark:text-white">Riwayat Laporan ({kelas.laporan.length})</h4>
            <Link href={`/rekap?kelasId=${kelas.id}`} className="text-sm text-primary hover:underline">Lihat Rekap</Link>
          </div>

          {kelas.laporan.length === 0 ? (
            <p className="py-6 text-center text-sm text-dark-6">Belum ada laporan untuk kelas ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stroke text-left text-dark-6">
                    <th className="py-2 font-medium">Periode</th>
                    <th className="py-2 font-medium">Hadir</th>
                    <th className="py-2 font-medium">Izin</th>
                    <th className="py-2 font-medium">Status Bayar</th>
                    <th className="py-2 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kelas.laporan.map((l) => (
                    <tr key={l.id} className="border-b border-stroke/50">
                      <td className="py-2.5 text-dark dark:text-white">
                        {BULAN[l.bulan - 1]} {l.tahun} {l.mingguKe > 0 ? `· Minggu ${l.mingguKe}` : ""}
                        <span className="ml-1 text-xs text-dark-6">({l.tipePeriode})</span>
                      </td>
                      <td className="py-2.5 text-dark dark:text-white">{l.jumlahHadir}x</td>
                      <td className="py-2.5 text-dark dark:text-white">{l.jumlahIzin}x</td>
                      <td className="py-2.5">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", l.statusBayarOrtu === "lunas" ? "bg-[#219653]/10 text-[#219653]" : "bg-[#D34053]/10 text-[#D34053]")}>
                          {l.statusBayarOrtu}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Link href={`/rekap/${l.id}`} className="text-primary hover:underline">Detail</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
