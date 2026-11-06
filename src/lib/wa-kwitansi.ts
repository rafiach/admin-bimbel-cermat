import type { Pengaturan } from "@/lib/pengaturan-default";

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

export function linkKwitansi(token: string) {
  return `${BASE_URL}/k/${token}`;
}

export function linkGabungan(tokens: string[]) {
  return `${BASE_URL}/k/gabungan?t=${tokens.join("-")}`;
}

/** Ambil angka nomornya saja dari hasil waLink() */
export function nomorDariWaLink(url: string | null) {
  return url ? url.replace(/\D/g, "") : null;
}

export function waSendUrl(nomor: string, pesan: string) {
  return `https://web.whatsapp.com/send?phone=${nomor}&text=${encodeURIComponent(pesan)}`;
}

/** Ganti {placeholder}. Placeholder yang tidak dikenal dibiarkan apa adanya. */
export function renderTemplate(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

type PesanInput = {
  namaPenerima?: string | null; // nama ortu / wali
  namaSiswa: string; // kelompok: nama anggota digabung
  periode: string;
  total: number;
  lunas: boolean;
  link: string;
};

export function pesanKwitansi(p: PesanInput, cfg: Pengaturan) {
  const tpl = p.lunas ? cfg.templatePesanLunas : cfg.templatePesanBelumLunas;

  return renderTemplate(tpl, {
    sapaan: p.namaPenerima ? `Bapak/Ibu ${p.namaPenerima}` : "Bapak/Ibu",
    nama_siswa: p.namaSiswa,
    periode: p.periode,
    total: `Rp ${p.total.toLocaleString("id-ID")}`,
    status: p.lunas ? "Lunas" : "Belum Lunas",
    link: p.link,
    info_pembayaran: cfg.infoPembayaran,
    nama_bimbel: cfg.namaBimbel,
  });
}