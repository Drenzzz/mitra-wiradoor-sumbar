"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Article } from "@/types";
import { MoreHorizontal, Pencil, Trash2, Eye, Undo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermission } from "@/hooks/use-permission";

interface ArticleTableProps {
  variant: "active" | "trashed";
  articles: Article[];
  isLoading: boolean;
  onRefresh: () => void;
  onEditClick: (article: Article) => void;
  onViewClick: (article: Article) => void;
  onDeleteClick: (article: Article) => void;
  onRestoreClick: (article: Article) => void;
  onForceDeleteClick: (article: Article) => void;
  selectedRowKeys: string[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ArticleTable({ variant, articles, isLoading, onRefresh, onEditClick, onDeleteClick, onRestoreClick, onForceDeleteClick, selectedRowKeys, setSelectedRowKeys, onViewClick }: ArticleTableProps) {
  const { can } = usePermission();

  if (isLoading) return <div className="text-center p-8 text-muted-foreground">Memuat data artikel...</div>;
  if (articles.length === 0) return <div className="text-center p-8 text-muted-foreground">{variant === "active" ? "Belum ada artikel." : "Tidak ada artikel di sampah."}</div>;

  const formatDate = (dateString: Date) => new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const numSelected = selectedRowKeys.length;
  const rowCount = articles.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedRowKeys(checked ? articles.map((a) => a.id) : []);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    setSelectedRowKeys((prev) => (checked ? [...prev, id] : prev.filter((key) => key !== id)));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 pl-2">
            <Checkbox
              checked={rowCount > 0 && numSelected === rowCount ? true : numSelected > 0 ? "indeterminate" : false}
              onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
              aria-label="Select all"
              disabled={!can("article:delete") && variant === "active"}
            />
          </TableHead>
          <TableHead className="w-[80px]">Gambar</TableHead>
          <TableHead>Judul</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Penulis</TableHead>
          <TableHead>{variant === "trashed" ? "Dihapus Pada" : "Diterbitkan Pada"}</TableHead>
          <TableHead className="text-right pr-2">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <motion.tr key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <TableCell className="pl-2">
              <Checkbox checked={selectedRowKeys.includes(article.id)} onCheckedChange={(checked) => handleRowSelect(article.id, Boolean(checked))} aria-label="Select row" disabled={!can("article:delete") && variant === "active"} />
            </TableCell>
            <TableCell>
              <Image src={article.featuredImageUrl} alt={article.title} width={64} height={64} className="rounded-md object-cover aspect-square" />
            </TableCell>
            <TableCell className="font-semibold max-w-xs truncate">{article.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{article.category?.name || "N/A"}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={article.status === "PUBLISHED" ? "default" : "secondary"}>{article.status === "PUBLISHED" ? "Published" : "Draft"}</Badge>
            </TableCell>
            <TableCell>{article.author?.name || "N/A"}</TableCell>
            <TableCell>{formatDate(variant === "trashed" ? article.deletedAt! : article.createdAt)}</TableCell>
            <TableCell className="text-right pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4 ml-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => onViewClick(article)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </DropdownMenuItem>
                  {variant === "active" ? (
                    <>
                      {can("article:edit") && (
                        <DropdownMenuItem onSelect={() => onEditClick(article)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {can("article:delete") && (
                        <DropdownMenuItem className="text-red-500" onSelect={() => onDeleteClick(article)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : (
                    <>
                      {can("article:delete") && (
                        <>
                          <DropdownMenuItem onSelect={() => onRestoreClick(article)}>
                            <Undo className="mr-2 h-4 w-4" />
                            Pulihkan
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onSelect={() => onForceDeleteClick(article)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Permanen
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
