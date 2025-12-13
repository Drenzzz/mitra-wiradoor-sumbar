"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import type { CartItem } from "@/hooks/use-cart";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  isFromCart: boolean;
  loading: boolean;
  onRemoveItem?: (id: string) => void;
}

export function CheckoutOrderSummary({ items, isFromCart, loading, onRemoveItem }: CheckoutOrderSummaryProps) {
  return (
    <div className="sticky top-32 space-y-6">
      <Card className="border-0 shadow-xl bg-slate-900 text-white overflow-hidden">
        <CardHeader className="bg-slate-800/50 pb-4">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Ringkasan Inquiry</span>
            <span className="text-sm font-normal text-slate-400">{items.length} Item</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  <Image src={item.imageUrl || "/placeholder-image.jpg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-200 truncate">{item.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">Qty: {item.quantity} unit</p>
                </div>
                {isFromCart && onRemoveItem && (
                  <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)} className="text-slate-500 hover:text-red-400 hover:bg-slate-800 -mr-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        <Separator className="bg-slate-700" />

        <CardFooter className="p-6 bg-slate-800/30 flex flex-col gap-4">
          <div className="text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg flex gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Harga dan ongkir akan diinformasikan oleh tim kami melalui WhatsApp setelah pesanan dibuat.</span>
          </div>

          <Button type="submit" form="checkout-form" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-semibold shadow-lg shadow-orange-900/20">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
              </>
            ) : (
              <>
                Kirim Permintaan <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
