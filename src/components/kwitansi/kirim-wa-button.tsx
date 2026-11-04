import { waSendUrl } from "@/lib/wa-kwitansi";

export function KirimWAButton({
  nomor,
  pesan,
}: {
  nomor: string | null;
  pesan: string;
}) {
  if (!nomor) {
    return (
      <span
        title="No HP belum diisi di data siswa/kelompok"
        className="cursor-not-allowed rounded-lg bg-gray-3 px-4 py-2 text-sm font-medium text-dark-6"
      >
        No HP belum diisi
      </span>
    );
  }

  return (
    <a
      href={waSendUrl(nomor, pesan)}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
    >
      Kirim ke WhatsApp
    </a>
  );
}