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
  const localPart = defaultValue?.startsWith("62") ? defaultValue.slice(2) : defaultValue ?? "";

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="ml-1 text-red">*</span>}
      </label>
      <div className="flex overflow-hidden rounded-lg border border-stroke focus-within:border-primary dark:border-dark-3">
        <span className="flex items-center bg-[#F7F9FC] px-3 text-sm text-dark-6 dark:bg-dark-2">+62</span>
        <input
          type="tel"
          name={name}
          defaultValue={localPart}
          required={required}
          placeholder="81234567890"
          className="w-full bg-transparent px-4 py-3 text-dark outline-none dark:text-white"
        />
      </div>
    </div>
  );
}