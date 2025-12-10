# Website Profil & E-Katalog Wiradoor Sumatera Barat

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

Repositori ini berisi kode sumber Website Profil Perusahaan dan E-Katalog untuk MR Konstruksi sebagai distributor resmi Wiradoor di Sumatera Barat. Sistem ini dirancang untuk memfasilitasi pemasaran digital, manajemen produk, dan pemesanan pelanggan (B2C/B2B).

## Status Pengembangan

- [x] **Sistem Keranjang Belanja (Cart)** global menggunakan Zustand dengan persistensi data.
- [x] **Guest Checkout** untuk memesan banyak barang sekaligus tanpa perlu login.
- [x] **Panel Admin** lengkap (Dashboard, Produk, Kategori, Artikel, Order, Pengguna).
- [x] **Manajemen Pesanan** di sisi admin (Lihat detail, Proses harga deal, Update status).
- [x] **Optimasi UI/UX** (Sidebar persisten, loading states, skeleton loader).
- [x] **Halaman publik** (landing page) dengan tampilan yang stylish dan elegan.

## Fitur Utama

### Panel Admin (`/admin`)

- **Dashboard Analitik:** Visualisasi data penjualan, statistik pengunjung, dan tren produk terlaris.
- **Manajemen Produk Lengkap:** CRUD Produk, Kategori, Galeri Foto (Cloudinary), dan Stok.
- **Order Management:** Pemantauan status pesanan (Pending -> Paid -> Processed -> Completed).
- **Inquiry & Lead Tracking:** Pusat pengelolaan pesan masuk dari pelanggan.
- **CMS Artikel:** Editor teks kaya (_Rich Text Editor_) untuk menulis artikel SEO.
- **Role-Based Access Control:** Pembedaan hak akses antara Super Admin dan Staff.

### Halaman Publik (Guest)

- **Digital Showroom Premium:** Katalog produk dengan _filtering_, pencarian, dan tampilan visual _high-end_.
- **Hybrid Checkout System:** Alur pemesanan fleksibel tanpa wajib login (Guest Checkout). Pesanan tercatat di database sistem sebelum diarahkan ke WhatsApp untuk finalisasi pembayaran manual.
- **Project Inquiry:** Keranjang belanja difungsikan sebagai "Inquiry List" untuk memudahkan kontraktor menyusun RAB.
- **Editorial Journal:** Modul artikel/blog untuk edukasi pelanggan mengenai material pintu.
- **Corporate Profile:** Halaman "Tentang Kami" interaktif dengan visualisasi data perusahaan (_Bento Grid_).

## Tumpukan Teknologi

| Kategori         | Teknologi                                      |
| ---------------- | ---------------------------------------------- |
| Framework        | Next.js 16 (App Router)                        |
| Bahasa           | TypeScript                                     |
| Styling          | Tailwind CSS, shadcn/ui                        |
| Animasi          | Framer Motion                                  |
| Ikon             | Lucide React                                   |
| Database         | MongoDB Atlas                                  |
| ORM              | Prisma                                         |
| Otentikasi       | NextAuth.js                                    |
| Validasi Form    | React Hook Form, Zod                           |
| State Management | Zustand (Cart) + TanStack Query (Server State) |
| Notifikasi       | Sonner                                         |
| Upload Gambar    | Cloudinary                                     |
| Email            | Nodemailer                                     |
| Package Manager  | pnpm                                           |

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
