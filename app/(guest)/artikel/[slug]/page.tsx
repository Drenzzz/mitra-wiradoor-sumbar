import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArticleCardSkeleton } from '@/components/guest/article-card-skeleton';
import { ChevronRight, Home, CalendarDays, UserCircle } from 'lucide-react';
import type { Article } from '@/types';

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/articles/${slug}`, {
      cache: 'no-store',
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error('Gagal memuat data artikel.');
    }

    const data = await res.json();
    return data as Article;
  } catch (error) {
    console.error("Fetch article error:", error);
    return null;
  }
}

function formatDate(dateString: Date | string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface ArticleDetailPageProps {
  params: { slug: string };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      
      <nav className="mb-4 text-sm text-muted-foreground flex items-center space-x-2">
        <Link href="/" className="hover:text-primary">
          <Home className="h-4 w-4 inline-block mr-1" /> Beranda
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/artikel" className="hover:text-primary">
          Artikel
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{article.title}</span>
      </nav>

      <header className="mb-6">
        <Badge variant="outline" className="mb-3">
          {article.category?.name || 'Lainnya'}
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1.5">
            <UserCircle className="w-4 h-4" />
            <span>{article.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </header>

      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md bg-muted mb-8">
        <Image
          src={article.featuredImageUrl}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 1024px"
          priority
        />
      </div>

      <div className="pt-8 mt-8 border-t">
        <p className="text-xs text-muted-foreground mb-4">Bagikan:</p>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-6">Artikel Terkait</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  return {
    title: `${article.title} - Wiradoor Sumbar`,
    description: article.content.substring(0, 160),
  };
}
