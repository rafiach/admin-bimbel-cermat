export type Pengaturan = {
  feeIzinOrtu: number;
  feeIzinTutor: number;
  infoPembayaran: string;
  templatePesanBelumLunas: string;
  templatePesanLunas: string;
  namaBimbel: string;
  subjudulPrivat: string;
  subjudulKelompok: string;
  penutupKwitansi: string;
};

export const PLACEHOLDER_INFO = [
  { key: "sapaan", arti: "Bapak/Ibu + nama ortu/wali" },
  { key: "nama_siswa", arti: "Nama siswa (kelompok: nama anggota digabung)" },
  { key: "periode", arti: "Contoh: Oktober 2026 — Minggu ke-2" },
  { key: "total", arti: "Total tagihan, contoh: Rp 300.000" },
  { key: "status", arti: "Lunas / Belum Lunas" },
  { key: "link", arti: "Link kwitansi" },
  { key: "info_pembayaran", arti: "Isi kolom Info Pembayaran" },
  { key: "nama_bimbel", arti: "Nama bimbel" },
] as const;

export const PENGATURAN_DEFAULT: Pengaturan = {
  feeIzinOrtu: 10000,
  feeIzinTutor: 10000,
  infoPembayaran: "[ISI INFO REKENING DI MENU PENGATURAN]",
  templatePesanBelumLunas: [
    "Halo {sapaan}, [GREETING PLACEHOLDER]",
    "",
    "Berikut kwitansi & rekap belajar {nama_siswa} periode {periode}.",
    "Total tagihan: {total} ({status})",
    "",
    "Link kwitansi:",
    "{link}",
    "",
    "Pembayaran dapat ditransfer ke:",
    "{info_pembayaran}",
    "",
    "[PENUTUP PLACEHOLDER]",
  ].join("\n"),
  templatePesanLunas: [
    "Halo {sapaan}, [GREETING PLACEHOLDER]",
    "",
    "Berikut kwitansi & rekap belajar {nama_siswa} periode {periode}.",
    "Total tagihan: {total} ({status})",
    "",
    "Link kwitansi:",
    "{link}",
    "",
    "[PENUTUP LUNAS PLACEHOLDER]",
  ].join("\n"),
  namaBimbel: "Bimbel Cermat",
  subjudulPrivat: "Kwitansi & Rekap Perkembangan Belajar",
  subjudulKelompok: "Kwitansi Kelompok",
  penutupKwitansi: "Terima kasih atas kepercayaannya — Bimbel Cermat",
};