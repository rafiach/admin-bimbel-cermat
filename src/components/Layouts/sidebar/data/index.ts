import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Data Siswa",
        url: "/siswa",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Data Tutor",
        url: "/tutor",
        icon: Icons.Authentication,
        items: [],
      },
            {
        title: "Data Kelas",
        icon: Icons.Calendar,
        items: [
          {
            title: "Privat",
            url: "/kelas",
          },
          {
            title: "Kelompok",
            url: "/kelompok",
          },
        ],
      },
      {
        title: "Rekap & Pembayaran",
        icon: Icons.Table,
        items: [
          {
            title: "Privat",
            url: "/rekap",
          },
          {
            title: "Kelompok",
            url: "/rekap-kelompok",
          },
        ],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.FourCircle,
        items: [],
      },
    ],
  },
];