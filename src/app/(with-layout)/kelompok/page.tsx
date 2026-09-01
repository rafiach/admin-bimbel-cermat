import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { SubmitButton } from "@/components/FormElements/submit-button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteKelompok } from "./actions";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/FormElements/confirm-button";

export const metadata = { title: "Data Kelompok" };
const PAGE_SIZE = 10;

export default async function KelompokPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; error?: string }>;
}) {
  const { q, page: pageParam, error } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const where = q ? { nama: { contains: q, mode: "insensitive" as const } } : {};
  const [kelompok, total] = await Promise.all([
    db.kelompok.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        tutor: true,
        anggota: {
          include: {
            siswa: true,
          },
        },
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.kelompok.count({ where }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);


  return (
    <>
      <Breadcrumb pageName="Data Kelas" />

      {error && (
        <div className="mb-4 rounded-lg border border-[#D34053]/30 bg-[#D34053]/5 px-4 py-3 text-sm text-[#D34053]">
          {error}
        </div>
      )}

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-5 flex flex-nowrap items-center justify-between gap-3">
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Daftar Kelas Kelompok ({total})
          </h4>
          <div className="flex items-center gap-3">
            <SearchInput placeholder="Cari nama kelompok..." />
            <Link href="/kelompok/tambah" className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
              + Tambah
            </Link>
          </div>
        </div>

        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Nama Kelompok</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Anggota</TableHead>
              <TableHead>Jadwal</TableHead>
              <TableHead>Biaya Kelompok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kelompok.map((k) => (
              <TableRow key={k.id} className="border-[#eee] dark:border-dark-3">
                <TableCell className="sticky left-0 z-10 bg-white xl:pl-7.5 dark:bg-[#122031] text-dark dark:text-white">{k.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">{k.tutor.nama}</TableCell>
                <TableCell className="text-dark dark:text-white">
                  {k.anggota.map((a) => a.siswa.nama).join(", ")}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  {k.jadwal || "-"}
                </TableCell>
                <TableCell className="text-dark dark:text-white">
                  Rp {k.hargaKelompok.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      k.status === "aktif"
                        ? "bg-[#219653]/8 text-[#219653]"
                        : "bg-[#D34053]/8 text-[#D34053]",
                    )}
                  >
                    {k.status}
                  </span>
                </TableCell>
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/kelompok/${k.id}`}
                      title="Lihat detail"
                      className="rounded-md p-2 text-gray-500 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={17} />
                    </Link>
                    <Link 
                      href={`/kelompok/${k.id}/edit`}
                      title="Edit"
                      className="rounded-md p-2 text-gray-500 hover:bg-green/10 hover:text-green"
                    >
                      <Pencil size={17} />
                    </Link>
                    <form action={deleteKelompok}>
                      <input type="hidden" name="id" value={k.id} />
                      <ConfirmButton
                        variant="danger"
                        title="Hapus Data Kelompok?"
                        message={`Yakin mau hapus data kelompok ${k.nama}?`}
                        confirmLabel="Ya, Hapus"
                        icon={<Trash2 className="size-4.5" />}
                        pendingIcon={<Loader2 className="size-4.5 animate-spin" />}
                        className="rounded-md p-2 text-gray-500 hover:bg-red/10 hover:text-red"
                      />
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {kelompok.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-dark-6">Belum ada kelompok.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} extraParams={{ q }} />
      </div>
    </>
  );
}