const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

export function linkKwitansi(token: string) {
  return `${BASE_URL}/k/${token}`;
}

/** Ambil angka nomornya saja dari hasil waLink() */
export function nomorDariWaLink(url: string | null) {
  return url ? url.replace(/\D/g, "") : null;
}

export function waSendUrl(nomor: string, pesan: string) {
  return `https://web.whatsapp.com/send?phone=${nomor}&text=${encodeURIComponent(pesan)}`;
}

export function linkGabungan(tokens: string[]) {
  return `${BASE_URL}/k/gabungan?t=${tokens.join("-")}`;
}

type PesanInput = {
  namaPenerima?: string | null; // nama ortu / wali
  namaSiswa: string; // untuk kelompok: nama anggota digabung
  periode: string;
  total: number;
  lunas: boolean;
  link: string;
};

// ✏️ EDIT TEKS DI SINI
export function pesanKwitansi(p: PesanInput) {
  const sapaan = p.namaPenerima ? `Bapak/Ibu ${p.namaPenerima}` : "Bapak/Ibu";

  return [
    `Halo ${sapaan}, [GREETING PLACEHOLDER]`,
    "",
    `Berikut kwitansi & rekap belajar ${p.namaSiswa} periode ${p.periode}.`,
    `Total tagihan: Rp ${p.total.toLocaleString("id-ID")} (${p.lunas ? "Lunas" : "Belum Lunas"})`,
    "",
    "Link kwitansi:",
    p.link,
    "",
    p.lunas ? "[PENUTUP LUNAS PLACEHOLDER]" : "[PENUTUP BELUM LUNAS PLACEHOLDER]",
  ].join("\n");
}