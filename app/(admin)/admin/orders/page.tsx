'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/admin/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { OrderStatus } from "@prisma/client";

export default function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  const isLoading = true;
  const orders = [];
  const totalPages = 1;
  const currentPage = 1;

  const OrderListCard = ({ status }: { status: OrderStatus }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan: {status}</CardTitle>
          <CardDescription>
            {status === 'PENDING' && 'Pesanan baru yang menunggu konfirmasi Anda.'}
            {status === 'COMPLETED' && 'Pesanan yang sudah selesai diproses.'}
            {status === 'CANCELLED' && 'Pesanan yang telah dibatalkan.'}
          </CardDescription>
          <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
            <Input
              placeholder="Cari nama, email, atau invoice..."
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
                <SelectItem value="customerName-asc">Nama (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
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
                disabled={true}
              >
                Sebelumnya
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={true}
              >
                Selanjutnya
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
          <p className="text-muted-foreground">Kelola semua pesanan yang masuk dari website.</p>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as OrderStatus)} 
        className="mt-4"
      >
        <TabsList>
          <TabsTrigger value={OrderStatus.PENDING}>Baru (Pending)</TabsTrigger>
          <TabsTrigger value={OrderStatus.COMPLETED}>Selesai</TabsTrigger>
          <TabsTrigger value={OrderStatus.CANCELLED}>Dibatalkan</TabsTrigger>
        </TabsList>
        
        <TabsContent value={OrderStatus.PENDING} className="mt-4">
          <OrderListCard status={OrderStatus.PENDING} />
        </TabsContent>
        <TabsContent value={OrderStatus.COMPLETED} className="mt-4">
          <OrderListCard status={OrderStatus.COMPLETED} />
        </TabsContent>
        <TabsContent value={OrderStatus.CANCELLED} className="mt-4">
          <OrderListCard status={OrderStatus.CANCELLED} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
