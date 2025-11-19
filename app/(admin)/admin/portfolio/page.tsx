'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/admin/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmationDialog } from '@/components/admin/shared/confirmation-dialog';
import { toast } from 'sonner';

import { usePortfolioManagement } from '@/hooks/use-portfolio-management';
import { PortfolioTable } from '@/components/admin/portfolio/portfolio-table';
import { CreatePortfolioDialog } from '@/components/admin/portfolio/create-portfolio-dialog';
import { EditPortfolioDialog } from '@/components/admin/portfolio/edit-portfolio-dialog';
import { PortfolioItem } from '@/types';

import { usePortfolioCategoryManagement } from '@/hooks/use-portfolio-category-management';
import { PortfolioCategoryTable } from '@/components/admin/portfolio/portfolio-category-table';
import { CreatePortfolioCategoryDialog } from '@/components/admin/portfolio/create-portfolio-category-dialog';
import { EditPortfolioCategoryDialog } from '@/components/admin/portfolio/edit-portfolio-category-dialog';
import { PortfolioCategory } from '@/types';

export default function PortfolioManagementPage() {
  const {
    items, categories: filterCategories, totalCount: itemCount, isLoading: isItemLoading,
    searchTerm: itemSearch, setSearchTerm: setItemSearch,
    filterByCategory, setFilterByCategory,
    currentPage: itemPage, setCurrentPage: setItemPage, rowsPerPage: itemRows,
    fetchItems, fetchCategories: refreshFilters
  } = usePortfolioManagement();

  const {
    categories: catList, totals: catCount, isLoading: isCatLoading,
    searchTerm: catSearch, setSearchTerm: setCatSearch,
    activeTab: catTab, setActiveTab: setCatTab,
    currentPage: catPage, setCurrentPage: setCatPage, rowsPerPage: catRows,
    fetchCategories: refreshCategories
  } = usePortfolioCategoryManagement();

  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const [isEditCatOpen, setIsEditCatOpen] = useState(false);
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<PortfolioCategory | null>(null);
  const [catActionType, setCatActionType] = useState<'delete' | 'restore' | 'force'>('delete');

  const [isActionLoading, setIsActionLoading] = useState(false);

  const confirmDeleteItem = async () => {
    if (!selectedItem) return;
    setIsActionLoading(true);
    toast.promise(
      fetch(`/api/portfolio/${selectedItem.id}`, { method: 'DELETE' }),
      {
        loading: 'Menghapus...',
        success: () => { fetchItems(); setIsDeleteItemOpen(false); return 'Berhasil dihapus!'; },
        error: 'Gagal.',
        finally: () => setIsActionLoading(false)
      }
    );
  };

  const handleCatAction = async () => {
    if (!selectedCat) return;
    setIsActionLoading(true);
    
    let url = `/api/portfolio-categories/${selectedCat.id}`;
    let method = 'DELETE';
    let body = null;

    if (catActionType === 'force') url += '?force=true';
    if (catActionType === 'restore') { method = 'PATCH'; body = JSON.stringify({ action: 'restore' }); }

    toast.promise(
      fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body }),
      {
        loading: 'Memproses...',
        success: () => { 
          refreshCategories(); 
          refreshFilters();
          setIsDeleteCatOpen(false); 
          return 'Berhasil!'; 
        },
        error: 'Gagal.',
        finally: () => setIsActionLoading(false)
      }
    );
  };

  const openCatConfirm = (cat: PortfolioCategory, type: 'delete' | 'restore' | 'force') => {
    setSelectedCat(cat);
    setCatActionType(type);
    setIsDeleteCatOpen(true);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Portofolio</h1>
          <p className="text-muted-foreground">Kelola proyek dan kategori portofolio Anda.</p>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Daftar Proyek</TabsTrigger>
          <TabsTrigger value="categories">Kategori Portofolio</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="flex justify-end mb-4">
            <CreatePortfolioDialog categories={filterCategories} onSuccess={fetchItems} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Proyek ({itemCount})</CardTitle>
              <CardDescription>Daftar item portofolio yang ditampilkan.</CardDescription>
              <div className="flex flex-col md:flex-row items-center gap-2 pt-4">
                <Input placeholder="Cari judul..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} className="w-full" />
                <Select value={filterByCategory} onValueChange={setFilterByCategory}>
                  <SelectTrigger className="w-full md:w-[250px]"><SelectValue placeholder="Filter Kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {filterCategories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <PortfolioTable 
                items={items} 
                isLoading={isItemLoading} 
                onEditClick={(item) => { setSelectedItem(item); setIsEditItemOpen(true); }} 
                onDeleteClick={(item) => { setSelectedItem(item); setIsDeleteItemOpen(true); }} 
              />
            </CardContent>
            <CardFooter>
               <div className="flex items-center space-x-2 ml-auto">
                <Button variant="outline" size="sm" onClick={() => setItemPage(p => p - 1)} disabled={itemPage <= 1}>Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setItemPage(p => p + 1)} disabled={itemPage >= Math.ceil(itemCount / itemRows)}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
             <Tabs value={catTab} onValueChange={(v) => setCatTab(v as any)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="active">Aktif ({catCount.active})</TabsTrigger>
                  <TabsTrigger value="trashed">Sampah ({catCount.trashed})</TabsTrigger>
                </TabsList>
             </Tabs>
             <CreatePortfolioCategoryDialog onSuccess={() => { refreshCategories(); refreshFilters(); }} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Kategori Portofolio</CardTitle>
              <div className="pt-2">
                <Input placeholder="Cari kategori..." value={catSearch} onChange={(e) => setCatSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <PortfolioCategoryTable 
                variant={catTab as any}
                categories={catTab === 'active' ? catList.active : catList.trashed}
                isLoading={isCatLoading}
                onEditClick={(cat) => { setSelectedCat(cat); setIsEditCatOpen(true); }}
                onDeleteClick={(cat) => openCatConfirm(cat, 'delete')}
                onRestoreClick={(cat) => openCatConfirm(cat, 'restore')}
                onForceDeleteClick={(cat) => openCatConfirm(cat, 'force')}
              />
            </CardContent>
             <CardFooter>
               <div className="flex items-center space-x-2 ml-auto">
                <Button variant="outline" size="sm" onClick={() => setCatPage(p => p - 1)} disabled={catPage <= 1}>Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setCatPage(p => p + 1)} disabled={catPage >= Math.ceil((catTab === 'active' ? catCount.active : catCount.trashed) / catRows)}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <EditPortfolioDialog item={selectedItem} categories={filterCategories} isOpen={isEditItemOpen} onClose={() => setIsEditItemOpen(false)} onSuccess={fetchItems} />
      <ConfirmationDialog isOpen={isDeleteItemOpen} onClose={() => setIsDeleteItemOpen(false)} onConfirm={confirmDeleteItem} title="Hapus Proyek?" description="Hapus permanen?" variant="destructive" isLoading={isActionLoading} />
      
      <EditPortfolioCategoryDialog category={selectedCat} isOpen={isEditCatOpen} onClose={() => setIsEditCatOpen(false)} onSuccess={() => { refreshCategories(); refreshFilters(); }} />
      <ConfirmationDialog 
        isOpen={isDeleteCatOpen} 
        onClose={() => setIsDeleteCatOpen(false)} 
        onConfirm={handleCatAction} 
        title={catActionType === 'delete' ? 'Pindahkan ke Sampah?' : catActionType === 'restore' ? 'Pulihkan Kategori?' : 'Hapus Permanen?'}
        description={catActionType === 'force' ? 'Data akan hilang selamanya.' : ''}
        variant={catActionType === 'restore' ? 'default' : 'destructive'} 
        isLoading={isActionLoading} 
      />
    </PageWrapper>
  );
}
