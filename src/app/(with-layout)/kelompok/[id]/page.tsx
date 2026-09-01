import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { formatPhoneDisplay, waLink } from "@/lib/phone";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

export const metadata = { title: "Detail Kelompok" };

const BULAN = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

export default async function DetailKelompokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kelompok = await db.kelompok.findUnique({
    where: { id },
    include: {
      tutor: true,
      anggota: { include: { siswa: true } },
      laporan: { orderBy: [{ tahun: "desc" }, { bulan: "desc" }, { mingguKe: "desc" }] },
    },
  });

  if (!kelompok) notFound();

  return (
    <>
      <Breadcrumb pageName="Detail Kelompok" />

      <div className="space-y-6">
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-dark dark:text-white">{kelompok.nama}</h3>
              <p className="mt-1 text-sm text-dark-6">
                {kelompok.jadwal} · {kelompok.anggota.length} anggota · Dibuat {new Date(kelompok.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/kelompok" className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white">
                Kembali
              </Link>
              <Link href={`/kelompok/${kelompok.id}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
                <Pencil size={16} /> Edit
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-sm text-dark-6">Tutor</p>
              <p className="font-medium text-dark dark:text-white">{kelompok.tutor.nama}</p>
              <p className="text-sm text-dark-6">{kelompok.tutor.jenjang || "-"} {kelompok.tutor.noHp ? `· ${kelompok.tutor.noHp}` : ""}</p>
            </div>
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-sm text-dark-6">Biaya & Fee Kelompok</p>
              <p className="font-medium text-dark dark:text-white">Tagihan: Rp {kelompok.hargaKelompok.toLocaleString("id-ID")}</p>
              <p className="font-medium text-dark dark:text-white">Fee Tutor: Rp {kelompok.feeTutorKelompok.toLocaleString("id-ID")}</p>
              <p className="mt-2"><span className={cn("rounded-full px-3 py-1 text-xs font-medium", kelompok.status === "aktif" ? "bg-[#219653]/10 text-[#219653]" : "bg-[#D34053]/10 text-[#D34053]")}>{kelompok.status}</span></p>
            </div>
            <div className="rounded-lg border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-sm text-dark-6">Wali Kelompok</p>
              <p className="font-medium text-dark dark:text-white">{kelompok.namaWali || "-"}</p>
              {kelompok.noHpWali ? (
                waLink(kelompok.noHpWali) ? (
                  <a href={waLink(kelompok.noHpWali)!} target="_blank" className="text-sm text-primary hover:underline">{formatPhoneDisplay(kelompok.noHpWali)}</a>
                ) : (
                  <p className="text-sm text-dark dark:text-white">{kelompok.noHpWali}</p>
                )
              ) : (
                <p className="text-sm text-dark-6">-</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><p className="text-sm text-dark-6">Jadwal</p><p className="font-medium text-dark dark:text-white">{kelompok.jadwal}</p></div>
            <div><p className="text-sm text-dark-6">ID</p><p className="font-mono text-xs text-dark-6">{kelompok.id}</p></div>
          </div>
        </div>

        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
          <h4 className="mb-3 font-medium text-dark dark:text-white">Anggota ({kelompok.anggota.length})</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke text-left text-dark-6">
                  <th className="py-2 font-medium">Siswa</th>
                  <th className="py-2 font-medium">Sekolah</th>
                  <th className="py-2 font-medium">Harga Privat</th>
                  <th className="py-2 font-medium">Fee Tutor Privat</th>
                </tr>
              </thead>
              <tbody>
                {kelompok.anggota.map((a) => (
                  <tr key={a.id} className="border-b border-stroke/50">
                    <td className="py-2.5 text-dark dark:text-white">{a.siswa.nama}</td>
                    <td className="py-2.5 text-dark dark:text-white">{a.siswa.sekolah || "-"} {a.siswa.kelas ? `· ${a.siswa.kelas}` : ""}</td>
                    <td className="py-2.5 text-dark dark:text-white">Rp {a.hargaPrivat.toLocaleString("id-ID")}</td>
                    <td className="py-2.5 text-dark dark:text-white">Rp {a.feeTutor.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-dark dark:text-white">Riwayat Laporan ({kelompok.laporan.length})</h4>
            <Link href={`/rekap-kelompok?kelompokId=${kelompok.id}`} className="text-sm text-primary hover:underline">Lihat Rekap</Link>
          </div>
          {kelompok.laporan.length === 0 ? (
            <p className="py-6 text-center text-sm text-dark-6">Belum ada laporan untuk kelompok ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stroke text-left text-dark-6">
                    <th className="py-2 font-medium">Periode</th>
                    <th className="py-2 font-medium">Had Kelompok</th>
                    <th className="py-2 font-medium">Izin</th>
                    <th className="py-2 font-medium">Status Bayar</th>
                    <th className="py-2 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kelompok.laporan.map((l) => (
                    <tr key={l.id} className="border-b border-stroke/50">
                      <td className="py-2.5 text-dark dark:text-white">{BULAN[l.bulan - 1]} {l.tahun} {l.mingguKe > 0 ? `· Minggu ${l.mingguKe}` : ""}</td>
                      <td className="py-2.5 text-dark dark:text-white">{l.jumlahKelompok}x</td>
                      <td className="py-2.5 text-dark dark:text-white">{l.jumlahIzin}x</td>
                      <td className="py-2.5"><span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", l.statusBayarOrtu === "lunas" ? "bg-[#219653]/10 text-[#219653]" : "bg-[#D34053]/10 text-[#D34053]")}>{l.statusBayarOrtu}</span></td>
                      <td className="py-2.5 text-right"><Link href={`/rekap-kelompok/${l.id}`} className="text-primary hover:underline">Detail</Link></td>
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
