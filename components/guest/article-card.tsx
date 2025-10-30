import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { Article } from '@/types';

function formatDate(dateString: Date | string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const excerpt = article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '');

  const slug = article.slug || article.id; 

  return (
    <Card className="overflow-hidden flex flex-col group">
      <CardHeader className="p-0">
        <Link href={`/artikel/${slug}`} className="block aspect-video relative w-full overflow-hidden">
          <Image
            src={article.featuredImageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="outline" className="mb-2">
          {article.category?.name || 'Lainnya'}
        </Badge>
        <CardTitle className="mt-1 text-lg leading-snug">
          <Link href={`/artikel/${slug}`} className="hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </Link>
        </CardTitle>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
         <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{formatDate(article.createdAt)}</span>
         </div>
         <Link href={`/artikel/${slug}`} className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            Baca <ArrowRight className="ml-1 h-3.5 w-3.5" />
         </Link>
      </CardFooter>
    </Card>
  );
}
