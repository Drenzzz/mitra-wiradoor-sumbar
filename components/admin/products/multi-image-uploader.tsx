"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, X, Plus, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function MultiImageUploader({ value = [], onChange, maxFiles = 5 }: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} gambar.`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      // Upload files sequentially or in parallel
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload gagal");
        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} gambar berhasil diunggah!`);
    } catch (error) {
      toast.error("Gagal mengunggah beberapa gambar.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Galeri Produk ({value.length}/{maxFiles})
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={url} className="relative aspect-square group border rounded-lg overflow-hidden bg-muted">
            <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => handleRemoveImage(index)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            {index === 0 && <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">Utama</div>}
          </div>
        ))}

        {value.length < maxFiles && (
          <label className={cn("aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors", isUploading && "opacity-50 cursor-not-allowed")}>
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <>
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground font-medium">Tambah</span>
              </>
            )}
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" disabled={isUploading} />
          </label>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground">* Gambar pertama akan menjadi gambar utama (thumbnail).</p>
    </div>
  );
}
