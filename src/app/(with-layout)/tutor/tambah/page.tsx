import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { createTutor } from "../actions";

export const metadata = { title: "Tambah Tutor" };

export default function TambahTutorPage() {
  return (
    <>
      <Breadcrumb pageName="Tambah Tutor" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <form action={createTutor} className="space-y-5.5">
          <InputGroup label="Nama Tutor" name="nama" type="text" placeholder="Nama lengkap tutor" required />
          <InputGroup label="No HP" name="noHp" type="text" placeholder="08xxxxxxxxxx" />
          <InputGroup label="Jenjang" name="jenjang" type="text" placeholder="Isi jenjang atau mapel" />
          <InputGroup label="Alamat" name="alamat" type="text" placeholder="Alamat tutor" />
          <Select
            label="Status"
            name="status"
            defaultValue="aktif"
            items={[
              { value: "aktif", label: "Aktif" },
              { value: "nonaktif", label: "Nonaktif" },
            ]}
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
          >
            Simpan Tutor
          </button>
        </form>
      </div>
    </>
  );
}