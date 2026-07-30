"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
    >
      Cetak / Download PDF
    </button>
  );
}