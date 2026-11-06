import { hitungKelompok, labelPeriode } from "@/lib/kwitansi";
import { Info, KwitansiFrame, RekapBelajar, TotalTagihan } from "./kwitansi-parts";
import { Pengaturan } from "@/lib/pengaturan-default";

export type KwitansiKelompokData = {
  bulan: number;
  tahun: number;
  mingguKe: number;
  jumlahKelompok: number;
  jumlahIzin: number;
  hargaKelompokFinal: number | null;
  statusBayarOrtu: string;
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
  kelompok: {
    jadwal: string;
    hargaKelompok: number;
    tutor: { nama: string };
    anggota: { siswaId: string; hargaPrivat: number; siswa: { nama: string } }[];
  };
  anggotaLaporan: { siswaId: string; jumlahIndividu: number; siswa: { nama: string } }[];
};

export function KwitansiKelompok({ laporan, cfg }: { laporan: KwitansiKelompokData; cfg: Pengaturan }) {
  const { hargaKelompok, subtotalKelompok, feeIzin, barisIndividu, totalTagihan } =
    hitungKelompok(laporan, cfg.feeIzinOrtu);
  const namaAnggota = laporan.kelompok.anggota.map((a) => a.siswa.nama).join(" & ");

  return (
    <KwitansiFrame subtitle={cfg.subjudulKelompok} cfg={cfg}>
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4 text-sm">
        <Info label="Nama Kelompok" value={namaAnggota} />
        <Info label="Tutor" value={laporan.kelompok.tutor.nama} />
        <Info label="Periode" value={labelPeriode(laporan.bulan, laporan.tahun, laporan.mingguKe)} />
        <Info label="Jadwal" value={laporan.kelompok.jadwal} />
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
          <tr className="border-b border-stroke">
            <td className="py-2 text-dark">Kelompok @ Rp{hargaKelompok.toLocaleString("id-ID")}</td>
            <td className="py-2 text-center text-dark">{laporan.jumlahKelompok}x</td>
            <td className="py-2 text-right text-dark">Rp {subtotalKelompok.toLocaleString("id-ID")}</td>
          </tr>
          {laporan.jumlahIzin > 0 && (
            <tr className="border-b border-stroke">
              <td className="py-2 text-dark">Izin Mendadak</td>
              <td className="py-2 text-center text-dark-6">
                {laporan.jumlahIzin}x @Rp{cfg.feeIzinOrtu.toLocaleString("id-ID")}
              </td>
              <td className="py-2 text-right text-dark-6">Rp {feeIzin.toLocaleString("id-ID")}</td>
            </tr>
          )}
          {barisIndividu.map((b) => (
            <tr key={b.nama} className="border-b border-stroke">
              <td className="py-2 text-dark">{b.nama} (privat) @ Rp{b.harga.toLocaleString("id-ID")}</td>
              <td className="py-2 text-center text-dark">{b.jumlah}x</td>
              <td className="py-2 text-right text-dark">Rp {b.subtotal.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TotalTagihan total={totalTagihan} lunas={laporan.statusBayarOrtu === "lunas"} />

      <RekapBelajar data={laporan} labelCatatan="Catatan & saran:" />
    </KwitansiFrame>
  );
}