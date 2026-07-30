import { db } from "@/lib/db";
import { StatusPembayaranChart } from "./status-pembayaran-chart";

export async function StatusPembayaranCard() {
  const now = new Date();
  const laporan = await db.laporanBulanan.findMany({
    where: { bulan: now.getMonth() + 1, tahun: now.getFullYear() },
    select: { statusBayarOrtu: true, statusBayarTutor: true },
  });

  const lunasOrtu = laporan.filter((l) => l.statusBayarOrtu === "lunas").length;
  const belumOrtu = laporan.length - lunasOrtu;

  const sudahTutor = laporan.filter((l) => l.statusBayarTutor === "sudah").length;
  const belumTutor = laporan.length - sudahTutor;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h4 className="mb-4 font-medium text-dark dark:text-white">Status Pembayaran Bulan Ini</h4>

      <div className="flex flex-nowrap justify-center gap-6 overflow-x-auto">
        <div>
          <p className="mb-2 text-center text-sm text-dark-6">Ortu</p>
          <StatusPembayaranChart id="chart-ortu" labelLunas="Lunas" labelBelum="Belum" jumlahLunas={lunasOrtu} jumlahBelum={belumOrtu} />
        </div>
        <div>
          <p className="mb-2 text-center text-sm text-dark-6">Tutor</p>
          <StatusPembayaranChart id="chart-tutor" labelLunas="Sudah" labelBelum="Belum" jumlahLunas={sudahTutor} jumlahBelum={belumTutor} />
        </div>
      </div>
    </div>
  );
}