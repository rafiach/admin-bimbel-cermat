"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type PropsType = {
  id: string;
  labelLunas: string;
  labelBelum: string;
  jumlahLunas: number;
  jumlahBelum: number;
};

export function StatusPembayaranChart({
  id,
  labelLunas,
  labelBelum,
  jumlahLunas,
  jumlahBelum,
}: PropsType) {
  const total = jumlahLunas + jumlahBelum;

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-dark-6">Belum ada data.</p>;
  }

  const chartOptions: ApexOptions = {
    chart: {
      id,
      type: "donut",
      fontFamily: "inherit",
      animations: { enabled: false },
    },
    colors: ["#219653", "#D34053"],
    labels: [labelLunas, labelBelum],
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "13px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [jumlahLunas, jumlahBelum];

  return <Chart options={chartOptions} series={series} type="donut" width={220} />;
}