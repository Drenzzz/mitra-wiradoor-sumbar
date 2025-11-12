# Website Profil & E-Katalog Wiradoor Sumatera Barat

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

Repositori ini berisi kode sumber Website Profil Perusahaan dan E-Katalog untuk MR Konstruksi sebagai distributor resmi Wiradoor di Sumatera Barat. Proyek masih dalam tahap pengembangan aktif (WIP).

## Status Singkat
- [x] Panel admin dasar (auth, dashboard, produk, kategori, artikel) sudah fungsional.
- [x] Alur pemesanan guest untuk produk ready stock sudah bisa digunakan sampai halaman sukses + WhatsApp follow-up.
- [ ] Manajemen transaksi di sisi admin belum tersedia; pencatatan baru terjadi via API guest.
- [ ] Halaman publik (beranda, katalog produk, daftar artikel) masih berupa versi awal.

## Fitur Utama

### Panel Admin (`/admin`)
- Otentikasi berbasis NextAuth dengan peran Admin/Staf.
- Dashboard ringkasan data produk, artikel, dan pesan.
- CRUD produk lengkap dengan *soft delete* serta opsi hapus permanen.
- CRUD kategori produk.
- CRUD artikel dan kategori artikel dengan status Draft/Published.
- Pengaturan akun (ubah nama dan sandi).
- Desain responsif dengan dukungan mode gelap/terang.
- **WIP:** Manajemen pengguna staf (CRUD) masih dalam pengerjaan.
- **WIP:** Inbox pesan dari publik hanya tercatat; UI pengelolaannya belum selesai.
- **WIP:** Modul monitoring transaksi/order di panel admin belum tersedia.

### Halaman Publik (Guest)
- Halaman detail produk dinamis termasuk daftar produk terkait.
- Form pemesanan khusus produk *ready stock* dengan validasi Zod + React Hook Form.
- Endpoint API `POST /api/orders` untuk membuat order guest beserta item otomatis dan nomor invoice unik.
- Halaman sukses pemesanan (`/order/success/[orderId]`) dengan ringkasan order serta CTA konfirmasi via WhatsApp.
- Integrasi tombol WhatsApp dari halaman produk untuk konsultasi/pemesanan kustom.
- **WIP:** Landing page/beranda, katalog produk dengan filter penuh, daftar artikel, dan halaman statis masih disempurnakan kontennya.

## Tumpukan Teknologi

| Kategori | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Animasi | Framer Motion |
| Ikon | Lucide React |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Otentikasi | NextAuth.js |
| Validasi Form | React Hook Form, Zod |
| Notifikasi | Sonner |
| Upload Gambar | Cloudinary |
| Email | Nodemailer |
| Package Manager | pnpm |

## Instalasi & Konfigurasi Lokal

### Prasyarat
- Node.js v18+
- pnpm
- Git
- Akun MongoDB Atlas & Cloudinary (untuk koneksi DB dan upload media)

### Langkah
1. Clone repo lalu masuk ke folder proyek.
   ```bash
   git clone https://github.com/Drenzzz/mitra-wiradoor-sumbar.git
   cd mitra-wiradoor-sumbar
   ```
2. Instal dependensi.
   ```bash
   pnpm install
   ```
3. Salin `.env.example` menjadi `.env` lalu isi seluruh variabel (MongoDB, NextAuth, Cloudinary, kredensial email, dll).
   ```bash
   cp .env.example .env
   ```
4. Sinkronkan skema Prisma ke MongoDB.
   ```bash
   pnpm prisma db push
   ```
5. Jalankan seed untuk membuat akun admin awal.
   ```bash
   pnpm prisma:seed
   ```
6. Mulai server pengembangan.
   ```bash
   pnpm dev
   ```

Buka `http://localhost:3000` untuk halaman publik dan `http://localhost:3000/login` untuk akses admin.

## Skrip pnpm

- `pnpm dev` - Menjalankan Next.js dalam mode pengembangan (Turbopack).
- `pnpm build` - Build produksi.
- `pnpm start` - Menjalankan hasil build.
- `pnpm lint` - Menjalankan ESLint.
- `pnpm prisma:generate` - Generate Prisma Client.
- `pnpm prisma:push` - Sinkron Prisma schema ke database.
- `pnpm prisma:seed` - Menjalankan seed akun admin.
- `pnpm db:adduser` - Skrip CLI untuk menambah user admin/staf baru.
