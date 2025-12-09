"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArticleCard } from "@/components/guest/article-card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function ArtikelPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.data) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()));

  const featuredArticle = filteredArticles[0];
  const recentArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="pt-32 pb-12 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight">The Knowledge Journal</h1>
            <p className="text-lg text-slate-600 leading-relaxed">Wawasan mendalam seputar teknologi pintu, tren arsitektur, dan material konstruksi modern.</p>

            <div className="relative max-w-lg mx-auto mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari artikel..." className="pl-10 bg-white border-slate-200 rounded-full h-12 shadow-sm focus-visible:ring-orange-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-16">
            {featuredArticle && !searchQuery && (
              <section className="group relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <Image src={featuredArticle.featuredImageUrl || "/placeholder-image.jpg"} alt={featuredArticle.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-transparent" />
                  </div>
                  <div className="relative p-8 md:p-12 flex flex-col justify-center space-y-6">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600 hover:bg-orange-700 text-white border-0">Featured Story</Badge>
                        <span className="text-slate-400 text-sm">{formatDate(featuredArticle.createdAt)}</span>
                      </div>
                      <Link href={`/artikel/${featuredArticle.slug}`}>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight group-hover:text-orange-400 transition-colors cursor-pointer">{featuredArticle.title}</h2>
                      </Link>
                      <p className="text-slate-300 text-lg leading-relaxed line-clamp-3">{featuredArticle.excerpt}</p>
                      <Button variant="outline" className="w-fit text-black border-white hover:bg-white hover:text-black mt-4" asChild>
                        <Link href={`/artikel/${featuredArticle.slug}`}>Baca Artikel Lengkap</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!searchQuery && <Separator />}

            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-slate-900">{searchQuery ? "Hasil Pencarian" : "Artikel Terbaru"}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {(searchQuery ? filteredArticles : recentArticles).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {(searchQuery ? filteredArticles : recentArticles).length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-lg">Tidak ada artikel yang ditemukan.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="text-center py-32">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Belum ada jurnal diterbitkan</h3>
            <p className="text-slate-500">Cek kembali nanti untuk wawasan terbaru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
