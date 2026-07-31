import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteSiswa } from "./actions";
import { formatPhoneDisplay, waLink } from "@/lib/phone";
export const dynamic = "force-dynamic";

export const metadata = { title: "Data Siswa" };

export default async function SiswaPage({
  searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
  }) {
  const { error } = await searchParams;
  const siswa = await db.siswa.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <Breadcrumb pageName="Data Siswa" />
      {error && (
        <div className="mb-4 rounded-lg border border-[#D34053]/30 bg-[#D34053]/5 px-4 py-3 text-sm text-[#D34053]">
          {error}
        </div>
      )}

      <div className="mb-4 rounded-lg border border-[#FFA70B]/30 bg-[#FFA70B]/5 px-4 py-3 text-sm text-dark dark:text-white">
        <span className="font-medium">Nonaktif</span> = siswa belum dapat kelas/tutor. Status otomatis
        jadi <span className="font-medium">Aktif</span> begitu siswa ini dibuatkan Kelas di menu Data Kelas.
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Daftar Siswa ({siswa.length})
          </h4>
          <Link
            href="/siswa/tambah"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          >
            + Tambah Siswa
          </Link>
        </div>

        <Table className="min-w-[960px]">
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="sticky left-0 z-10 bg-[#F7F9FC] xl:pl-7.5 dark:bg-dark-2">Nama</TableHead>
              <TableHead>Sekolah</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Nama Ortu</TableHead>
              <TableHead>No HP Ortu</TableHead>
              <TableHead>Biaya Bimbel</TableHead>
              <TableHead>Kendala Belajar Siswa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {siswa.map((s) => (
              <TableRow key={s.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="sticky left-0 z-10 bg-white xl:pl-7.5 text-dark dark:text-white dark:bg-dark-2">
                  {s.nama}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {s.sekolah || "-"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {s.kelas || "-"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {s.namaOrtu || "-"}
                </TableCell>
                <TableCell>
                  {waLink(s.noHpOrtu) ? (
                    <a href={waLink(s.noHpOrtu)!} target="_blank" className="text-primary hover:underline">
                      {formatPhoneDisplay(s.noHpOrtu)}
                    </a>
                  ) : (
                    <span className="text-dark dark:text-white">-</span>
                  )}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {s.biayaBimbel || "-"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {s.notes || "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      s.status === "aktif"
                        ? "bg-[#219653]/8 text-[#219653]"
                        : "bg-[#D34053]/8 text-[#D34053]",
                    )}
                  >
                    {s.status}
                  </span>
                </TableCell>
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-3.5">
                    <Link href={`/siswa/${s.id}/edit`} className="hover:text-primary">
                      Edit
                    </Link>
                    <form action={deleteSiswa}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="text-red hover:underline">
                        Hapus
                      </button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {siswa.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-dark-6">
                  Belum ada data siswa.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}