import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteKelas } from "./actions";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/FormElements/confirm-button";

export const metadata = { title: "Data Kelas" };

const PAGE_SIZE = 10;

export default async function KelasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; error?: string }>;
}) {
  const { q, page: pageParam, error } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q
    ? {
        OR: [
          { siswa: { nama: { contains: q, mode: "insensitive" as const } } },
          { tutor: { nama: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};
  
  const [kelas, total] = await Promise.all([
    db.kelas.findMany({
      where,
      include: { siswa: true, tutor: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.kelas.count({ where }),
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
            Daftar Kelas ({total})
          </h4>
          <div className="flex items-center gap-3">
            <SearchInput placeholder="Cari nama..." />
            <Link
              href="/kelas/tambah"
              className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
              + Tambah
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="xl:pl-7.5">Siswa</TableHead>
              <TableHead>Tutor</TableHead>
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
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/kelas/${k.id}`}
                      title="Lihat detail"
                      className="rounded-md p-2 text-gray-500 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={17} />
                    </Link>
                    <Link 
                      href={`/kelas/${k.id}/edit`} 
                      title="Edit"
                      className="rounded-md p-2 text-gray-500 hover:bg-green/10 hover:text-green"
                    >
                      <Pencil size={17} />
                    </Link>
                    <form action={deleteKelas}>
                      <input type="hidden" name="id" value={k.id} />
                      <ConfirmButton
                        variant="danger"
                        title="Hapus Data kelas?"
                        message={`Yakin mau hapus data kelas ${k.siswa.nama}?`}
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

            {kelas.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-dark-6">Belum ada data kelas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} extraParams={{ q }} />
      </div>
    </>
  );
}