"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types";
import { MoreHorizontal, Pencil, Trash2, Eye, Undo, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePermission } from "@/hooks/use-permission";
import Link from "next/link";

interface ProductGridProps {
  variant: "active" | "trashed";
  products: Product[];
  isLoading: boolean;
  onEditClick: (product: Product) => void;
  onViewClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
  onRestoreClick: (product: Product) => void;
  onForceDeleteClick: (product: Product) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export function ProductGrid({ variant, products, isLoading, onEditClick, onViewClick, onDeleteClick, onRestoreClick, onForceDeleteClick }: ProductGridProps) {
  const { can } = usePermission();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">{variant === "active" ? "Belum ada produk." : "Tidak ada produk di sampah."}</div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants} layout>
          <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-muted">
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => onViewClick(product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/produk/${product.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview Web
                      </Link>
                    </DropdownMenuItem>
                    {variant === "active" ? (
                      <>
                        {can("product:edit") && (
                          <DropdownMenuItem onSelect={() => onEditClick(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {can("product:delete") && (
                          <DropdownMenuItem className="text-red-500" onSelect={() => onDeleteClick(product)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        )}
                      </>
                    ) : (
                      <>
                        {can("product:delete") && (
                          <>
                            <DropdownMenuItem onSelect={() => onRestoreClick(product)}>
                              <Undo className="mr-2 h-4 w-4" />
                              Pulihkan
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onSelect={() => onForceDeleteClick(product)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus Permanen
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {product.images && product.images.length > 1 && <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">+{product.images.length - 1}</div>}
            </div>
            <CardContent className="p-4 flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className="line-clamp-1 max-w-[70%]">
                  {product.category?.name || "N/A"}
                </Badge>
                <Badge variant={product.isReadyStock ? "default" : "secondary"} className="text-[10px] px-1.5 h-5">
                  {product.isReadyStock ? "Ready" : "PO"}
                </Badge>
              </div>
              <h3 className="font-semibold truncate" title={product.name}>
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
