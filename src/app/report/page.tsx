import { db } from "@/lib/db";
import { LaporForm } from "./_component/form-report";

export const metadata = { title: "Lapor Kehadiran - Bimbel Cermat" };

export default async function LaporPage() {
  const [tutorList, kelasList] = await Promise.all([
    db.tutor.findMany({ where: { status: "aktif" }, orderBy: { nama: "asc" } }),
    db.kelas.findMany({ where: { status: "aktif" }, include: { siswa: true }, orderBy: { jadwal: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-2 p-4 dark:bg-[#020d1a]">
      <div className="w-full max-w-md rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <h1 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">Lapor Kehadiran Les</h1>
        <p className="mb-6 text-sm text-dark-6">Bimbel Cermat — isi tiap abis ngajar ya</p>
        <LaporForm tutorList={tutorList} kelasList={kelasList} />
      </div>
    </div>
  );
}