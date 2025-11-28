import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  imageUrl: string;
  category: string;
  name: string;
  description: string;
  slug: string;
}

export function ProductCard({ imageUrl, category, name, description, slug }: ProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/produk/${slug}`} className="block aspect-square relative w-full overflow-hidden">
          <Image src={imageUrl} alt={name} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {/* Gunakan data dari props */}
        <CardDescription>{category}</CardDescription>
        <CardTitle className="mt-1 text-lg">
          <Link href={`/produk/${slug}`} className="hover:text-primary transition-colors">
            {name}
          </Link>
        </CardTitle>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" asChild className="w-full">
          <Link href={`/produk/${slug}`}>
            Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
