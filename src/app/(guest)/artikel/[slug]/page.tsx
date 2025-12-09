"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Calendar, User, ArrowLeft, Clock, Share2, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArticleCard } from "@/components/guest/article-card";
import { formatDate } from "@/lib/utils";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/articles/${params.slug}`);
        if (!res.ok) throw new Error("Artikel tidak ditemukan");
        const data = await res.json();
        setArticle(data);

        const resRelated = await fetch("/api/articles");
        const dataRelated = await resRelated.json();
        if (dataRelated.data) {
          const others = dataRelated.data.filter((a: any) => a.id !== data.id).slice(0, 3);
          setRelatedArticles(others);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchData();
    }
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-slate-500 text-sm animate-pulse">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Artikel Tidak Ditemukan</h1>
        <Button onClick={() => router.push("/artikel")} variant="outline">
          Kembali ke Jurnal
        </Button>
      </div>
    );
  }

  return (
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
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium text-sm">Bagikan artikel ini:</span>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 text-slate-600 hover:text-[#1877F2] hover:border-[#1877F2]">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
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
  );
}
