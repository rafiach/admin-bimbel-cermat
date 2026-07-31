import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { createTutor } from "../actions";
import { PhoneInputGroup } from "@/components/FormElements/phone-input";
import { SubmitButton } from "@/components/FormElements/submit-button";
export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah Tutor" };

export default function TambahTutorPage() {
  return (
    <>
      <Breadcrumb pageName="Tambah Tutor" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <form action={createTutor} className="space-y-5.5">
          <InputGroup label="Nama Tutor" name="nama" type="text" placeholder="Nama lengkap tutor" required />
          <PhoneInputGroup label="No HP" name="noHp" />
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
          <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
            Simpan Tutor
          </SubmitButton>
        </form>
      </div>
    </>
  );
}