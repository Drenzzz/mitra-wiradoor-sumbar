import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function PortfolioCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full animate-pulse">
      <CardHeader className="p-0">
        <div className="aspect-video w-full bg-muted"></div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <div className="h-5 w-24 bg-muted rounded-full"></div>
        <div className="h-6 w-3/4 bg-muted rounded"></div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-5/6 bg-muted rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <div className="h-4 w-32 bg-muted rounded"></div>
      </CardFooter>
    </Card>
  );
}
