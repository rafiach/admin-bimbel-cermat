export const COUNTRY_CODES = [
  { code: "62", label: "🇮🇩 +62" },
  { code: "60", label: "🇲🇾 +60" },
  { code: "65", label: "🇸🇬 +65" },
];

const DEFAULT_CODE = "62";

export function splitPhone(raw?: string | null): { kodeNegara: string; nomor: string } {
  if (!raw) return { kodeNegara: DEFAULT_CODE, nomor: "" };

  const digits = raw.replace(/\D/g, "");
  if (!digits) return { kodeNegara: DEFAULT_CODE, nomor: "" };

  for (const { code } of COUNTRY_CODES) {
    if (digits.startsWith(code)) {
      return { kodeNegara: code, nomor: digits.slice(code.length) };
    }
  }

  // data lama yang masih format "08xx" dianggap Indonesia
  if (digits.startsWith("0")) {
    return { kodeNegara: DEFAULT_CODE, nomor: digits.slice(1) };
  }

  return { kodeNegara: DEFAULT_CODE, nomor: digits };
}

export function combinePhone(kodeNegara: string, nomorRaw: string): string | null {
  const nomor = nomorRaw.replace(/\D/g, "").replace(/^0+/, "");
  if (nomor.length < 6) return null;
  return `${kodeNegara}${nomor}`;
}

export function waLink(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 6 ? `https://wa.me/${digits}` : null;
}

export function formatPhoneDisplay(raw?: string | null): string {
  if (!raw) return "-";
  const digits = raw.replace(/\D/g, "");
  return digits ? `+${digits}` : "-";
}