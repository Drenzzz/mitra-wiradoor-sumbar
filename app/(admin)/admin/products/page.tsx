// app/(admin)/admin/products/page.tsx
'use client';

// Nanti kita akan tambahkan custom hook untuk mengelola state di sini

import { CreateProductButton } from "@/components/admin/products/create-product-button";

export default function ProductManagementPage() {

  const handleSuccess = () => {
    console.log("Product created! Time to refresh the table.");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-muted-foreground">
            Kelola semua produk di katalog Anda di sini.
          </p>
        </div>
        <div className="w-full sm:w-auto self-end sm:self-center">
          {/* Tombol tambah produk */}
          <CreateProductButton onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Tabel Produk */}
      <div className="border rounded-lg p-4 min-h-[400px]">
        <p className="text-center text-muted-foreground">Tabel data produk akan muncul di sini...</p>
      </div>
    </div>
  );
}