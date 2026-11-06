"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { SubmitButton } from "@/components/FormElements/submit-button";
import { PLACEHOLDER_INFO, type Pengaturan } from "@/lib/pengaturan-default";
import { renderTemplate } from "@/lib/wa-kwitansi";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { savePengaturan, type SettingState } from "../actions";

const cardClass =
  "rounded-[10px] border border-stroke bg-white p-6.5 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5";
const textareaClass =
  "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white";
const labelClass = "mb-3 block text-body-sm font-medium text-dark dark:text-white";

function TemplateEditor({
  label,
  name,
  value,
  onChange,
  vars,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  vars: Record<string, string>;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        name={name}
        rows={11}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={textareaClass}
      />
      <p className="mb-2 mt-4 text-xs font-medium text-dark-6">Preview (contoh data)</p>
      <pre className="whitespace-pre-wrap rounded-lg bg-[#DCF8C6] p-4 font-sans text-sm text-dark">
        {renderTemplate(value, vars)}
      </pre>
    </div>
  );
}

export function SettingForm({ initial, appUrl }: { initial: Pengaturan; appUrl: string }) {
  const [state, formAction] = useActionState<SettingState, FormData>(savePengaturan, null);
  const [belum, setBelum] = useState(initial.templatePesanBelumLunas);
  const [lunas, setLunas] = useState(initial.templatePesanLunas);
  const [info, setInfo] = useState(initial.infoPembayaran);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  const sample = (status: string) => ({
    sapaan: "Bapak/Ibu Budi",
    nama_siswa: "Ani",
    periode: "Oktober 2026",
    total: "Rp 300.000",
    status,
    link: `${appUrl}/k/contoh`,
    info_pembayaran: info,
    nama_bimbel: initial.namaBimbel,
  });

  return (
    <form action={formAction} className="space-y-6">
      <div className={cardClass}>
        <h4 className="mb-5 font-bold text-dark dark:text-white">Fee Izin Mendadak</h4>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Ditagih ke ortu (per izin)"
            name="feeIzinOrtu"
            type="number"
            placeholder="10000"
            defaultValue={String(initial.feeIzinOrtu)}
            required
          />
          <InputGroup
            label="Dibayar ke tutor (per izin)"
            name="feeIzinTutor"
            type="number"
            placeholder="10000"
            defaultValue={String(initial.feeIzinTutor)}
            required
          />
        </div>
        <p className="mt-3 text-xs text-dark-6">
          Berlaku ke semua kwitansi. Generate ulang kwitansi lama sebelum dikirim ketika ada perubahan fee
        </p>
      </div>

      <div className={cardClass}>
        <h4 className="mb-5 font-bold text-dark dark:text-white">Info Pembayaran</h4>
        <label className={labelClass}>Rekening / e-wallet tujuan transfer ortu</label>
        <textarea
          name="infoPembayaran"
          rows={3}
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder={"BCA 1234567890 a.n. Nama\nDANA 0812xxxxxxx a.n. Nama"}
          className={textareaClass}
        />
      </div>

      <div className={`${cardClass} space-y-6`}>
        <h4 className="font-bold text-dark dark:text-white">Template Pesan WhatsApp</h4>

        <div className="rounded-lg bg-[#F7F9FC] p-4 text-xs dark:bg-dark-2">
          <p className="mb-2 font-medium text-dark dark:text-white">Placeholder yang bisa dipakai:</p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {PLACEHOLDER_INFO.map((p) => (
              <li key={p.key} className="text-dark-6">
                <code className="font-medium text-primary">{`{${p.key}}`}</code> — {p.arti}
              </li>
            ))}
          </ul>
        </div>

        <TemplateEditor
          label="Pesan untuk tagihan Belum Lunas"
          name="templatePesanBelumLunas"
          value={belum}
          onChange={setBelum}
          vars={sample("Belum Lunas")}
        />
        <TemplateEditor
          label="Pesan untuk tagihan Lunas"
          name="templatePesanLunas"
          value={lunas}
          onChange={setLunas}
          vars={sample("Lunas")}
        />
      </div>

      <div className={cardClass}>
        <h4 className="mb-5 font-bold text-dark dark:text-white">Identitas Kwitansi</h4>
        <div className="space-y-5">
          <InputGroup
            label="Nama bimbel"
            name="namaBimbel"
            type="text"
            placeholder="Bimbel Cermat"
            defaultValue={initial.namaBimbel}
            required
          />
          <InputGroup
            label="Subjudul kwitansi privat"
            name="subjudulPrivat"
            type="text"
            placeholder=""
            defaultValue={initial.subjudulPrivat}
          />
          <InputGroup
            label="Subjudul kwitansi kelompok"
            name="subjudulKelompok"
            type="text"
            placeholder=""
            defaultValue={initial.subjudulKelompok}
          />
          <InputGroup
            label="Kalimat penutup di bawah kwitansi"
            name="penutupKwitansi"
            type="text"
            placeholder=""
            defaultValue={initial.penutupKwitansi}
          />
        </div>
      </div>

      <SubmitButton className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">
        Simpan Pengaturan
      </SubmitButton>
    </form>
  );
}