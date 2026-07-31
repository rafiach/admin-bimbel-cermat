export function normalizePhoneID(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withoutLeadingZero = digits.replace(/^0+/, "");
  const withoutCountryCode = withoutLeadingZero.startsWith("62")
    ? withoutLeadingZero.slice(2)
    : withoutLeadingZero;
  return `62${withoutCountryCode}`;
}

export function waLink(phone?: string | null): string | null {
  if (!phone) return null;
  return `https://wa.me/${phone}`;
}

export function formatPhoneDisplay(phone?: string | null): string {
  if (!phone) return "-";
  return `+${phone}`;
}