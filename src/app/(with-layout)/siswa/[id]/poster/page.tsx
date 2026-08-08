import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PosterEditor } from "../_component/poster_editor";

export const metadata = { title: "Poster Promosi Siswa" };

export default async function PosterSiswaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siswa = await db.siswa.findUnique({ where: { id } });

  if (!siswa) notFound();

  return (
    <>
      <Breadcrumb pageName="Poster Promosi" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <PosterEditor
          siswa={{
            nama: siswa.nama,
            kelas: siswa.kelas,
            sekolah: siswa.sekolah,
            alamat: siswa.alamat,
          }}
        />
      </div>
    </>
  );
}