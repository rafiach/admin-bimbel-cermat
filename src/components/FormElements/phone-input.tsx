import { COUNTRY_CODES, splitPhone } from "@/lib/phone";

export function PhoneInputGroup({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  const { kodeNegara, nomor } = splitPhone(defaultValue);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="ml-1 text-red">*</span>}
      </label>
      <div className="flex overflow-hidden rounded-lg border border-stroke focus-within:border-primary dark:border-dark-3">
        <select
          name={`${name}_kode`}
          defaultValue={kodeNegara}
          className="border-r border-stroke bg-[#F7F9FC] px-2 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <input
          type="tel"
          name={`${name}_nomor`}
          defaultValue={nomor}
          required={required}
          placeholder="81234567890"
          className="w-full bg-transparent px-4 py-3 text-dark outline-none dark:text-white"
        />
      </div>
    </div>
  );
}