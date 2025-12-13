"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
}

export function AddToCartButton({ product, className, ...props }: AddToCartButtonProps) {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(product);
    toast.success("Produk ditambahkan ke keranjang");
  };

  return (
    <Button onClick={onAddToCart} className={cn("w-full gap-2", className)} {...props}>
      <ShoppingCart className="h-5 w-5" />
      Tambah ke Keranjang
    </Button>
  );
}
