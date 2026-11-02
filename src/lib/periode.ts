const GRACE_DAYS = 7;

function wibNow(now = new Date()) {
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
}

// bulan yang sebenarnya (tanpa grace)
export function realPeriode(now = new Date()) {
  const w = wibNow(now);
  return { bulan: w.getMonth() + 1, tahun: w.getFullYear() };
}

// bulan default (dengan grace)
export function defaultPeriode(now = new Date()) {
  const w = wibNow(now);
  let bulan = w.getMonth() + 1;
  let tahun = w.getFullYear();
  if (w.getDate() <= GRACE_DAYS) {
    bulan -= 1;
    if (bulan === 0) { bulan = 12; tahun -= 1; }
  }
  return { bulan, tahun };
}

export function resolvePeriode(params: { bulan?: string; tahun?: string }) {
  if (params.bulan && params.tahun) {
    return { bulan: Number(params.bulan), tahun: Number(params.tahun), isDefault: false };
  }
  return { ...defaultPeriode(), isDefault: true };
}