import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateTutor } from "../../actions";

export const metadata = { title: "Edit Tutor" };

export default async function EditTutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await db.tutor.findUnique({ where: { id } });

  if (!tutor) notFound();

  const updateTutorWithId = updateTutor.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Tutor" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <form action={updateTutorWithId} className="space-y-5.5">
          <InputGroup label="Nama Tutor" name="nama" type="text" placeholder="Nama lengkap tutor" defaultValue={tutor.nama} required />
          <InputGroup label="No HP" name="noHp" type="text" placeholder="08xxxxxxxxxx" defaultValue={tutor.noHp ?? ""} />
          <InputGroup label="Alamat" name="alamat" type="text" placeholder="Alamat tutor" defaultValue={tutor.alamat ?? ""} />
          <InputGroup label="Jenjang" name="jenjang" type="text" placeholder="Isi jenjang atau mapel" defaultValue={tutor.jenjang ?? ""} />
          <InputGroup label="No Rekening / E-Wallet" name="norekTutor" type="text" placeholder="Misal: BCA 1234567890 a.n. ..." defaultValue={tutor.norekTutor ?? ""} />
          <Select
            label="Status"
            name="status"
            defaultValue={tutor.status}
            items={[
              { value: "aktif", label: "Aktif" },
              { value: "nonaktif", label: "Nonaktif" },
            ]}
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </>
  );
}