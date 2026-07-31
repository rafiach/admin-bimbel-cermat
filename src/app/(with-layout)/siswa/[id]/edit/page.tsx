import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateSiswa } from "../../actions";
import { PhoneInputGroup } from "@/components/FormElements/phone-input";
export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Siswa" };

export default async function EditSiswaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siswa = await db.siswa.findUnique({ where: { id } });

  if (!siswa) notFound();

  const updateSiswaWithId = updateSiswa.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Siswa" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <form action={updateSiswaWithId} className="space-y-5.5">
          <InputGroup label="Nama Siswa" name="nama" type="text" placeholder="Nama lengkap siswa" defaultValue={siswa.nama} required />
          <InputGroup label="Sekolah" name="sekolah" type="text" placeholder="Nama sekolah" defaultValue={siswa.sekolah ?? ""} />
          <InputGroup label="Kelas" name="kelas" type="text" placeholder="Misal: 5 SD / 8 SMP" defaultValue={siswa.kelas ?? ""} />
          <InputGroup label="Nama Orang Tua" name="namaOrtu" type="text" placeholder="Nama lengkap orang tua" defaultValue={siswa.namaOrtu ?? ""} />
          <PhoneInputGroup label="No HP Orang Tua" name="noHpOrtu" defaultValue={siswa.noHpOrtu ?? ""}/>
          <InputGroup label="Biaya Bimbel" name="biayaBimbel" type="number" placeholder="Langsung tulis angka: 20000" defaultValue={String(siswa.biayaBimbel) ?? ""}/>
          <InputGroup label="Kendala Belajar Siswa" name="notes" type="text" placeholder="Kendala belajar siswa" defaultValue={siswa.notes ?? ""}/>
          <Select
            label="Status"
            name="status"
            defaultValue={siswa.status}
            items={[
              { value: "aktif", label: "Aktif" },
              { value: "nonaktif", label: "Nonaktif" },
              { value: "keluar", label: "Keluar" },
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