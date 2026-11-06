import {
  type ItemGabunganKelompok,
  type ItemGabunganPrivat,
  tagihanPrivat,
  totalBaris,
} from "@/lib/kwitansi";
import { Info, KwitansiFrame, RekapBelajar, TotalTagihan } from "./kwitansi-parts";
import { Pengaturan } from "@/lib/pengaturan-default";

function terbaru<T extends { createdAt: string }>(items: T[]) {
  return items.reduce((a, b) => (b.createdAt > a.createdAt ? b : a));
}

const judulRekap = (mingguKe: number) =>
  `Rekap Perkembangan Terbaru${mingguKe > 0 ? ` (Minggu ke-${mingguKe})` : ""}`;

export function KwitansiGabunganPrivat({
  namaSiswa,
  periodeLabel,
  items,
  cfg,
}: {
  namaSiswa: string;
  periodeLabel: string;
  items: ItemGabunganPrivat[];
  cfg: Pengaturan;
}) {
  if (items.length === 0) return null;

  const total = items.reduce(
    (s, i) => s + tagihanPrivat(i.jumlahHadir, i.jumlahIzin, i.biayaOrtu, cfg.feeIzinOrtu),
    0,
  );
  const lunas = items.every((i) => i.statusBayarOrtu === "lunas");
  const terakhir = terbaru(items);

  return (
    <KwitansiFrame subtitle= {cfg.subjudulPrivat} cfg={cfg}>
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F9FC] p-4 text-sm">
        <Info label="Nama Siswa" value={namaSiswa} />
        <Info label="Periode" value={periodeLabel} />
      </div>

      <table className="mb-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-stroke text-left">
            <th className="py-2 font-medium text-dark-6">Tutor</th>
            <th className="py-2 font-medium text-dark-6">Periode</th>
            <th className="py-2 text-center font-medium text-dark-6">Hadir</th>
            <th className="py-2 text-right font-medium text-dark-6">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-b border-stroke">
              <td className="py-2 text-dark">{i.tutorNama}</td>
              <td className="py-2 text-dark">{i.mingguKe > 0 ? `Minggu ke-${i.mingguKe}` : "Bulanan"}</td>
              <td className="py-2 text-center text-dark">
                {i.jumlahHadir}x{i.jumlahIzin > 0 && <span className="text-dark-6"> + {i.jumlahIzin}x izin</span>}
              </td>
              <td className="py-2 text-right text-dark">
                Rp {tagihanPrivat(i.jumlahHadir, i.jumlahIzin, i.biayaOrtu, cfg.feeIzinOrtu).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TotalTagihan total={total} lunas={lunas} />

      <RekapBelajar
        data={terakhir}
        judul={judulRekap(terakhir.mingguKe)}
        labelCatatan="Catatan & saran untuk siswa:"
      />
    </KwitansiFrame>
  );
}

export function KwitansiGabunganKelompok({
  namaKelompok,
  tutorNama,
  periodeLabel,
  items,
  cfg,
}: {
  namaKelompok: string;
  tutorNama: string;
  periodeLabel: string;
  items: ItemGabunganKelompok[];
  cfg: Pengaturan;
}) {
  if (items.length === 0) return null;

  const lines = items.flatMap((i) => i.lines);
  const total = totalBaris(lines);
  const lunas = items.every((i) => i.statusBayarOrtu === "lunas");
  const terakhir = terbaru(items);

  return (
    <KwitansiFrame subtitle= {cfg.subjudulKelompok} cfg={cfg}>
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F9FC] p-4 text-sm">
        <Info label="Nama Kelompok" value={namaKelompok} />
        <Info label="Tutor" value={tutorNama} />
        <Info label="Periode" value={periodeLabel} />
      </div>

      <table className="mb-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-stroke text-left">
            <th className="py-2 font-medium text-dark-6">Rincian</th>
            <th className="py-2 text-center font-medium text-dark-6">Jumlah</th>
            <th className="py-2 text-right font-medium text-dark-6">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.key} className="border-b border-stroke">
              <td className="py-2 text-dark">{l.label}</td>
              <td className="py-2 text-center text-dark">{l.jumlah}x</td>
              <td className="py-2 text-right text-dark">
                Rp {(l.jumlah * l.hargaSatuan).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TotalTagihan total={total} lunas={lunas} />

      <RekapBelajar
        data={terakhir}
        judul={judulRekap(terakhir.mingguKe)}
        labelCatatan="Catatan & saran:"
      />
    </KwitansiFrame>
  );
}