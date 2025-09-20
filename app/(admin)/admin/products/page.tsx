'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateProductButton } from "@/components/admin/products/create-product-button";
import { ProductTable } from '@/components/admin/products/product-table';
import { ProductDetailDialog } from '@/components/admin/products/product-detail-dialog';
import { EditProductDialog } from '@/components/admin/products/edit-product-dialog';

export default function ProductManagementPage() {
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [trashedProducts, setTrashedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [activeRes, trashedRes] = await Promise.all([
        fetch('/api/products?status=active'),
        fetch('/api/products?status=trashed')
      ]);
      if (!activeRes.ok || !trashedRes.ok) throw new Error('Gagal memuat data produk');

      const activeData = await activeRes.json();
      const trashedData = await trashedRes.json();

      setActiveProducts(activeData.data);
      setTrashedProducts(trashedData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => fetchProducts();

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

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Aktif ({activeProducts.length})</TabsTrigger>
            <TabsTrigger value="trashed">Sampah ({trashedProducts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <ProductTable 
                    variant="active"
                    products={activeProducts} 
                    isLoading={isLoading} 
                    error={error} 
                    onEditClick={handleEditClick} 
                    onViewClick={handleViewClick}
                    onRefresh={fetchProducts}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trashed" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <ProductTable 
                    variant="trashed"
                    products={trashedProducts} 
                    isLoading={isLoading} 
                    error={error} 
                    onEditClick={handleEditClick} 
                    onViewClick={handleViewClick}
                    onRefresh={fetchProducts}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProductDetailDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} product={selectedProduct} />
      <EditProductDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSuccess={handleSuccess} />
    </>
  );
}
