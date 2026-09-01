"use client";

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
  kelasTelat,
  kelompokTelat,
  carryOver,
  carryLabel,
  isInWindow,
  namaBulan,
}: {
  siswa: SiswaItem[];
  kelasTelat: KelasTelat[];
  kelompokTelat: KelompokTelat[];
  carryOver: number;
  carryLabel: string;
  isInWindow: boolean;
  namaBulan: string;
}) {
  const [open, setOpen] = useState<"siswa" | "tutor" | "tagihan" | null>(null);

  const totalTutor = kelasTelat.length + kelompokTelat.length;
  const hasTagihan = carryOver > 0;
  const hasSiswa = siswa.length > 0;
  // tutor notif hanya relevan jika dalam window ATAU ada data
  const hasTutor = isInWindow ? totalTutor > 0 : false;
  // untuk tampilan summary, tetap hitung isInWindow
  const tutorCount = isInWindow ? totalTutor : 0;

  const hasAny = hasSiswa || hasTutor || hasTagihan;

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
            {/* Tagihan nyangkut */}
            <button
              onClick={() => hasTagihan && setOpen("tagihan")}
              disabled={!hasTagihan}
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                hasTagihan
                  ? "border-[#FFA70B]/30 bg-[#FFA70B]/10 hover:bg-[#FFA70B]/15 dark:bg-[#FFA70B]/10"
                  : "border-stroke bg-gray-1 opacity-60 dark:border-dark-3 dark:bg-dark-2"
              }`}
            >
              <span className="text-lg">💰</span>
              <span className={`mt-1 text-sm font-bold ${hasTagihan ? "text-[#FFA70B]" : "text-dark-6"}`}>
                {hasTagihan ? `Rp ${carryOver.toLocaleString("id-ID")}` : "Rp 0"}
              </span>
              <span className="text-xs font-medium text-dark dark:text-white">Tagihan Nyangkut</span>
              <span className="text-[11px] text-dark-6">
                {hasTagihan ? `Sebelum ${carryLabel}` : "Tidak ada tunggakan"}
              </span>
            </button>

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

            {/* Tutor belum kirim laporan */}
            <button
              onClick={() => hasTutor && setOpen("tutor")}
              disabled={!hasTutor}
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                hasTutor
                  ? "border-[#3B82F6]/20 bg-[#3B82F6]/5 hover:bg-[#3B82F6]/10 dark:bg-[#3B82F6]/10"
                  : "border-stroke bg-gray-1 opacity-60 dark:border-dark-3 dark:bg-dark-2"
              }`}
            >
              <span className="text-lg">⏰</span>
              <span className={`mt-1 text-sm font-bold ${hasTutor ? "text-[#3B82F6]" : "text-dark-6"}`}>{tutorCount}</span>
              <span className="text-xs font-medium text-dark dark:text-white">Tutor Telat Laporan</span>
              <span className="text-[11px] text-dark-6">
                {!isInWindow ? "Di luar jadwal notif" : hasTutor ? namaBulan : "Semua sudah lapor"}
              </span>
            </button>
          </div>
        )}

        <p className="mt-3 text-[11px] text-dark-6">Tekan kartu untuk lihat detail</p>
      </div>

      {/* Modal Tagihan */}
      <Modal open={open === "tagihan"} onClose={() => setOpen(null)} title={`Tagihan Nyangkut — Sebelum ${carryLabel}`}>
        <p className="mb-3 text-sm text-dark-6">
          Total <b className="text-dark dark:text-white">Rp {carryOver.toLocaleString("id-ID")}</b> dari periode sebelum {carryLabel} yang belum lunas.
        </p>
        <p className="text-xs text-dark-6">Detail per laporan bisa dilihat di halaman Rekap dengan filter periode &lt; {carryLabel}.</p>
      </Modal>

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

      {/* Modal Tutor */}
      <Modal open={open === "tutor"} onClose={() => setOpen(null)} title={`${totalTutor} Kelas Belum Kirim Laporan — ${namaBulan}`}>
        <div className="space-y-3">
          {kelasTelat.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-dark-6">Kelas Privat</p>
              <ul className="space-y-1.5">
                {kelasTelat.map((k) => (
                  <li key={k.id} className="rounded-lg border border-stroke px-3 py-2 text-sm dark:border-dark-3">
                    <span className="font-medium text-dark dark:text-white">{k.tutorNama}</span>
                    <span className="text-dark-6"> — {k.siswaNama}</span>
                    <span className="ml-1 text-xs text-dark-6">({k.jadwal})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {kelompokTelat.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-dark-6">Kelompok</p>
              <ul className="space-y-1.5">
                {kelompokTelat.map((k) => (
                  <li key={k.id} className="rounded-lg border border-stroke px-3 py-2 text-sm dark:border-dark-3">
                    <span className="font-medium text-dark dark:text-white">{k.tutorNama}</span>
                    <span className="text-dark-6"> — {k.nama}</span>
                    <span className="ml-1 text-xs text-dark-6">({k.jadwal})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
