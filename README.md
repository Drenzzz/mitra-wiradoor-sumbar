# Website Profil & E-Katalog Wiradoor Sumatera Barat

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)

Website Profil Perusahaan dan E-Katalog untuk **MR Konstruksi** sebagai distributor resmi **Wiradoor** di Sumatera Barat. Sistem ini menggabungkan _Digital Showroom_, _Inquiry System_, dan _Guest Checkout_ dengan konfirmasi pembayaran manual via WhatsApp.

## Status Pengembangan

- [x] Sistem Keranjang Belanja (Cart) global dengan Zustand + localStorage persistence
- [x] Guest Checkout tanpa perlu login, redirect ke WhatsApp untuk konfirmasi
- [x] Panel Admin lengkap (Dashboard, Produk, Kategori, Artikel, Order, Inquiry, Portfolio, Users)
- [x] Manajemen Pesanan dengan status pipeline (Pending → Processed → Shipped → Completed)
- [x] Role-Based Access Control (Admin & Staff)
- [x] SEO Optimized (Meta tags, JSON-LD, Sitemap, Robots)
- [x] Export laporan ke PDF & Excel
- [x] Email notification system

## Fitur Utama

### Panel Admin (`/admin`)

| Fitur              | Deskripsi                                     |
| ------------------ | --------------------------------------------- |
| Dashboard Analitik | Statistik order, produk terlaris, grafik tren |
| Manajemen Produk   | CRUD produk dengan galeri foto (Cloudinary)   |
| Manajemen Kategori | Kategori produk dengan soft delete            |
| Order Management   | Update status pesanan, input harga deal       |
| Inquiry Tracking   | Kelola pesan masuk dari pelanggan             |
| CMS Artikel        | Rich Text Editor (TipTap) untuk artikel SEO   |
| Portfolio          | Showcase proyek yang sudah dikerjakan         |
| User Management    | Kelola akun Admin & Staff                     |
| Reports            | Export data ke PDF/Excel                      |

### Halaman Publik (Guest)

| Fitur            | Deskripsi                                            |
| ---------------- | ---------------------------------------------------- |
| Digital Showroom | Katalog produk dengan filter, search, dan pagination |
| Product Detail   | Galeri foto, spesifikasi, tombol inquiry/cart        |
| Guest Checkout   | Form checkout → Order tercatat → Redirect WhatsApp   |
| Order Tracking   | Cek status pesanan via nomor invoice                 |
| Artikel/Blog     | Konten edukasi untuk SEO                             |
| Portfolio        | Galeri proyek yang telah selesai                     |
| Tentang Kami     | Profil perusahaan dengan Bento Grid layout           |
| Kontak/Inquiry   | Form pesan ke admin                                  |

## Tumpukan Teknologi

| Kategori         | Teknologi                                  |
| ---------------- | ------------------------------------------ |
| Framework        | Next.js 16 (App Router + Turbopack)        |
| React            | React 19 + React Compiler                  |
| Bahasa           | TypeScript (Strict Mode)                   |
| Styling          | Tailwind CSS 4 + shadcn/ui                 |
| Animasi          | Framer Motion                              |
| Ikon             | Lucide React                               |
| Database         | PostgreSQL                                 |
| ORM              | Drizzle ORM                                |
| Otentikasi       | NextAuth.js v4                             |
| Validasi Form    | React Hook Form + Zod                      |
| State Management | Zustand (Client) + TanStack Query (Server) |
| Notifikasi       | Sonner                                     |
| Upload Gambar    | Cloudinary                                 |
| Email            | Nodemailer + React Email                   |
| Charts           | Recharts                                   |
| Export           | jsPDF, xlsx                                |
| Package Manager  | pnpm                                       |

## Instalasi & Konfigurasi Lokal

### Prasyarat

- Node.js v18+
- pnpm
- Git
- PostgreSQL (local atau cloud seperti Supabase/Neon)
- Akun Cloudinary (untuk upload media)

### Langkah Instalasi

```bash
git clone https://github.com/Drenzzz/mitra-wiradoor-sumbar.git
cd mitra-wiradoor-sumbar

pnpm install

cp .env.example .env
```

Edit file `.env` dengan konfigurasi:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

```bash
pnpm db:push

pnpm db:seed

pnpm dev
```

Buka `http://localhost:3000` untuk halaman publik dan `http://localhost:3000/login` untuk akses admin.

## Skrip pnpm

| Skrip              | Deskripsi                                  |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Menjalankan development server (Turbopack) |
| `pnpm build`       | Build produksi                             |
| `pnpm start`       | Menjalankan hasil build                    |
| `pnpm lint`        | Menjalankan ESLint                         |
| `pnpm db:generate` | Generate migration Drizzle                 |
| `pnpm db:migrate`  | Jalankan migration                         |
| `pnpm db:push`     | Push schema ke database                    |
| `pnpm db:studio`   | Buka Drizzle Studio                        |
| `pnpm db:seed`     | Seed data awal (admin user)                |
| `pnpm db:adduser`  | Tambah user baru via CLI                   |

### Contoh Menambah User

```bash
pnpm db:adduser user@example.com "Nama Lengkap" password123 STAF
```

Role yang tersedia: `ADMIN` atau `STAF`

## Struktur Folder

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/            # Admin route group
│   ├── (guest)/            # Public route group
│   └── api/                # API routes
├── components/
│   ├── admin/              # Komponen admin
│   ├── guest/              # Komponen publik
│   └── ui/                 # shadcn/ui components
├── db/
│   ├── schema/             # Drizzle schema
│   └── migrations/         # Database migrations
├── hooks/                  # Custom React hooks
├── lib/
│   ├── services/           # Business logic
│   └── validations/        # Zod schemas
├── types/                  # TypeScript types
└── emails/                 # React Email templates
```

## Alur Transaksi

```
Guest Add to Cart → Checkout Form → Order Tersimpan (PENDING)
    ↓
Redirect ke WhatsApp dengan template pesan
    ↓
Admin terima bukti transfer → Update status di Dashboard
    ↓
Order diproses → Status: PROCESSED → SHIPPED → COMPLETED
```

---

**Dikembangkan oleh:** Muhammad Naufal Nazya Azzharif  
