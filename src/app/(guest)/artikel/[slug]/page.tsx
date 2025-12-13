import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/guest/article/article-card";
import { formatDate } from "@/lib/utils";
import { getArticleBySlug, getArticles } from "@/lib/services/article.service";
import { ShareButtons } from "@/components/guest/layout/share-buttons";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImageUrl: string;
  createdAt: Date;
  author: { name: string | null } | null;
  category: { name: string } | null;
}

async function getArticleData(slug: string): Promise<{
  article: ArticleData | null;
  relatedArticles: ArticleData[];
}> {
  try {
    const article = await getArticleBySlug(slug);

    if (!article || article.status !== "PUBLISHED" || article.deletedAt) {
      return { article: null, relatedArticles: [] };
    }

    const { data: allArticles } = await getArticles({
      status: "active",
      statusFilter: "PUBLISHED",
      limit: 4,
    });

    const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3) as ArticleData[];

    return {
      article: article as ArticleData,
      relatedArticles,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return { article: null, relatedArticles: [] };
  }
}

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const { article, relatedArticles } = await getArticleData(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `${process.env.NEXTAUTH_URL || "https://wiradoorsumbar.com"}/artikel/${article.slug}`;

  const breadcrumbItems = [
    { name: "Beranda", url: "/" },
    { name: "Artikel", url: "/artikel" },
    { name: article.title, url: `/artikel/${article.slug}` },
  ];

  return (
    <>
      <ArticleJsonLd article={{ ...article, updatedAt: article.createdAt }} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-12 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <Link href="/artikel" className="hover:text-orange-600 transition-colors flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Jurnal
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-300" />
              <span className="text-slate-900 font-medium truncate max-w-[200px]">{article.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 px-3 py-1 text-sm">{article.category?.name || "General"}</Badge>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {formatDate(article.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User className="h-4 w-4" />
                {article.author?.name || "Admin"}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 leading-tight mb-8">{article.title}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-12">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-12 bg-slate-100">
            <Image src={article.featuredImageUrl || "/placeholder-image.jpg"} alt={article.title} fill className="object-cover" priority />
          </div>

          <article className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <ShareButtons title={article.title} />
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-serif font-bold text-slate-900">Artikel Terkait</h3>
                <Link href="/artikel">
                  <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
                    Lihat Semua <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((item) => (
                  <ArticleCard key={item.id} article={item} aspectRatio="portrait" />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticleData(slug);

  if (!article) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  const title = article.title;
  const description = article.excerpt || article.title.substring(0, 160);
  const imageUrl = article.featuredImageUrl;
  const articleUrl = `${process.env.NEXTAUTH_URL || "https://wiradoorsumbar.com"}/artikel/${article.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: articleUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      authors: [article.author?.name || "Wiradoor Sumbar"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
