"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order } from "@/types";

interface ProcessOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number) => void;
  order: Order | null;
  isLoading: boolean;
}

export function ProcessOrderDialog({ isOpen, onClose, onConfirm, order, isLoading }: ProcessOrderDialogProps) {
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    onConfirm(parseFloat(price));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Proses Pesanan</DialogTitle>
          <DialogDescription>
            Masukkan harga kesepakatan (Deal Price) untuk pesanan <strong>{order?.invoiceNumber}</strong> sebelum memprosesnya.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dealPrice">Harga Kesepakatan (Rp)</Label>
              <Input id="dealPrice" type="number" placeholder="Contoh: 15000000" value={price} onChange={(e) => setPrice(e.target.value)} required min={0} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !price}>
              {isLoading ? "Memproses..." : "Simpan & Proses"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
