# Website Profil & E-Katalog Wiradoor Sumatera Barat

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

Repositori ini berisi kode sumber Website Profil Perusahaan dan E-Katalog untuk MR Konstruksi sebagai distributor resmi Wiradoor di Sumatera Barat. Sistem ini dirancang untuk memfasilitasi pemasaran digital, manajemen produk, dan pemesanan pelanggan (B2C/B2B).

## Status Pengembangan
- [x] **Sistem Keranjang Belanja (Cart)** global menggunakan Zustand dengan persistensi data.
- [x] **Guest Checkout** untuk memesan banyak barang sekaligus tanpa perlu login.
- [x] **Panel Admin** lengkap (Dashboard, Produk, Kategori, Artikel, Order, Pengguna).
- [x] **Manajemen Pesanan** di sisi admin (Lihat detail, Proses harga deal, Update status).
- [x] **Optimasi UI/UX** (Sidebar persisten, loading states, skeleton loader).
- [ ] Halaman publik (landing page) masih dalam penyempurnaan konten.

## Fitur Utama

### Panel Admin (`/admin`)
- **Otentikasi Aman:** Login berbasis NextAuth dengan peran Admin (Full Access) dan Staf (Limited).
- **Dashboard Analitik:** Ringkasan statistik produk, pendapatan, dan tren penjualan.
- **Manajemen Produk & Katalog:** CRUD lengkap dengan dukungan *soft delete*, *restore*, dan upload gambar ke Cloudinary.
- **Manajemen Pesanan (Order):** 
  - Melihat pesanan masuk dari guest.
  - Memproses pesanan dengan input "Harga Kesepakatan" (Deal Price).
  - Mengubah status pesanan (Pending -> Processed -> Shipped -> Completed).
- **Konten Blog/Artikel:** Editor artikel untuk keperluan SEO dan edukasi pelanggan.
- **Manajemen Pengguna:** Admin dapat mengelola akun staf.
- **Optimasi UI:** Sidebar navigasi persisten (tidak re-render) menggunakan Layout terpisah dan Zustand store.

### Halaman Publik (Guest)
- **E-Katalog Produk:** Daftar produk dengan filter kategori dan pencarian.
- **Keranjang Belanja (Shopping Cart):** - User dapat menambahkan berbagai produk *ready stock* ke keranjang.
  - Data keranjang tersimpan di browser (localStorage).
  - Indikator jumlah item di navbar.
- **Checkout Multi-Item:** Formulir pemesanan tunggal untuk semua item di keranjang.
- **WhatsApp Integration:** - Konfirmasi pesanan otomatis via WhatsApp setelah checkout sukses.
  - Tombol konsultasi khusus untuk produk *custom order*.
- **Inquiry Form:** Formulir kontak umum untuk pertanyaan non-transaksi.

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
  - Contoh: pnpm db:adduser user@test.com "Nama User" password123 STAF
