import { Card, CardContent } from "@/components/ui/card";

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-muted"></div>

      <CardContent className="p-4 space-y-3">
        <div className="h-4 w-1/4 bg-muted rounded"></div>

        <div className="h-6 w-3/4 bg-muted rounded"></div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-5/6 bg-muted rounded"></div>
        </div>

        <div className="pt-2">
          <div className="h-4 w-1/3 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
