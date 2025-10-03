# Website Profil & E-Katalog Wiradoor Sumatera Barat

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

Repositori ini berisi kode sumber untuk proyek Website Profil Perusahaan dan E-Katalog untuk MR Konstruksi, distributor resmi Wiradoor di Sumatera Barat.

## ✨ Fitur Utama

Proyek ini dibagi menjadi dua bagian utama: Panel Admin yang aman dan Halaman Publik yang informatif.

### 🛡️ Panel Admin (`/admin`)
- **Otentikasi Aman**: Sistem login berbasis kredensial dengan peran (Admin/Staf) menggunakan NextAuth.js.
- **Dashboard Statistik**: Halaman utama yang menampilkan ringkasan data penting seperti jumlah produk, artikel, dan pesan baru (inquiry).
- **Manajemen Produk**: Fungsionalitas CRUD (Create, Read, Update, Delete) penuh untuk produk, lengkap dengan fitur *soft-delete* (memindahkan ke sampah) dan hapus permanen.
- **Manajemen Kategori**: CRUD penuh untuk kategori produk.
- **Manajemen Artikel**: CRUD penuh untuk artikel & kategori artikel, dengan sistem status (Draft/Published).
- **Manajemen Pengguna**: Admin dapat melakukan CRUD untuk akun Staf (menambah, melihat, mengedit, dan menghapus pengguna).  *(WIP)*
- **Manajemen Pesan Masuk**: Melihat dan mengelola semua pesan yang masuk dari formulir kontak publik, serta mengubah statusnya (Baru, Dibaca, Dibalas).  *(WIP)*
- **Manajemen Akun**: Pengguna dapat mengubah nama profil dan password melalui halaman pengaturan.
- **Desain Responsif**: Antarmuka yang dioptimalkan untuk desktop maupun perangkat mobile.
- **Tema Dinamis**: Pilihan antara mode terang (Light Mode) dan gelap (Dark Mode).

### 🌐 Halaman Publik (Guest)
- **Halaman Beranda**: Menampilkan `Hero Section`, keunggulan produk, dan daftar produk unggulan. *(WIP)*
- **Katalog Produk**: Halaman untuk menampilkan semua produk dengan fitur pencarian dan filter. *(WIP)*
- **Daftar Artikel**: Halaman untuk menampilkan semua artikel yang sudah dipublikasikan. *(WIP)*
- **Halaman Detail**: Halaman dinamis untuk menampilkan detail spesifik dari satu produk atau artikel. *(WIP)*
- **Halaman Statis**: Halaman "Tentang Kami" dan "Kontak". *(WIP)*

## 🚀 Tumpukan Teknologi (Tech Stack)

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) 15 (App Router) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Animasi** | [Framer Motion](https://www.framer.com/motion/) |
| **Ikon** | [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (via MongoDB Atlas) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Otentikasi** | [NextAuth.js](https://next-auth.js.org/) |
| **Validasi Form** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) |
| **Notifikasi** | [Sonner](https://sonner.emilpriv.dev/) (Toast Notifications) |
| **Upload Gambar** | [Cloudinary](https://cloudinary.com/) |
| **Pengiriman Email** | [Nodemailer](https://nodemailer.com/) |
| **Package Manager**| [pnpm](https://pnpm.io/) |


## ⚙️ Instalasi & Konfigurasi Lokal

Berikut adalah panduan untuk menyiapkan dan menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/)
- Akun [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Akun [Cloudinary](https://cloudinary.com/users/register/free)

### Langkah-langkah Instalasi
1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/Drenzzz/mitra-wiradoor-sumbar.git
    cd mitra-wiradoor-sumbar
    ```

2.  **Instal semua dependencies:**
    ```bash
    pnpm install
    ```

3.  **Siapkan file environment (`.env`):**
    Salin file `.env.example` menjadi `.env` lalu isi semua variabel yang dibutuhkan.
    ```bash
    cp .env.example .env
    ```

4.  **Isi variabel environment di file `.env`:**

5.  **Sinkronisasi Skema Database:**
    Perintah ini akan menerapkan skema dari `prisma/schema.prisma` ke database MongoDB Anda.
    ```bash
    pnpm prisma db push
    ```

6.  **Buat Pengguna Admin Pertama (Seeding):**
    Perintah ini akan membuat satu pengguna dengan peran `ADMIN` agar Anda bisa login.
    ```bash
    pnpm prisma:seed
    ```

7.  **Jalankan Server Pengembangan:**
    ```bash
    pnpm dev
    ```

Sekarang, buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya. Halaman login admin ada di [http://localhost:3000/login](http://localhost:3000/login).

## 📜 Skrip yang Tersedia

* `pnpm dev`: Menjalankan aplikasi dalam mode pengembangan.
* `pnpm build`: Membangun aplikasi untuk mode produksi.
* `pnpm start`: Menjalankan aplikasi yang sudah di-build.
* `pnpm lint`: Menjalankan linter untuk memeriksa kualitas kode.
* `pnpm prisma:generate`: Meng-generate ulang Prisma Client setelah ada perubahan skema.
* `pnpm prisma:seed`: Menjalankan script seed untuk membuat data awal (pengguna admin).
* `pnpm db:adduser`: Script kustom untuk menambah user baru melalui terminal.
