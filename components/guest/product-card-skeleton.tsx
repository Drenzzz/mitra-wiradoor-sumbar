import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardHeader className="p-0">
        <div className="aspect-square w-full bg-muted"></div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="h-4 w-1/3 bg-muted rounded"></div>
        <div className="h-5 w-3/4 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
        <div className="pt-2">
          <div className="h-9 w-1/2 bg-muted rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
}
