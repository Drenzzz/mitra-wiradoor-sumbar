"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const pathname = usePathname();
  const [isCopied, setIsCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}${pathname}` : "";

  const handleCopyLink = () => {
    if (!navigator.clipboard) {
      toast.error("Browser Anda tidak mendukung fitur salin link.");
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        toast.success("Link berhasil disalin ke clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Gagal menyalin link.");
      });
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20-%20${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs text-muted-foreground">Bagikan:</p>

      <Button variant="outline" size="icon" asChild>
        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Bagikan ke WhatsApp">
          <MessageCircle className="h-4 w-4" />
        </a>
      </Button>

      <Button variant="outline" size="icon" onClick={handleCopyLink} aria-label="Salin link">
        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
