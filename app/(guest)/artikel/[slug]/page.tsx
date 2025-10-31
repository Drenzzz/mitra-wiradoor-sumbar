import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/guest/article-card';
import { ShareButtons } from '@/components/guest/share-buttons';
import { ChevronRight, Home, CalendarDays, UserCircle } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleData {
  article: Article | null;
  relatedArticles: Article[];
}

async function getArticleData(slug: string): Promise<ArticleData> {
  let article: Article | null = null;
  let relatedArticles: Article[] = [];

  try {
    const articleRes = await fetch(`${process.env.NEXTAUTH_URL}/api/articles/${slug}`, {
      cache: 'no-store',
    });

    if (articleRes.status === 404) {
      return { article: null, relatedArticles: [] };
    }
    if (!articleRes.ok) {
      throw new Error('Gagal memuat data artikel utama.');
    }
    
    article = await articleRes.json() as (Article & { isReadyStock?: boolean; stock?: number | null });


    if (article && article.status === 'PUBLISHED' && article.categoryId) {
      const relatedQuery = new URLSearchParams({
        status: 'active',
        statusFilter: 'PUBLISHED',
        limit: '3',
        categoryId: article.categoryId,
        sort: 'createdAt-desc',
      });

      const relatedRes = await fetch(`${process.env.NEXTAUTH_URL}/api/articles?${relatedQuery.toString()}`, {
        cache: 'no-store',
      });

      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        relatedArticles = (relatedData.data as Article[]).filter(a => a.id !== article?.id);
      } else {
        console.warn("Gagal memuat artikel terkait.");
      }
    }

    return { article, relatedArticles };

  } catch (error) {
    console.error("Fetch article data error:", error);
    return { article: null, relatedArticles: [] };
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
    const { article, relatedArticles } = await getArticleData(slug);
    
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

      <article 
        className="text-foreground/90 leading-relaxed whitespace-pre-wrapspace-y-4max-w-none">
        {article.content}
      </article>

      <div className="pt-8 mt-8 border-t">
        <ShareButtons title={article.title} />
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-6">Artikel Terkait</h2>
        {relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                article={relatedArticle}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Tidak ada artikel terkait lainnya dalam kategori ini.</p>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const { article } = await getArticleData(slug);   

  if (!article) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  return {
    title: `${article.title} - Wiradoor Sumbar`,
    description: article.content.substring(0, 160),
  };
}
