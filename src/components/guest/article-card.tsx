import Link from "next/link";
import Image from "next/image";
import { CalendarDays, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/artikel/${article.slug}`} className="relative aspect-video w-full overflow-hidden block">
        <Image src={article.featuredImageUrl} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-foreground">
            {article.category?.name || "Umum"}
          </Badge>
        </div>
      </Link>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCircle className="w-3 h-3" />
            <span>{article.author?.name || "Admin"}</span>
          </div>
        </div>
        <Link href={`/artikel/${article.slug}`}>
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt || article.content.replace(/<[^>]*>?/gm, "").substring(0, 120) + "..."}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/artikel/${article.slug}`} className="text-sm font-medium text-primary hover:underline inline-flex items-center">
          Baca Selengkapnya
        </Link>
      </CardFooter>
    </Card>
  );
}
