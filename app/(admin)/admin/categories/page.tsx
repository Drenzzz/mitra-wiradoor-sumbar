import { CreateCategoryButton } from "@/components/admin/categories/create-category-button";
import { Separator } from "@/components/ui/separator";

export default function CategoryManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Manajemen Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua kategori produk Anda di sini.
          </p>
        </div>
        <CreateCategoryButton />
      </div>
      <Separator />

      {/* Tabel untuk menampilkan daftar kategori akan kita buat di commit selanjutnya */}
      <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg h-96 flex items-center justify-center">
          <p className="text-muted-foreground">Tabel data kategori akan muncul di sini.</p>
      </div>
    </div>
  );
}