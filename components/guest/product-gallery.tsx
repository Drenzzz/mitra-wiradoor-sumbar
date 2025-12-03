"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted cursor-zoom-in group">
            <AnimatePresence mode="wait">
              <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full h-full">
                <Image src={selectedImage} alt={title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
              <Maximize2 className="h-5 w-5" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative w-full h-[80vh]">
            <Image src={selectedImage} alt={title} fill className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={cn("relative aspect-square overflow-hidden rounded-lg border-2 transition-all", selectedImage === image ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/30")}
            >
              <Image src={image} alt={`${title} - View ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 25vw, 10vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
