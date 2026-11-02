import Link from "next/link";
import { db } from "@/lib/db";
import { BULAN_LABELS } from "@/components/periode-filter-form";
import { realPeriode } from "@/lib/periode";

export async function PeriodeNotice({
  bulan,
  tahun,
  isDefault,
}: {
  bulan: number;
  tahun: number;
  isDefault: boolean;
}) {
  if (!isDefault) return null;

  const now = realPeriode();
  if (now.bulan === bulan && now.tahun === tahun) return null; // di luar masa grace

  const where = { bulan: now.bulan, tahun: now.tahun };
  const [a, b] = await Promise.all([
    db.laporanBulanan.count({ where }),
    db.laporanKelompok.count({ where }),
  ]);
  const total = a + b;
  const namaBaru = BULAN_LABELS[now.bulan - 1];

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FFA70B]/30 bg-[#FFA70B]/5 px-4 py-3 text-sm text-dark dark:text-white">
      <span>
        Lagi nampilin <b>{BULAN_LABELS[bulan - 1]} {tahun}</b> (masa tenggang sampai tgl 7).
        {total > 0 && <> Sudah ada <b>{total}</b> laporan {namaBaru} yang masuk.</>}
      </span>
      <Link
        prefetch={false}
        href={`?bulan=${now.bulan}&tahun=${now.tahun}`}
        className="font-medium text-primary hover:underline"
      >
        Lihat {namaBaru} →
      </Link>
    </div>
  );
}