import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: any;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

export function ArticleCard({ article, className, aspectRatio = "video" }: ArticleCardProps) {
  return (
    <Link href={`/artikel/${article.slug}`} className={cn("group flex flex-col gap-4 block select-none", className)}>
      <div className={cn("relative overflow-hidden rounded-xl bg-slate-100 w-full", aspectRatio === "video" && "aspect-video", aspectRatio === "square" && "aspect-square", aspectRatio === "portrait" && "aspect-[3/4]")}>
        <Image src={article.featuredImageUrl || "/placeholder-image.jpg"} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium tracking-wider uppercase">
          <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
            {article.category?.name || "Uncategorized"}
          </Badge>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.createdAt)}
          </span>
        </div>

        <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">{article.title}</h3>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>

        <div className="flex items-center text-sm font-medium text-orange-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Baca Selengkapnya <ArrowUpRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
