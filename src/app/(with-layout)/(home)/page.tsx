import { Suspense } from "react";
import { BillingCards } from "./_components/billing-cards";
import { DashboardStats } from "./_components/dashboard-stats";
import { LaporanTerbaru } from "./_components/laporan-terbaru";
import { StatusPembayaranCard } from "./_components/status-pembayaran-card";
import { SiswaBelumTutor } from "./_components/siswa-belum-tutor";
import { TutorBelumLaporan } from "./_components/tutor-belum-laporan";
import { PeriodeFilterForm } from "@/components/periode-filter-form";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const bulan = Number(params.bulan) || now.getMonth() + 1;
  const tahun = Number(params.tahun) || now.getFullYear();

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
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-6">
        <PeriodeFilterForm bulan={bulan} tahun={tahun} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Suspense key={`billing-${bulan}-${tahun}`} fallback={null}>
            <BillingCards bulan={bulan} tahun={tahun} />
          </Suspense>
          <Suspense key={`pay-${bulan}-${tahun}`} fallback={null}>
            <StatusPembayaranCard bulan={bulan} tahun={tahun} />
          </Suspense>
      </div>

      <Suspense fallback={null}>
        <LaporanTerbaru />
      </Suspense>
    </div>
  );
}