"use client";

import { useEffect, useRef, useState } from "react";

type SiswaPoster = {
  nama: string;
  kelas: string | null;
  sekolah: string | null;
  alamat: string | null;
};

// PENTING: sesuaikan angka-angka ini sama ukuran & tata letak poster-base.jpg kamu.
const LAYOUT = {
  canvasSize: { width: 1080, height: 1350 },
  kelas: { x: 540, y: 490, font: "bold 48px sans-serif", color: "#1C2434" },
  alamat: { x: 260, y: 540, font: "bold 28px sans-serif", color: "#1C2434", maxWidth: 800, lineHeight: 32, align: "left" as const },
  sekolah: { x: 260, y: 600, font: "28px sans-serif", color: "#1C2434", align: "left" as const },
  jadwal: { x: 260, y: 660, font: "28px sans-serif", color: "#1C2434", align: "left" as const },
  mapel: { x: 540, y: 730, font: "bold 36px sans-serif", color: "#1C2434" },
};

const inputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3";

export function PosterEditor({ siswa }: { siswa: SiswaPoster }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [mapel, setMapel] = useState("");
  const [jadwal, setJadwal] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = LAYOUT.canvasSize.width;
    canvas.height = LAYOUT.canvasSize.height;

    const bg = new Image();
    bg.src = "/images/poster/poster-base.png";
    bg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      if (siswa.sekolah) drawText(ctx, siswa.sekolah, LAYOUT.sekolah );
      if (siswa.kelas) drawText(ctx, siswa.kelas, LAYOUT.kelas);
      if (mapel) drawText(ctx, mapel, LAYOUT.mapel);
      if (jadwal) drawText(ctx, jadwal, LAYOUT.jadwal);
      if (siswa.alamat) drawWrappedText(ctx, siswa.alamat, LAYOUT.alamat);

      setReady(true);
    };
  }, [siswa, mapel, jadwal]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `poster-${siswa.nama}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Mapel yang Dicari</label>
          <input
            type="text"
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            placeholder="Misal: Matematika, IPA"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Jadwal yang Diinginkan</label>
          <input
            type="text"
            value={jadwal}
            onChange={(e) => setJadwal(e.target.value)}
            placeholder="Misal: Senin & Kamis, 15:00"
            className={inputClass}
          />
        </div>
        <button
          onClick={handleDownload}
          disabled={!ready}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
        >
          Download Poster
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full max-w-md rounded-lg border border-stroke dark:border-dark-3" />
    </div>
  );
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  opts: { x: number; y: number; font: string; color: string; align?: CanvasTextAlign },
) {
  ctx.font = opts.font;
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align ?? "center";
  ctx.fillText(text, opts.x, opts.y);
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  opts: { x: number; y: number; font: string; color: string; maxWidth: number; lineHeight: number; align?: CanvasTextAlign },
) {
  ctx.font = opts.font;
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align ?? "center";

  const words = text.split(" ");
  let line = "";
  let y = opts.y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > opts.maxWidth && line) {
      ctx.fillText(line, opts.x, y);
      line = word;
      y += opts.lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, opts.x, y);
}