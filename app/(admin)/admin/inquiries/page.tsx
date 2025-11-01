'use client';

import { PageWrapper } from '@/components/admin/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useInquiryManagement } from '@/hooks/use-inquiry-management';
import { InquiryStatus } from "@prisma/client";

export default function InquiryManagementPage() {
  const {
    inquiries,
    totalCount,
    isLoading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    rowsPerPage,
  } = useInquiryManagement();

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pesan Masuk (Inquiry)</h1>
          <p className="text-muted-foreground">Kelola semua pesan yang dikirim oleh pengunjung.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList>
          <TabsTrigger value={InquiryStatus.NEW}>Baru</TabsTrigger>
          <TabsTrigger value={InquiryStatus.READ}>Dibaca</TabsTrigger>
          <TabsTrigger value={InquiryStatus.REPLIED}>Dibalas</TabsTrigger>
          <TabsTrigger value="ALL">Semua</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Daftar Pesan Masuk</CardTitle>
            <CardDescription>
              Lihat dan kelola pesan yang masuk dari formulir kontak website.
            </CardDescription>
            <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
              <Input
                placeholder="Cari nama, email, atau subjek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Urutkan berdasarkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Terbaru</SelectItem>
                  <SelectItem value="createdAt-asc">Terlama</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center text-muted-foreground">
              {isLoading ? "Memuat data..." : `(Placeholder: Tabel data inquiry akan tampil di sini. Ditemukan ${inquiries.length} data)`}
            </div>
          </CardContent>
          {totalPages > 1 && (
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => p - 1)} 
                  disabled={currentPage <= 1 || isLoading}
                >
                  Sebelumnya
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => p + 1)} 
                  disabled={currentPage >= totalPages || isLoading}
                >
                  Selanjutnya
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </Tabs>
    </PageWrapper>
  );
}
