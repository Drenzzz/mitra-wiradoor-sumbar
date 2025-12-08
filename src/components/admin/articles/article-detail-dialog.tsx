"use client";

import { Article } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ArticleDetailDialogProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleDetailDialog({ article, isOpen, onClose }: ArticleDetailDialogProps) {
  if (!article) return null;

  const formatDate = (dateString: Date) => new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{article.title}</DialogTitle>
          <DialogDescription>
            Detail untuk artikel dalam kategori <Badge variant="secondary">{article.category.name}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="md:col-span-1 space-y-4">
            <div className="relative aspect-video">
              <Image src={article.featuredImageUrl} alt={article.title} fill className="rounded-md object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Status</h3>
              <Badge variant={article.status === "PUBLISHED" ? "default" : "secondary"}>{article.status}</Badge>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Penulis</h3>
              <p className="text-sm text-muted-foreground">{article.author.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Diterbitkan</h3>
              <p className="text-sm text-muted-foreground">{formatDate(article.createdAt)}</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-2">Konten Artikel</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{article.content}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
