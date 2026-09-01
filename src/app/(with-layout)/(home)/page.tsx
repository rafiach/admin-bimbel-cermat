import { Suspense } from "react";
import { DashboardStats } from "./_components/dashboard-stats";
import { LaporanTerbaru } from "./_components/laporan-terbaru";
import { StatusPembayaranCard } from "./_components/status-pembayaran-card";
import { SiswaBelumTutor } from "./_components/siswa-belum-tutor";
import { TutorBelumLaporan } from "./_components/tutor-belum-laporan";

export default function Home() {
  return (
    <div className="space-y-4 md:space-y-6 2xl:space-y-7.5">
      <Suspense fallback={null}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={null}>
        <SiswaBelumTutor />
      </Suspense>
      <Suspense fallback={null}>
        <TutorBelumLaporan />
      </Suspense>

      <div className="col-span-12 xl:col-span-5">
        <Suspense fallback={null}>
          <StatusPembayaranCard />
        </Suspense>
      </div>
      <div className="col-span-12 xl:col-span-7">
        <Suspense fallback={null}>
          <LaporanTerbaru />
        </Suspense>
      </div>
    </div>
  );
}