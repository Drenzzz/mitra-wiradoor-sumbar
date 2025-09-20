'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string | null;
}

export function ImageUploader({ onUploadSuccess, initialImageUrl }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    toast.promise(
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error('Upload gagal. Pastikan file adalah gambar dan coba lagi.');
        }
        return response.json();
      }),
      {
        loading: 'Mengunggah gambar...',
        success: (data) => {
          setImageUrl(data.url);
          onUploadSuccess(data.url);
          return 'Gambar berhasil diunggah!';
        },
        error: (err) => err.message,
        finally: () => setIsUploading(false),
      }
    );
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onUploadSuccess('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Gambar Produk</label>
      <div className="w-full h-48 border-2 border-dashed rounded-md flex items-center justify-center relative">
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt="Pratinjau Produk" fill className="object-contain rounded-md" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <label htmlFor="image-upload" className="cursor-pointer text-center text-muted-foreground p-4">
            <UploadCloud className="mx-auto h-12 w-12 mb-2" />
            <span>{isUploading ? 'Mengunggah...' : 'Klik untuk memilih atau jatuhkan gambar di sini'}</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
