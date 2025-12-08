"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Tag, Layers, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailDialog({ product, isOpen, onClose }: ProductDetailDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!product) return null;

  const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const currentImage = selectedImage || allImages[0];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setSelectedImage(null);
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold pr-12">{product.name}</DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2">
                <Tag className="h-3 w-3" />
                {product.category.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="absolute top-10 right-4 z-10">
          <Badge variant={product.isReadyStock ? "default" : "outline"}>{product.isReadyStock ? "Ready Stock" : "Pre-Order"}</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square relative rounded-xl overflow-hidden border bg-muted shadow-sm">
                <Image src={currentImage} alt={product.name} fill className="object-cover" priority />
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={cn("relative aspect-square rounded-lg overflow-hidden border-2 transition-all", currentImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/50")}
                    >
                      <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Info className="h-4 w-4" /> Deskripsi Produk
                </h3>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/30 p-4 rounded-lg border">{product.description}</div>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Layers className="h-4 w-4" /> Spesifikasi Teknis
                </h3>
                <div className="prose prose-sm max-w-none text-muted-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap bg-slate-950 text-slate-50 p-4 rounded-lg border shadow-inner">{product.specifications}</div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Dibuat</p>
                    <p>{new Date(product.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">ID Produk</p>
                    <p className="font-mono text-xs truncate max-w-[120px]" title={product.id}>
                      {product.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
