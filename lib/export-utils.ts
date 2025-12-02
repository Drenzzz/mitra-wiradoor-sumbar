import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ReportData } from "@/types";

export function exportToExcel(data: ReportData, startDate: Date, endDate: Date) {
  const workbook = XLSX.utils.book_new();

  const summaryData = [
    ["Laporan Penjualan Wiradoor Sumatera Barat"],
    ["Periode", `${format(startDate, "dd MMMM yyyy", { locale: id })} - ${format(endDate, "dd MMMM yyyy", { locale: id })}`],
    ["Dicetak Pada", format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })],
    [],
    ["RINGKASAN KINERJA"],
    ["Total Pendapatan", data.summary.totalRevenue],
    ["Total Pesanan", data.summary.totalOrders],
    ["Rata-rata Transaksi", data.summary.averageOrderValue],
    ["Pesanan Dibatalkan", data.summary.cancelledOrders],
    [],
    ["STATISTIK PRODUK"],
  ];

  const productStats = data.topProducts.map((p) => [p.name, p.quantity]);
  summaryData.push(["Nama Produk", "Terjual"]);
  summaryData.push(...(productStats as any));

  const worksheetSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, worksheetSummary, "Ringkasan");

  const transactionRows = data.recentTransactions.map((t) => ({
    Invoice: t.invoiceNumber,
    Pelanggan: t.customerName,
    Tanggal: format(new Date(t.date), "dd/MM/yyyy HH:mm", { locale: id }),
    Status: t.status,
    Total: t.amount,
  }));

  const worksheetTransactions = XLSX.utils.json_to_sheet(transactionRows);
  XLSX.utils.book_append_sheet(workbook, worksheetTransactions, "Rincian Transaksi");

  const fileName = `Laporan_Wiradoor_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportToPDF(data: ReportData, startDate: Date, endDate: Date) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Laporan Penjualan Wiradoor Sumbar", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Periode: ${format(startDate, "dd MMMM yyyy", { locale: id })} - ${format(endDate, "dd MMMM yyyy", { locale: id })}`, 14, 30);
  doc.text(`Dicetak: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}`, 14, 35);

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  autoTable(doc, {
    startY: 45,
    head: [["Metrik", "Nilai"]],
    body: [
      ["Total Pendapatan", formatCurrency(data.summary.totalRevenue)],
      ["Total Pesanan", data.summary.totalOrders.toString()],
      ["Rata-rata Transaksi", formatCurrency(data.summary.averageOrderValue)],
      ["Pesanan Dibatalkan", data.summary.cancelledOrders.toString()],
    ],
    theme: "grid",
    headStyles: { fillColor: [234, 88, 12] },
    styles: { fontSize: 10 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 45;

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Rincian Transaksi (10 Terakhir)", 14, finalY + 15);

  const transactionRows = data.recentTransactions.map((t) => [t.invoiceNumber, t.customerName, format(new Date(t.date), "dd/MM/yy"), t.status, formatCurrency(t.amount)]);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Invoice", "Pelanggan", "Tgl", "Status", "Total"]],
    body: transactionRows,
    theme: "striped",
    headStyles: { fillColor: [50, 50, 50] },
    styles: { fontSize: 9 },
  });

  const fileName = `Laporan_Wiradoor_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`;
  doc.save(fileName);
}
