import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";

import { KelompokForm } from "../_components/kelompok-form";
import { createKelompok } from "../actions";

export const metadata = { title: "Tambah Kelompok" };

export default async function TambahKelompokPage() {
  const [tutorList, siswaList] = await Promise.all([
    db.tutor.findMany({ where: { status: "aktif" }, orderBy: { nama: "asc" } }),
    db.siswa.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <>
      <Breadcrumb pageName="Tambah Kelompok" />
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <KelompokForm tutorList={tutorList} siswaList={siswaList} action={createKelompok} />
      </div>
    </>
  );
}