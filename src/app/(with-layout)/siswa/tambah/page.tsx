import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { createSiswa } from "../actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Siswa" };

export default function TambahSiswaPage() {
  return (
    <>
      <Breadcrumb pageName="Tambah Siswa" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <form action={createSiswa} className="space-y-5.5">
          <InputGroup label="Nama Siswa" name="nama" type="text" placeholder="Nama lengkap siswa" required />
          <InputGroup label="Sekolah" name="sekolah" type="text" placeholder="Nama sekolah" />
          <InputGroup label="Kelas" name="kelas" type="text" placeholder="Misal: 5 SD / 8 SMP" />
          <InputGroup label="Nama Orang Tua" name="namaOrtu" type="text" placeholder="Nama lengkap orang tua" />
          <InputGroup label="No HP Orang Tua" name="noHpOrtu" type="text" placeholder="08xxxxxxxxxx" />
          <InputGroup label="Biaya Bimbel" name="biayaBimbel" type="text" placeholder="Langsung tulis angka: 20000" />
          <InputGroup label="Kendala Belajar Siswa" name="notes" type="text" placeholder="Kendala belajar siswa" />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
          >
            Simpan Siswa
          </button>
        </form>
      </div>
    </>
  );
}