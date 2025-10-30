import { ArticleCardSkeleton } from '@/components/guest/article-card-skeleton';

export default function ArtikelPage() {
  return (
    <div className="container mx-auto py-12 px-4">

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Artikel & Wawasan
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dapatkan wawasan, tips, dan berita terbaru dari dunia pintu dan desain interior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8">

        <aside className="hidden md:block">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-lg font-semibold">Filter & Cari</h2>

            <div className="h-9 w-full bg-muted rounded-md animate-pulse"></div>

            <div>
              <div className="h-5 w-1/2 bg-muted rounded-md mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="h-9 bg-muted rounded-md animate-pulse w-40"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
