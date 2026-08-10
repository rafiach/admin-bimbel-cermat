import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateLaporanKelompok } from "../../actions";
import { LaporanKelompokEditForm } from "../../_component/laporan-edit-kelompok-form";

export const metadata = { title: "Edit Laporan Kelompok" };

export default async function EditLaporanKelompokPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const laporan = await db.laporanKelompok.findUnique({
    where: { id },
    include: {
      kelompok: { include: { tutor: true, anggota: { include: { siswa: true } } } },
      anggotaLaporan: true,
    },
  });

  if (!laporan) notFound();

  const updateWithId = updateLaporanKelompok.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Laporan Kelompok" />
      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">
          {laporan.kelompok.nama} — {laporan.kelompok.tutor.nama}
        </p>
        <LaporanKelompokEditForm laporan={laporan} action={updateWithId} />
      </div>
    </>
  );
}