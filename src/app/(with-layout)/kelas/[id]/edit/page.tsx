import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateKelas } from "../../actions";

export const metadata = { title: "Edit Kelas" };

export default async function EditKelasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kelas = await db.kelas.findUnique({ where: { id }, include: { siswa: true, tutor: true } });

  if (!kelas) notFound();

  const updateKelasWithId = updateKelas.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Kelas" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">{kelas.siswa.nama} — {kelas.tutor.nama}</p>

        <form action={updateKelasWithId} className="space-y-5.5">
          <Select
            label="Tipe"
            name="tipe"
            defaultValue={kelas.tipe}
            items={[
              { value: "privat", label: "Privat" },
              { value: "kelompok", label: "Kelompok" },
            ]}
          />
          <InputGroup label="Jadwal" name="jadwal" type="text" placeholder="Misal: Senin & Kamis, 15:00" defaultValue={kelas.jadwal} required />
          <InputGroup label="Biaya ke Ortu (per pertemuan)" name="biayaOrtu" type="number" placeholder="" defaultValue={String(kelas.biayaOrtu)} required />
          <InputGroup label="Fee Tutor (per pertemuan)" name="feeTutor" type="number" placeholder="" defaultValue={String(kelas.feeTutor)} required />
          <Select
            label="Status"
            name="status"
            defaultValue={kelas.status}
            items={[
              { value: "aktif", label: "Aktif" },
              { value: "nonaktif", label: "Nonaktif" },
            ]}
          />

          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </>
  );
}