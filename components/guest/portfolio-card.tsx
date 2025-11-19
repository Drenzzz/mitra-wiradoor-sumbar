import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import type { PortfolioItem } from '@/types';

interface PortfolioCardProps {
  item: PortfolioItem;
}

const formatDate = (dateString: Date) => 
  new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col group h-full hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="secondary" className="mb-2">
            {item.category?.name || 'Proyek'}
          </Badge>
        </div>
        <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <span>Diselesaikan: {formatDate(item.projectDate)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
