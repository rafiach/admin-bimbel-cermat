import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kelasId = searchParams.get("kelasId");
  const kelompokId = searchParams.get("kelompokId");
  const bulan = Number(searchParams.get("bulan"));
  const tahun = Number(searchParams.get("tahun"));
  const mingguKe = Number(searchParams.get("mingguKe"));
  const excludeLaporanId = searchParams.get("excludeLaporanId");

  if ((!kelasId && !kelompokId) || !bulan || !tahun) {
    return NextResponse.json({ dates: [] });
  }

  let dates: string[] = [];

  if (kelasId) {
    const where: any = {
      kelasId,
    };
    if (mingguKe) {
      const startDay = (mingguKe - 1) * 7 + 1;
      const endDay = Math.min(startDay + 6, new Date(tahun, bulan, 0).getDate());
      where.tanggal = {
        gte: new Date(Date.UTC(tahun, bulan - 1, startDay)),
        lte: new Date(Date.UTC(tahun, bulan - 1, endDay, 23, 59, 59)),
      };
    } else {
      where.tanggal = {
        gte: new Date(Date.UTC(tahun, bulan - 1, 1)),
        lte: new Date(Date.UTC(tahun, bulan, 0, 23, 59, 59)),
      };
    }
    if (excludeLaporanId) {
      where.laporanId = { not: excludeLaporanId };
    }

    const result = await db.laporanTanggalPertemuan.findMany({
      where,
      select: { tanggal: true },
    });
    dates = result.map((d) => d.tanggal.toISOString().split("T")[0]);
  }

  if (kelompokId) {
    const where: any = {
      kelompokId,
    };
    if (mingguKe) {
      const startDay = (mingguKe - 1) * 7 + 1;
      const endDay = Math.min(startDay + 6, new Date(tahun, bulan, 0).getDate());
      where.tanggal = {
        gte: new Date(Date.UTC(tahun, bulan - 1, startDay)),
        lte: new Date(Date.UTC(tahun, bulan - 1, endDay, 23, 59, 59)),
      };
    } else {
      where.tanggal = {
        gte: new Date(Date.UTC(tahun, bulan - 1, 1)),
        lte: new Date(Date.UTC(tahun, bulan, 0, 23, 59, 59)),
      };
    }
    if (excludeLaporanId) {
      where.laporanKelompokId = { not: excludeLaporanId };
    }

    const result = await db.laporanTanggalPertemuanKelompok.findMany({
      where,
      select: { tanggal: true },
    });
    dates = [...dates, ...result.map((d) => d.tanggal.toISOString().split("T")[0])];
  }

  return NextResponse.json({ dates });
}