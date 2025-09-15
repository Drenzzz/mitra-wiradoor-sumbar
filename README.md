# Website Wiradoor Sumatera Barat

Ini adalah proyek pengembangan website profil perusahaan dan e-katalog untuk MR Konstruktor, distributor resmi Wiradoor di Sumatera Barat. Proyek ini dibuat menggunakan Next.js dan terhubung dengan database MongoDB.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (dengan App Router)
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **UI:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Ikon:** [Heroicons](https://heroicons.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) (via MongoDB Atlas)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Package Manager:** [pnpm](https://pnpm.io/)

---

## Getting Started

Berikut adalah panduan untuk menyiapkan dan menjalankan proyek ini di lingkungan lokal.

### Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut di komputer Anda:
* [Node.js](https://nodejs.org/) (v18 atau lebih baru)
* [pnpm](https://pnpm.io/installation)
* [Git](https://git-scm.com/)
* Akun [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (tier gratis sudah cukup)

### Instalasi & Konfigurasi

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/Drenzzz/mitra-wiradoor-sumbar.git
    cd mitra-wiradoor-sumbar
    ```

2.  **Instal semua dependencies:**
    ```bash
    pnpm install
    ```

3.  **Siapkan file environment:**
    Buat salinan dari file `.env.example` dan beri nama `.env`.
    ```bash
    cp .env.example .env
    ```

4.  **Hubungkan ke Database MongoDB:**
    * Login ke akun MongoDB Atlas Anda dan dapatkan **Connection String** untuk cluster Anda.
    * Buka file `.env` dan ganti `DATABASE_URL` dengan *connection string* yang sudah Anda salin. Jangan lupa untuk mengganti `<password>` dengan password database user Anda.

5.  **Sinkronisasi Skema Database:**
    Perintah ini akan membaca file `prisma/schema.prisma` dan memastikan Prisma Client Anda sinkron.
    ```bash
    pnpm prisma generate
    ```

6.  **Jalankan Server Pengembangan:**
    ```bash
    pnpm dev
    ```

Sekarang, buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 📜 Skrip yang Tersedia

* `pnpm dev`: Menjalankan aplikasi dalam mode pengembangan.
* `pnpm build`: Membangun aplikasi untuk mode produksi.
* `pnpm start`: Menjalankan aplikasi yang sudah di-build.
