# 📚 Bimbel Cermat — Admin Panel

Aplikasi web admin panel untuk mengelola operasional bimbingan belajar (bimbel) privat & kelompok — mulai dari data siswa, tutor, kelas, kelompok belajar, laporan bulanan tutor, hingga rekap pembayaran dan struk pembayaran otomatis. Dibangun dengan Next.js App Router di atas template [NextAdmin](https://nextadmin.co/), dikustomisasi penuh untuk kebutuhan operasional Bimbel Cermat.

## ✨ Fitur

- **🔐 Autentikasi & RBAC** — Login via BetterAuth (email/password + Google OAuth), dengan 3 peran akses: `viewer`, `editor`, dan `admin`.
- **👨‍🎓 Manajemen Siswa** — Data siswa lengkap (sekolah, kelas, kontak orang tua, biaya bimbel, status aktif) dengan pencarian & paginasi.
- **👩‍🏫 Manajemen Tutor** — Data tutor beserta jenjang yang diampu dan status keaktifan.
- **📖 Kelas Privat & Kelompok** — Dua model pembelajaran: kelas privat (1 siswa – 1 tutor) dan **Kelompok** (banyak siswa dalam satu kelompok dengan satu tutor, mendukung harga per-anggota individual maupun harga kelompok flat).
- **📝 Laporan Bulanan/Mingguan** — Tutor mengisi laporan progres belajar (pemahaman materi, keaktifan, kemandirian, kedisiplinan, kehadiran) untuk kelas privat maupun kelompok, lewat form publik yang bisa diakses tanpa login.
- **💳 Rekap Pembayaran** — Halaman rekap terpisah untuk kelas privat & kelompok, melacak status bayar orang tua dan fee tutor per periode, termasuk tampilan rekap gabungan lintas bulan.
- **🧾 Struk Pembayaran (PNG)** — Generate struk pembayaran sebagai gambar PNG yang bisa diunduh langsung (menggunakan `html-to-image`).
- **🖼️ Poster Generator** — Membuat poster promosi siswa secara otomatis menggunakan HTML Canvas.
- **📊 Dashboard & Grafik** — Ringkasan data dan visualisasi menggunakan ApexCharts.
- **📱 Normalisasi Nomor Telepon** — Utility khusus untuk menyimpan nomor HP orang tua/tutor dalam format standar dengan kode negara.

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| Autentikasi | BetterAuth (Prisma Adapter, RBAC, Google OAuth) |
| Grafik | ApexCharts / react-apexcharts |
| Export Gambar | html-to-image, HTML Canvas (poster) |
| Validasi | Zod |
| Deployment | Vercel |

## 🏗️ Keputusan Arsitektur

- **Server Actions** dipakai untuk mutasi data (create/update/delete), bukan REST API routes — lebih ringkas untuk kebutuhan admin panel internal.
- **`revalidatePath()`** dipakai untuk invalidasi cache setelah mutasi, alih-alih memaksa `force-dynamic` di semua halaman.
- **Model `Kelompok`** dipisah dari `Kelas` privat: satu kelompok menghubungkan banyak siswa ke satu tutor, dengan opsi harga per-anggota individual (`AnggotaKelompok.hargaPrivat`) maupun harga kelompok flat (`Kelompok.hargaKelompok`) — sementara data siswa tetap tercatat sebagai record individual di kedua model.
- **Laporan periodik** (`LaporanBulanan` / `LaporanKelompok`) mendukung tipe bulanan maupun mingguan (`tipePeriode`, `mingguKe`) dalam satu skema yang sama.
- Database development & production dipisah untuk mencegah data testing bocor ke production.

## 📸 Screenshot

| Dashboard |
|---|
| <img width="1920" height="1080" alt="Screenshot 2026-08-15 120741" src="https://github.com/user-attachments/assets/6d1b980e-f05e-49c9-aca6-a50468021ccd" /> |
| Data Siswa | 
|---|
| <img width="1920" height="1080" alt="Screenshot 2026-08-15 120912" src="https://github.com/user-attachments/assets/4821c301-4d47-4314-8727-e20c560e606f" /> |
| Rekap Pembayaran |
|---|
| <img width="1920" height="1080" alt="Screenshot 2026-08-15 120931" src="https://github.com/user-attachments/assets/7461883d-f611-4c5b-b9c0-27a1ca3e4568" /> |


## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 18+
- Database PostgreSQL (rekomendasi: [Neon](https://neon.tech/))

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/rafiach/admin-bimbel-cermat.git
cd admin-bimbel-cermat

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env.local
```

Isi `.env.local`:

```env
BETTER_AUTH_SECRET=      # secret acak untuk BetterAuth
BETTER_AUTH_URL=         # URL aplikasi, mis. http://localhost:3000
NEXT_PUBLIC_APP_URL=     # sama dengan di atas
GOOGLE_CLIENT_ID=        # (opsional) untuk login Google
GOOGLE_CLIENT_SECRET=    # (opsional) untuk login Google
DATABASE_URL=            # connection string PostgreSQL
```

```bash
# 4. Migrasi database & generate Prisma client
npx prisma migrate dev

# 5. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Script Berguna

| Command | Fungsi |
|---|---|
| `npm run db:studio` | Membuka Prisma Studio untuk browsing data |
| `npm run db:migrate` | Membuat & menjalankan migrasi baru |
| `npm run auth:generate` | Generate ulang schema BetterAuth ke Prisma |

## 🗺️ Roadmap

- [ ] Notifikasi otomatis (WhatsApp/email) untuk pengingat pembayaran
- [ ] Export rekap ke Excel/PDF
- [ ] Dashboard analitik pertumbuhan siswa per periode

## 👤 Author

- **Rafi Achmad** — [@rafiach](https://github.com/rafiach)

---

> Dibangun di atas template [NextAdmin](https://nextadmin.co/) (Next.js Admin Dashboard), dikustomisasi penuh untuk kebutuhan operasional Bimbel Cermat.
