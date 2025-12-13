"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, ShoppingCart, Share2, ShieldCheck, Truck, Phone } from "lucide-react";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/guest/product/add-to-cart-button";

interface ProductInfoProps {
  product: Product & { isReadyStock?: boolean };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const whatsappMessage = `Halo, saya tertarik dengan produk: ${product.name}`;
  const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tautan produk disalin ke clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
            {product.category.name}
          </Badge>
          <Badge variant={product.isReadyStock ? "default" : "outline"} className="text-sm font-medium px-3 py-1">
            {product.isReadyStock ? "Ready Stock" : "Pre-Order"}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>ID: {product.id}</span>
          <span>•</span>
          <span>Diperbarui: {new Date(product.updatedAt).toLocaleDateString("id-ID")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-xl border">
        <span className="text-sm text-muted-foreground font-medium">Harga Terbaik</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">Hubungi Kami</span>
          <span className="text-sm text-muted-foreground">via WhatsApp</span>
        </div>
        <p className="text-xs text-muted-foreground">*Harga dapat berubah sewaktu-waktu tergantung spesifikasi dan kustomisasi.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {product.isReadyStock ? (
          <AddToCartButton product={product} size="lg" className="flex-1 h-12 text-base" />
        ) : (
          <Button size="lg" className="flex-1 h-12 text-base" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Pesan Kustom
            </a>
          </Button>
        )}

        <Button size="lg" variant="outline" className="flex-1 h-12 text-base" asChild>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Phone className="mr-2 h-5 w-5" />
            Tanya Detail
          </a>
        </Button>

        <Button size="icon" variant="secondary" className="h-12 w-12 shrink-0" onClick={handleShare} title="Bagikan">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger className="text-base font-semibold">Deskripsi Produk</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="specifications">
          <AccordionTrigger className="text-base font-semibold">Spesifikasi Teknis</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none font-mono text-xs bg-muted p-4 rounded-lg border">{product.specifications}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
