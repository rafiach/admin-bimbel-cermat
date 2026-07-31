"use client";

import { toPng } from "html-to-image";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadButton({ filename }: { filename: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const node = document.getElementById("area-cetak");
    if (!node) return;

    setLoading(true);
    try {
      node.scrollIntoView({ block: "start" });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: node.scrollWidth,
        height: node.scrollHeight,
        style: {
          transform: "none",
          margin: "0",
        },
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("Gagal bikin gambar, coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
    >
      {loading ? "Menyiapkan..." : "Download Kwitansi"}
    </button>
  );
}