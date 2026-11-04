import { FEE_IZIN, labelPeriode, tagihanPrivat } from "@/lib/kwitansi";
import { Info, KwitansiFrame, RekapBelajar, TotalTagihan } from "./kwitansi-parts";

export type KwitansiPrivatData = {
  bulan: number;
  tahun: number;
  mingguKe: number;
  jumlahHadir: number;
  jumlahIzin: number;
  statusBayarOrtu: string;
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
  kelas: {
    jadwal: string;
    biayaOrtu: number;
    siswa: { nama: string };
    tutor: { nama: string };
  };
};

export function KwitansiPrivat({ laporan }: { laporan: KwitansiPrivatData }) {
  const { kelas } = laporan;
  const total = tagihanPrivat(laporan.jumlahHadir, laporan.jumlahIzin, kelas.biayaOrtu);

  return (
    <KwitansiFrame subtitle="Kwitansi & Rekap Perkembangan Belajar">
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg p-4 text-sm">
        <Info label="Nama Siswa" value={kelas.siswa.nama} />
        <Info label="Tutor" value={kelas.tutor.nama} />
        <Info label="Periode" value={labelPeriode(laporan.bulan, laporan.tahun, laporan.mingguKe)} />
        <Info label="Jadwal" value={kelas.jadwal} />
      </div>

      <table className="mb-6 w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b border-stroke">
            <td className="py-2 text-dark">Jumlah Hadir</td>
            <td className="py-2 text-right text-dark">{laporan.jumlahHadir}x</td>
          </tr>
          <tr className="border-b border-stroke">
            <td className="py-2 text-dark">Biaya per Pertemuan</td>
            <td className="py-2 text-right text-dark">
              Rp {kelas.biayaOrtu.toLocaleString("id-ID")}
            </td>
          </tr>
          {laporan.jumlahIzin > 0 && (
            <tr className="border-b border-stroke">
              <td className="py-2 text-dark">Izin Mendadak</td>
              <td className="py-2 text-right text-dark-6">
                {laporan.jumlahIzin}x @Rp {FEE_IZIN.toLocaleString("id-ID")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <TotalTagihan total={total} lunas={laporan.statusBayarOrtu === "lunas"} />

      <RekapBelajar
        data={laporan}
        judul="Rekap Perkembangan Belajar"
        labelCatatan="Catatan & saran untuk siswa:"
      />
    </KwitansiFrame>
  );
}