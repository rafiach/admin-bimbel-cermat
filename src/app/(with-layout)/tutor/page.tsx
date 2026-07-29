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
import { deleteTutor } from "./actions";

export const metadata = { title: "Data Tutor" };

export default async function TutorPage() {
  const tutor = await db.tutor.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <Breadcrumb pageName="Data Tutor" />

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Daftar Tutor ({tutor.length})
          </h4>
          <Link
            href="/tutor/tambah"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          >
            + Tambah Tutor
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Nama</TableHead>
              <TableHead>No HP</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Jenjang</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tutor.map((t) => (
              <TableRow key={t.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="xl:pl-7.5 text-dark dark:text-white">
                  {t.nama}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {t.noHp || "-"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {t.alamat || "-"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {t.jenjang || "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      t.status === "aktif"
                        ? "bg-[#219653]/8 text-[#219653]"
                        : "bg-[#D34053]/8 text-[#D34053]",
                    )}
                  >
                    {t.status}
                  </span>
                </TableCell>
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-3.5">
                    <Link href={`/tutor/${t.id}/edit`} className="hover:text-primary">
                      Edit
                    </Link>
                    <form action={deleteTutor}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-red hover:underline">
                        Hapus
                      </button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {tutor.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-dark-6">
                  Belum ada data tutor.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}