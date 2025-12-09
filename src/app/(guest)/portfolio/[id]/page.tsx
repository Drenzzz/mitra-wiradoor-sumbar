import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioItemById } from "@/lib/services/portfolio.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const portfolio = await getPortfolioItemById(id);

  if (!portfolio) {
    return {
      title: "Proyek Tidak Ditemukan",
    };
  }

  return {
    title: `${portfolio.title} - Wiradoor Sumbar`,
    description: portfolio.description.substring(0, 160),
    openGraph: {
      images: [portfolio.imageUrl],
    },
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const portfolio = await getPortfolioItemById(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Button variant="ghost" asChild className="group mb-8 pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/portfolio" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Galeri
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[4/3] lg:aspect-[3/4] shadow-2xl">
            <Image src={portfolio.imageUrl} alt={portfolio.title} fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" priority />
          </div>

          <div className="space-y-8 lg:py-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {portfolio.category && (
                  <Badge variant="secondary" className="px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0">
                    {portfolio.category.name}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(portfolio.projectDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">{portfolio.title}</h1>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">{portfolio.description}</p>
            </div>

            <div className="pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto rounded-full font-medium" asChild>
                  <Link href="/kontak">Hubungi Kami</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
