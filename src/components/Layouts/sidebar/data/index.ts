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
        url: "/kelas",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Rekap & Pembayaran",
        url: "/rekap",
        icon: Icons.Table,
        items: [],
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