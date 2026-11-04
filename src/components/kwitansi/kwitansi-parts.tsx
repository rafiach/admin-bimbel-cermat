const RATING = [
  ["Pemahaman Materi", "pemahamanMateri"],
  ["Keaktifan Belajar", "keaktifanBelajar"],
  ["Kemandirian", "kemandirian"],
  ["Kedisiplinan", "kedisiplinan"],
] as const;

export function KwitansiFrame({
  subtitle,
  children,
}: {
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id="area-cetak"
      className="relative mx-auto max-w-2xl overflow-hidden rounded-[10px] border border-stroke bg-white shadow-1"
    >
      <div className="h-2 bg-[#F35C2B]" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo/logo-icon-bimbel.svg" alt="" className="w-2/3 opacity-[0.15] grayscale" />
      </div>

      <div className="relative z-10 p-8">
        <div className="mb-6 flex items-center gap-4 border-b border-stroke pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/logo-icon-bimbel.svg" alt="Bimbel Cermat" className="h-18 w-18 object-contain" />
          <div>
            <h2 className="text-heading-6 font-bold text-dark">Bimbel Cermat</h2>
            <p className="text-sm text-dark-6">{subtitle}</p>
          </div>
        </div>

        {children}

        <p className="border-t border-stroke pt-4 text-center text-xs text-dark-6">
          Terima kasih atas kepercayaannya — Bimbel Cermat
        </p>
      </div>
    </div>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-dark-6">{label}</p>
      <p className="font-medium text-dark">{value}</p>
    </div>
  );
}

export function TotalTagihan({ total, lunas }: { total: number; lunas: boolean }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg bg-[#F35C2B]/10 px-5 py-4">
      <div>
        <p className="text-sm text-dark-6">Total Tagihan</p>
        <p className="text-heading-6 font-bold text-[#F35C2B]">
          Rp {total.toLocaleString("id-ID")}
        </p>
      </div>
      <span
        className={
          lunas
            ? "rounded-full border-2 border-[#219653] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-[#219653]"
            : "rounded-full border-2 border-[#D34053] px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-[#D34053]"
        }
      >
        {lunas ? "Lunas" : "Belum Lunas"}
      </span>
    </div>
  );
}

type Rekap = {
  materiDipelajari: string | null;
  pemahamanMateri: number;
  keaktifanBelajar: number;
  kemandirian: number;
  kedisiplinan: number;
  catatanSiswa: string | null;
};

export function RekapBelajar({
  data,
  judul,
  labelCatatan,
}: {
  data: Rekap;
  judul?: string;
  labelCatatan: string;
}) {
  return (
    <div className="mb-4">
      {judul && <h5 className="mb-3 font-medium text-dark">{judul}</h5>}

      {data.materiDipelajari && (
        <p className="mb-3 text-sm text-dark">
          <span className="text-dark-6">Materi dipelajari: </span>
          {data.materiDipelajari}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 text-sm">
        {RATING.map(([label, key]) => (
          <div key={key} className="flex items-center justify-between rounded-lg border border-stroke px-3 py-2">
            <span className="text-dark">{label}</span>
            <span className="font-medium text-primary">{data[key]}/5</span>
          </div>
        ))}
      </div>

      {data.catatanSiswa && (
        <p className="mt-3 text-sm text-dark">
          <span className="text-dark-6">{labelCatatan} </span>
          {data.catatanSiswa}
        </p>
      )}
    </div>
  );
}