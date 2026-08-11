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
import { formatPhoneDisplay, waLink } from "@/lib/phone";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { SearchInput } from "@/components/search-input";
export const dynamic = "force-dynamic";

export const metadata = { title: "Data Tutor" };

const PAGE_SIZE = 10;

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; error?: string}>;
}) {
  const { q, page: pageParam, error } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q ? { nama: { contains: q, mode: "insensitive" as const } } : {};

  const [tutor, total] = await Promise.all([
    db.tutor.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.tutor.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  return (
    <>
      <Breadcrumb pageName="Data Tutor" />
      {error && (
        <div className="mb-4 rounded-lg border border-[#D34053]/30 bg-[#D34053]/5 px-4 py-3 text-sm text-[#D34053]">
          {error}
        </div>
      )}

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-5 flex flex-nowrap items-center justify-between gap-3">
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Daftar Tutor ({total})
          </h4>
          <div className="flex items-center gap-3">
            <SearchInput placeholder="Cari nama Tutor..." />
            <Link
              href="/tutor/tambah"
              className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
              + Tambah
            </Link>
          </div>
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
                <TableCell className="sticky left-0 z-10 xl:pr-7.5 bg-white text-dark dark:text-white dark:bg-[#122031]">
                  {t.nama}
                </TableCell>
                <TableCell>
                  {waLink(t.noHp) ? (
                    <a href={waLink(t.noHp)!} target="_blank" className="text-primary hover:underline">
                      {formatPhoneDisplay(t.noHp)}
                    </a>
                  ) : (
                    <span className="text-dark dark:text-white">-</span>
                  )}
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
                      <SubmitButton className="text-red hover:underline disabled:opacity-60">
                        Hapus
                      </SubmitButton>
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