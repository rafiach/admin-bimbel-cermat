import { db } from "@/lib/db";
import { ReportForm } from "./_component/form-report";
export const dynamic = "force-dynamic";
export const metadata = { title: "Lapor Kehadiran - Bimbel Cermat" };

export default async function ReportPage() {
  const [tutorList, kelasList] = await Promise.all([
    db.tutor.findMany({ where: { status: "aktif" }, orderBy: { nama: "asc" } }),
    db.kelas.findMany({ where: { status: "aktif" }, include: { siswa: true }, orderBy: { jadwal: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF3EC] to-gray-2 p-4 dark:from-[#1a1008] dark:to-[#020d1a]">
      <div className="w-full max-w-lg overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="h-2 bg-[#F35C2B]" />

        <div className="p-6.5 sm:p-7.5">
          <div className="mb-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo-icon-bimbel.svg" alt="Bimbel Cermat" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-heading-6 font-bold text-dark dark:text-white">Bimbel Cermat</h1>
              <p className="text-sm text-dark-6">Lapor Kehadiran & Perkembangan Siswa</p>
            </div>
          </div>

          <ReportForm tutorList={tutorList} kelasList={kelasList} />
        </div>
      </div>
    </div>
  );
}