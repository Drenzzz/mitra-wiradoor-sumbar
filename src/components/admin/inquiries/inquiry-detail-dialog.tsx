"use client";

import { Inquiry } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InquiryStatus } from "@/db/schema";
import { cn } from "@/lib/utils";
import { MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";

const formatDate = (dateString: Date) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusVariantMap: Record<InquiryStatus, "default" | "secondary" | "outline"> = {
  NEW: "default",
  READ: "secondary",
  REPLIED: "outline",
};

interface InquiryDetailDialogProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
}

export function InquiryDetailDialog({ inquiry, isOpen, onClose, onStatusChange }: InquiryDetailDialogProps) {
  if (!inquiry) return null;

  const handleWhatsAppReply = () => {
    if (!inquiry.senderPhone) return;

    let phone = inquiry.senderPhone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    const message = `Halo Bapak/Ibu ${inquiry.senderName}, 

Terima kasih telah menghubungi Wiradoor Sumatera Barat.
Menanggapi pertanyaan Anda mengenai: "${inquiry.subject}"

[Tulis jawaban Anda di sini]

Terima kasih.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    if (inquiry.status !== "REPLIED") {
      onStatusChange(inquiry.id, "REPLIED");
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Detail Pesan Masuk</DialogTitle>
          <DialogDescription>
            ID: <span className="font-mono text-xs">{inquiry.id.slice(-8)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Badge variant={statusVariantMap[inquiry.status]} className={cn("text-sm px-3 py-1", inquiry.status === "NEW" && "animate-pulse")}>
              {inquiry.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatDate(inquiry.createdAt)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm break-all">{inquiry.senderEmail}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> WhatsApp
              </p>
              <p className="text-sm">{inquiry.senderPhone || "-"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight">{inquiry.subject}</h3>
            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md whitespace-pre-wrap border">{inquiry.message}</div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handleWhatsAppReply} disabled={!inquiry.senderPhone} className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <MessageCircle className="w-4 h-4" />
            Balas via WhatsApp
            <ExternalLink className="w-3 h-3 opacity-70" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
