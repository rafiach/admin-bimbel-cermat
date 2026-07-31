import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { db } from "@/lib/db";
import { createKelas } from "../actions";
export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah Kelas" };

export default async function TambahKelasPage() {
  const [siswaList, tutorList] = await Promise.all([
    db.siswa.findMany({ where: { status: "aktif" }, orderBy: { nama: "asc" } }),
    db.tutor.findMany({ where: { status: "aktif" }, orderBy: { nama: "asc" } }),
  ]);

  return (
    <>
      <Breadcrumb pageName="Tambah Kelas" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <form action={createKelas} className="space-y-5.5">
          <Select label="Siswa" name="siswaId" placeholder="Pilih siswa" items={siswaList.map((s) => ({ value: s.id, label: s.nama }))} />
          <Select label="Tutor" name="tutorId" placeholder="Pilih tutor" items={tutorList.map((t) => ({ value: t.id, label: t.nama }))} />
          <Select
            label="Tipe"
            name="tipe"
            defaultValue="privat"
            items={[
              { value: "privat", label: "Privat" },
              { value: "kelompok", label: "Kelompok" },
            ]}
          />
          <InputGroup label="Jadwal" name="jadwal" type="text" placeholder="Misal: Senin & Kamis, 15:00" required />
          <InputGroup label="Biaya ke Ortu (per pertemuan)" name="biayaOrtu" type="number" placeholder="Misal: 75000" required />
          <InputGroup label="Fee Tutor (per pertemuan)" name="feeTutor" type="number" placeholder="Misal: 50000" required />

          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90">
            Simpan Kelas
          </button>
        </form>
      </div>
    </>
  );
}