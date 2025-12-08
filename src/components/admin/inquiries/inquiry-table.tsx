"use client";

import { Inquiry } from "@/types";
import { InquiryStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { MoreHorizontal, Eye, CheckCheck, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const formatDate = (dateString: Date) => new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const statusVariantMap: Record<InquiryStatus, "default" | "secondary" | "outline"> = {
  NEW: "default",
  READ: "secondary",
  REPLIED: "outline",
};

interface InquiryTableProps {
  inquiries: Inquiry[];
  isLoading: boolean;
  onViewClick: (inquiry: Inquiry) => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
}

export function InquiryTable({ inquiries, isLoading, onViewClick, onStatusChange }: InquiryTableProps) {
  if (isLoading) {
    return <div className="text-center p-8 text-muted-foreground">Memuat data...</div>;
  }

  if (inquiries.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Tidak ada pesan yang cocok dengan filter Anda.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>Pengirim</TableHead>
          <TableHead>Subjek</TableHead>
          <TableHead className="w-[150px]">Tanggal Masuk</TableHead>
          <TableHead className="text-right w-[80px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries.map((inquiry) => (
          <motion.tr key={inquiry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("hover:bg-muted/50", inquiry.status === "NEW" && "bg-primary/5")}>
            <TableCell>
              <Badge variant={statusVariantMap[inquiry.status]}>{inquiry.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">{inquiry.senderName}</div>
              <div className="text-xs text-muted-foreground">{inquiry.senderEmail}</div>
            </TableCell>
            <TableCell className="font-medium max-w-xs truncate">{inquiry.subject}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{formatDate(inquiry.createdAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => onViewClick(inquiry)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Pesan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={inquiry.status === "READ"} onSelect={() => onStatusChange(inquiry.id, "READ")}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Tandai Sudah Dibaca
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={inquiry.status === "REPLIED"} onSelect={() => onStatusChange(inquiry.id, "REPLIED")}>
                    <Send className="mr-2 h-4 w-4" />
                    Tandai Sudah Dibalas
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
