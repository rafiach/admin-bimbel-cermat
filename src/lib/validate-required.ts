export type FormErrors = Record<string, string>;

export function validateRequired(
  formData: FormData,
  fields: { name: string; label: string }[],
): FormErrors {
  const errors: FormErrors = {};

  for (const f of fields) {
    const value = formData.get(f.name);
    if (!value || String(value).trim() === "") {
      errors[f.name] = `${f.label} wajib diisi`;
    }
  }

  return errors;
}