"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PortfolioItem } from "@/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PortfolioTableProps {
  items: PortfolioItem[];
  isLoading: boolean;
  onEditClick: (item: PortfolioItem) => void;
  onDeleteClick: (item: PortfolioItem) => void;
}

const formatDate = (dateString: Date) => new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

export function PortfolioTable({ items, isLoading, onEditClick, onDeleteClick }: PortfolioTableProps) {
  if (isLoading) return <div className="text-center p-8 text-muted-foreground">Memuat data portofolio...</div>;
  if (items.length === 0) return <div className="text-center p-8 text-muted-foreground">Belum ada item portofolio.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Gambar</TableHead>
          <TableHead>Judul Proyek</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Tanggal Pengerjaan</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/50">
            <TableCell>
              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
            </TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.category?.name || "Tanpa Kategori"}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDate(item.projectDate)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => onEditClick(item)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onSelect={() => onDeleteClick(item)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
