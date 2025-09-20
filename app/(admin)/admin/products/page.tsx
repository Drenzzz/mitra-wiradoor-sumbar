  "use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { CreateProductButton } from "@/components/admin/products/create-product-button";
import { ProductTable } from "@/components/admin/products/product-table";
import { ProductDetailDialog } from "@/components/admin/products/product-detail-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { EditProductDialog } from '@/components/admin/products/edit-product-dialog';

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Gagal memuat data produk");
      const data = await response.json();
      setProducts(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => {
    fetchProducts();
  };

  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };
  
  const handleEditClick = (product: Product) => {
      setSelectedProduct(product);
      setIsEditOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Produk</h1>
            <p className="text-muted-foreground">Kelola semua produk di katalog Anda di sini.</p>
          </div>
          <div className="w-full sm:w-auto self-end sm:self-center">
            <CreateProductButton onSuccess={handleSuccess} />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <ProductTable 
                products={products} 
                isLoading={isLoading} 
                error={error} 
                onEditClick={handleEditClick} 
                onViewClick={handleViewClick} 
            />
          </CardContent>
        </Card>
      </div>

      <ProductDetailDialog 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        product={selectedProduct} 
      />
      <EditProductDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </>
  );
}
