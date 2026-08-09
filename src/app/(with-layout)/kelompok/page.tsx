import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import Link from "next/link";
import { deleteKelompok } from "./actions";

export const metadata = { title: "Data Kelompok" };

export default async function KelompokPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const kelompok = await db.kelompok.findMany({
    include: { tutor: true, anggota: { include: { siswa: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Breadcrumb pageName="Data Kelas" />

      {error && (
        <div className="mb-4 rounded-lg border border-[#D34053]/30 bg-[#D34053]/5 px-4 py-3 text-sm text-[#D34053]">
          {error}
        </div>
      )}

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Daftar Kelas Kelompok ({kelompok.length})
          </h4>
          <Link href="/kelompok/tambah" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
            + Tambah Kelas
          </Link>
        </div>

        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Nama Kelompok</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Anggota</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Fee Kelompok</TableHead>
              <TableHead className="text-right xl:pr-7.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kelompok.map((k) => (
              <TableRow key={k.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="xl:pl-7.5 text-dark dark:text-white">{k.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">{k.tutor.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">
                  {k.anggota.map((a) => a.siswa.nama).join(", ")}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {k.jadwal}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  Rp {k.hargaKelompok.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/kelompok/${k.id}/edit`} className="hover:text-primary">Edit</Link>
                    <form action={deleteKelompok}>
                      <input type="hidden" name="id" value={k.id} />
                      <button type="submit" className="text-red hover:underline">Hapus</button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {kelompok.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-dark-6">Belum ada kelompok.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}