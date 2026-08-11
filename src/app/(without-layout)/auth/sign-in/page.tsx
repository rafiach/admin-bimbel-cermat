import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-wrap items-stretch">
      <div className="flex w-full items-center xl:w-1/2">
        <div className="mx-auto w-[570px] p-4 sm:p-12.5 xl:p-15">
          <Signin />
        </div>
      </div>

      <div className="hidden w-full p-6 xl:block xl:w-1/2">
        <div className="custom-gradient-1 flex h-full flex-col justify-center overflow-hidden rounded-2xl px-15">
          <Link className="mb-10 inline-flex items-center gap-3" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/logo-bimbel.svg"
              alt="Bimbel Cermat"
              className="h-16 w-auto object-contain"
            />
            <span className="text-heading-6 font-bold text-dark dark:text-white">
              Bimbel Cermat
            </span>
          </Link>

          <p className="mb-3 inline-block w-fit rounded-full bg-[#F35C2B]/10 px-3 py-1 text-sm font-medium text-[#F35C2B]">
            Admin Panel
          </p>

          <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
            Selamat Datang <span className="text-[#F35C2B]">Kembali!</span>
          </h1>

          <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
            Masuk ke akun kamu buat kelola data siswa, tutor, dan laporan Bimbel Cermat.
          </p>
        </div>
      </div>
    </div>
  );
}