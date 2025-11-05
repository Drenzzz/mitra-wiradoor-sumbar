'use client';

import { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailDialog({ product, isOpen, onClose }: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Detail lengkap untuk produk <Badge variant="secondary">{product.category.name}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Deskripsi</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Spesifikasi Teknis</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.specifications}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Status Produk</h3>
              <Badge variant={product.isReadyStock ? 'default' : 'secondary'}>
                {product.isReadyStock ? 'Ready Stock' : 'Kustom (Pre-Order)'}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Info Lainnya</h3>
              <p className="text-xs text-muted-foreground">
                Dibuat pada: {new Date(product.createdAt).toLocaleDateString('id-ID')}
                <br />
                Diperbarui pada: {new Date(product.updatedAt).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
