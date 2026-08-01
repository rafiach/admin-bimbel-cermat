import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteKelas } from "./actions";
import { SubmitButton } from "@/components/FormElements/submit-button";

export const metadata = { title: "Data Kelas" };

export default async function KelasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const kelas = await db.kelas.findMany({
    include: { siswa: true, tutor: true },
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
            Daftar Kelas ({kelas.length})
          </h4>
          <Link
            href="/kelas/tambah"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          >
            + Tambah Kelas
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Siswa</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Biaya Ortu</TableHead>
              <TableHead>Fee Tutor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kelas.map((k) => (
              <TableRow key={k.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="sticky left-0 z-10 xl:pr-7.5 bg-white text-dark dark:text-white dark:bg-[#122031]">{k.siswa.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">{k.tutor.nama}</TableCell>
                <TableCell className="capitalize text-dark dark:text-white">{k.tipe}</TableCell>
                <TableCell className="text-dark dark:text-white">{k.jadwal}</TableCell>
                <TableCell className="text-dark dark:text-white">Rp {k.biayaOrtu.toLocaleString("id-ID")}</TableCell>
                <TableCell className="text-dark dark:text-white">Rp {k.feeTutor.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      k.status === "aktif" ? "bg-[#219653]/8 text-[#219653]" : "bg-[#D34053]/8 text-[#D34053]",
                    )}
                  >
                    {k.status}
                  </span>
                </TableCell>
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-3.5">
                    <Link href={`/kelas/${k.id}/edit`} className="hover:text-primary">Edit</Link>
                    <form action={deleteKelas}>
                      <input type="hidden" name="id" value={k.id} />
                      <SubmitButton className="text-red hover:underline disabled:opacity-60">
                        Hapus
                      </SubmitButton>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {kelas.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-dark-6">Belum ada data kelas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}