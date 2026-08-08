import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

import { updateKelompok } from "../../actions";
import { KelompokEditForm } from "../../_components/kelompok-edit-form";

export const metadata = { title: "Edit Kelompok" };

export default async function EditKelompokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kelompok = await db.kelompok.findUnique({
    where: { id },
    include: { tutor: true, anggota: { include: { siswa: true } } },
  });

  if (!kelompok) notFound();

  const updateWithId = updateKelompok.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Kelompok" />
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">Tutor: {kelompok.tutor.nama} (gak bisa diganti, hapus & bikin baru kalau perlu)</p>
        <KelompokEditForm kelompok={kelompok} action={updateWithId} />
      </div>
    </>
  );
}