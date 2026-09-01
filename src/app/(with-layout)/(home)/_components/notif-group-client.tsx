"use client";

import Link from "next/link";
import { useState } from "react";

type SiswaItem = { id: string; nama: string };
type KelasTelat = { id: string; tutorNama: string; siswaNama: string; jadwal: string };
type KelompokTelat = { id: string; tutorNama: string; nama: string; jadwal: string };

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-dark">
        <div className="flex items-center justify-between border-b border-stroke p-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-dark-6 hover:bg-gray-2 dark:hover:bg-dark-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export function NotifGroupClient({
  siswa,
  kelasTelatBulanan,
  kelompokTelatBulanan,
  kelasTelatMingguan,
  kelompokTelatMingguan,
  isInMonthlyWindow,
  namaBulanBulanan,
  weeklyLabel,
  mingguKe,
}: {
  siswa: SiswaItem[];
  kelasTelatBulanan: KelasTelat[];
  kelompokTelatBulanan: KelompokTelat[];
  kelasTelatMingguan: KelasTelat[];
  kelompokTelatMingguan: KelompokTelat[];
  isInMonthlyWindow: boolean;
  namaBulanBulanan: string;
  weeklyLabel: string;
  mingguKe: number;
}) {
  const [open, setOpen] = useState<"siswa" | "bulanan" | "mingguan" | null>(null);

  const totalBulanan = kelasTelatBulanan.length + kelompokTelatBulanan.length;
  const totalMingguan = kelasTelatMingguan.length + kelompokTelatMingguan.length;
  const hasSiswa = siswa.length > 0;
  const hasBulanan = isInMonthlyWindow ? totalBulanan > 0 : false;
  const hasMingguan = totalMingguan > 0;
  const bulananCount = isInMonthlyWindow ? totalBulanan : 0;

  const hasAny = hasSiswa || hasBulanan || hasMingguan;

  return (
    <>
      <div className="flex h-full flex-col rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <h4 className="mb-3 font-medium text-dark dark:text-white">Notifikasi</h4>

        {!hasAny ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-stroke p-6 text-sm text-dark-6 dark:border-dark-3">
            ✅ Tidak ada notifikasi — semua aman
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Siswa belum dapat tutor */}
            <button
              onClick={() => hasSiswa && setOpen("siswa")}
              disabled={!hasSiswa}
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                hasSiswa
                  ? "border-[#E53935]/20 bg-[#E53935]/5 hover:bg-[#E53935]/10 dark:bg-[#E53935]/10"
                  : "border-stroke bg-gray-1 opacity-60 dark:border-dark-3 dark:bg-dark-2"
              }`}
            >
              <span className="text-lg">🏫</span>
              <span className={`mt-1 text-sm font-bold ${hasSiswa ? "text-[#E53935]" : "text-dark-6"}`}>{siswa.length}</span>
              <span className="text-xs font-medium text-dark dark:text-white">Siswa Tanpa Tutor</span>
              <span className="text-[11px] text-dark-6">{hasSiswa ? "Belum dapat kelas" : "Semua sudah ada tutor"}</span>
            </button>

            {/* Tutor telat bulanan — window 3 hari sebelum akhir bulan & 7 hari setelah */}
            <button
              onClick={() => hasBulanan && setOpen("bulanan")}
              disabled={!hasBulanan}
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                hasBulanan
                  ? "border-[#3B82F6]/20 bg-[#3B82F6]/5 hover:bg-[#3B82F6]/10 dark:bg-[#3B82F6]/10"
                  : "border-stroke bg-gray-1 opacity-60 dark:border-dark-3 dark:bg-dark-2"
              }`}
            >
              <span className="text-lg">📅</span>
              <span className={`mt-1 text-sm font-bold ${hasBulanan ? "text-[#3B82F6]" : "text-dark-6"}`}>{bulananCount}</span>
              <span className="text-xs font-medium text-dark dark:text-white">Tutor belum kirim Laporan Bulanan</span>
              <span className="text-[11px] text-dark-6">
                {!isInMonthlyWindow ? "Di luar jadwal notif" : hasBulanan ? namaBulanBulanan : "Semua sudah lapor"}
              </span>
            </button>

            {/* Tutor telat mingguan — reset tiap Senin */}
            <button
              onClick={() => hasMingguan && setOpen("mingguan")}
              disabled={!hasMingguan}
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                hasMingguan
                  ? "border-[#8B5CF6]/20 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/10"
                  : "border-stroke bg-gray-1 opacity-60 dark:border-dark-3 dark:bg-dark-2"
              }`}
            >
              <span className="text-lg">⏰</span>
              <span className={`mt-1 text-sm font-bold ${hasMingguan ? "text-[#8B5CF6]" : "text-dark-6"}`}>{totalMingguan}</span>
              <span className="text-xs font-medium text-dark dark:text-white">Tutor belum kirim Laporan Mingguan</span>
              <span className="text-[11px] text-dark-6">
                {hasMingguan ? weeklyLabel : `Minggu ke-${mingguKe} aman`}
              </span>
            </button>
          </div>
        )}

        <p className="mt-3 text-[11px] text-dark-6">Tekan kartu untuk lihat detail · Bulanan: 3 hari akhir bulan & 7 hari awal bulan · Mingguan: reset Senin</p>
      </div>

      {/* Modal Siswa */}
      <Modal open={open === "siswa"} onClose={() => setOpen(null)} title={`${siswa.length} Siswa Belum Dapat Tutor`}>
        <ul className="space-y-2">
          {siswa.map((s) => (
            <li key={s.id} className="rounded-lg border border-stroke px-3 py-2 text-sm text-dark dark:border-dark-3 dark:text-white">
              {s.nama}
            </li>
          ))}
        </ul>
      </Modal>

      {/* Modal Bulanan */}
      <Modal open={open === "bulanan"} onClose={() => setOpen(null)} title={`${totalBulanan} Kelas Belum Kirim Laporan Bulanan — ${namaBulanBulanan}`}>
        <p className="mb-3 text-xs text-dark-6">Periode bulanan: notif aktif 3 hari sebelum akhir bulan & 7 hari setelah akhir bulan.</p>
        <div className="space-y-3">
          {kelasTelatBulanan.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-dark-6">Kelas Privat</p>
              <ul className="space-y-1.5">
                {kelasTelatBulanan.map((k) => (
                  <li key={k.id}>
                    <Link
                      href={`/kelas/${k.id}`}
                      onClick={() => setOpen(null)}
                      className="block rounded-lg border border-stroke px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:hover:bg-dark-2"
                    >
                      <span className="font-medium text-dark dark:text-white">{k.tutorNama}</span>
                      <span className="text-dark-6"> — {k.siswaNama}</span>
                      <span className="ml-1 text-xs text-dark-6">({k.jadwal})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {kelompokTelatBulanan.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-dark-6">Kelompok</p>
              <ul className="space-y-1.5">
                {kelompokTelatBulanan.map((k) => (
                  <li key={k.id}>
                    <Link
                      href={`/kelompok/${k.id}`}
                      onClick={() => setOpen(null)}
                      className="block rounded-lg border border-stroke px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:hover:bg-dark-2"
                    >
                      <span className="font-medium text-dark dark:text-white">{k.tutorNama}</span>
                      <span className="text-dark-6"> — {k.nama}</span>
                      <span className="ml-1 text-xs text-dark-6">({k.jadwal})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal Mingguan */}
      <Modal open={open === "mingguan"} onClose={() => setOpen(null)} title={`${totalMingguan} Kelas Belum Kirim Laporan Mingguan — ${weeklyLabel}`}>
        <p className="mb-3 text-xs text-dark-6">Periode mingguan: reset tiap Senin..</p>
        <div className="space-y-3">
          {kelasTelatMingguan.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-dark-6">Kelas Privat</p>
              <ul className="space-y-1.5">
                {kelasTelatMingguan.map((k) => (
                  <li key={k.id}>
                    <Link
                      href={`/kelas/${k.id}`}
                      onClick={() => setOpen(null)}
                      className="block rounded-lg border border-stroke px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:hover:bg-dark-2"
                    >
                      <span className="font-medium text-dark dark:text-white">{k.tutorNama}</span>
                      <span className="text-dark-6"> — {k.siswaNama}</span>
                      <span className="ml-1 text-xs text-dark-6">({k.jadwal})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {kelompokTelatMingguan.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-dark-6">Kelompok</p>
              <ul className="space-y-1.5">
                {kelompokTelatMingguan.map((k) => (
                  <li key={k.id}>
                    <Link
                      href={`/kelompok/${k.id}`}
                      onClick={() => setOpen(null)}
                      className="block rounded-lg border border-stroke px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:hover:bg-dark-2"
                    >
                      <span className="font-medium text-dark dark:text-white">{k.tutorNama}</span>
                      <span className="text-dark-6"> — {k.nama}</span>
                      <span className="ml-1 text-xs text-dark-6">({k.jadwal})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {totalMingguan === 0 && <p className="text-sm text-dark-6">Tidak ada kelas mingguan yang telat minggu ini. Kelas baru tanpa riwayat mingguan dihitung sebagai bulanan, jadi tidak muncul di sini sampai ada laporan mingguan pertamanya.</p>}
        </div>
      </Modal>
    </>
  );
}
