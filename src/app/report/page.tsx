import { db } from "@/lib/db";
import { ReportForm } from "./_component/form-report";


export const metadata = { title: "Lapor Kehadiran - Bimbel Cermat" };

export default async function ReportPage() {
  const [tutorList, kelasList, kelompokList] = await Promise.all([
    db.tutor.findMany({ where: { status: "aktif" }, orderBy: { nama: "asc" } }),
    db.kelas.findMany({ where: { status: "aktif" }, include: { siswa: true }, orderBy: { jadwal: "asc" } }),
    db.kelompok.findMany({
      where: { status: "aktif" },
      include: { anggota: { include: { siswa: true } } },
      orderBy: { nama: "asc" },
    }),
  ]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#FFF3EC] to-gray-2 sm:flex sm:items-center sm:justify-center sm:p-4 dark:from-[#1a1008] dark:to-[#020d1a]">
      <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-white dark:bg-gray-dark sm:min-h-0 sm:max-w-lg sm:rounded-[10px] sm:border sm:border-stroke sm:shadow-1 sm:dark:border-dark-3">
        <div className="h-2 shrink-0 bg-[#F35C2B]" />

        <div className="p-6.5 sm:p-7.5">
          <div className="mb-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo-bimbel.svg" alt="Bimbel Cermat" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-heading-6 font-bold text-dark dark:text-white">Bimbel Cermat</h1>
              <p className="text-sm text-dark-6">Lapor Kehadiran & Perkembangan Siswa</p>
            </div>
          </div>

          <ReportForm tutorList={tutorList} kelasList={kelasList} kelompokList={kelompokList} />
        </div>
      </div>
    </div>
  );
}