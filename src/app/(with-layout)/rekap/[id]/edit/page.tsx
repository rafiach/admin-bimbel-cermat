import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { updateLaporan } from "../../actions";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextareaGroup } from "@/components/FormElements/text-area-group";
import { Select } from "@/components/FormElements/select";
import { SubmitButton } from "@/components/FormElements/submit-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Laporan" };

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3";

export default async function EditLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const laporan = await db.laporanBulanan.findUnique({
    where: { id },
    include: { kelas: { include: { siswa: true, tutor: true } } },
  });

  if (!laporan) notFound();

  const updateLaporanWithId = updateLaporan.bind(null, id);

  return (
    <>
      <Breadcrumb pageName="Edit Laporan" />

      <div className="rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <p className="mb-5.5 text-dark-6">
          {laporan.kelas.siswa.nama} — {laporan.kelas.tutor.nama} — {BULAN[laporan.bulan - 1]} {laporan.tahun}
        </p>

        <form action={updateLaporanWithId} className="space-y-5.5">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Jumlah Hadir"
              name="jumlahHadir"
              type="number"
              placeholder="0"
              defaultValue={String(laporan.jumlahHadir)}
              required
            />
            <InputGroup
              label="Jumlah Izin Mendadak"
              name="jumlahIzin"
              type="number"
              placeholder="0"
              defaultValue={String(laporan.jumlahIzin)}
            />
          </div>

          <TextareaGroup
            label="Materi yang Dipelajari"
            name="materiDipelajari"
            placeholder="Materi yang dipelajari bulan ini"
            defaultValue={laporan.materiDipelajari ?? ""}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Pemahaman Materi (1-5)"
              name="pemahamanMateri"
              defaultValue={String(laporan.pemahamanMateri)}
              items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
            />
            <Select
              label="Keaktifan Belajar (1-5)"
              name="keaktifanBelajar"
              defaultValue={String(laporan.keaktifanBelajar)}
              items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
            />
            <Select
              label="Kemandirian (1-5)"
              name="kemandirian"
              defaultValue={String(laporan.kemandirian)}
              items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
            />
            <Select
              label="Kedisiplinan (1-5)"
              name="kedisiplinan"
              defaultValue={String(laporan.kedisiplinan)}
              items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
            />
          </div>

          <TextareaGroup
            label="Catatan & Saran untuk Siswa"
            name="catatanSiswa"
            placeholder="Catatan dan saran untuk siswa"
            defaultValue={laporan.catatanSiswa ?? ""}
          />

          <TextareaGroup
            label="Saran untuk Bimbel"
            name="saranBimbel"
            placeholder="Saran untuk bimbel"
            rows={2}
            defaultValue={laporan.saranBimbel ?? ""}
          />

          <InputGroup
            label="No Rekening Tutor"
            name="norekTutor"
            type="text"
            placeholder="Misal: BCA 1234567890 a.n. ..."
            defaultValue={laporan.norekTutor ?? ""}
          />

          <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
            Simpan Perubahan
          </SubmitButton>
        </form>
      </div>
    </>
  );
}