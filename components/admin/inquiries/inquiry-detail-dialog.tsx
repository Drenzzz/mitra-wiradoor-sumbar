'use client';

import { Inquiry } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { InquiryStatus } from '@prisma/client';
import { cn } from '@/lib/utils';

const formatDate = (dateString: Date) => 
  new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
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
}

export function InquiryDetailDialog({ inquiry, isOpen, onClose }: InquiryDetailDialogProps) {
  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Detail Pesan Masuk</DialogTitle>
          <DialogDescription>
            Pesan dari: {inquiry.senderName} ({inquiry.senderEmail})
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{inquiry.subject}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge 
                variant={statusVariantMap[inquiry.status]} 
                className={cn(inquiry.status === 'NEW' && 'animate-pulse')} // Animasi pulse jika baru
              >
                {inquiry.status}
              </Badge>
              <span>{formatDate(inquiry.createdAt)}</span>
            </div>
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <h4 className="font-semibold">Isi Pesan:</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
