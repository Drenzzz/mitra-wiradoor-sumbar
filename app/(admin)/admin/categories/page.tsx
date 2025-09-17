import { CreateCategoryButton } from "@/components/admin/categories/create-category-button";
import { CategoryTable } from "@/components/admin/categories/category-table";
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

      <CategoryTable />
    </div>
  );
}