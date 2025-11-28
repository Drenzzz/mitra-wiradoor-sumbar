"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(product);
    toast.success("Produk ditambahkan ke keranjang");
  };

  return (
    <Button onClick={onAddToCart} className="w-full gap-2">
      <ShoppingCart className="h-4 w-4" />
      Tambah ke Keranjang
    </Button>
  );
}
