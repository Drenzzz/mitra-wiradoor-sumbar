"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Tautan berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">Bagikan artikel ini:</span>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank")}
          title="Bagikan ke Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 text-sky-500 hover:text-sky-600 hover:bg-sky-50"
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, "_blank")}
          title="Bagikan ke Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`, "_blank")}
          title="Bagikan ke LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={handleCopyLink} title="Salin Tautan">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
