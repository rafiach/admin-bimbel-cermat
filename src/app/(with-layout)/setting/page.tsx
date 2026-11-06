import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getPengaturan } from "@/lib/pengaturan";
import { SettingForm } from "./_components/setting-form";

export const metadata = { title: "Pengaturan" };

export default async function SettingPage() {
  const pengaturan = await getPengaturan();

  return (
    <>
      <Breadcrumb pageName="Pengaturan" />
      <SettingForm
        key={JSON.stringify(pengaturan)}
        initial={pengaturan}
        appUrl={process.env.NEXT_PUBLIC_APP_URL ?? ""}
      />
    </>
  );
}