import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/services/order.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, MessageCircle, ArrowRight, Phone, MapPin, FileText, Package } from "lucide-react";

async function getOrderData(orderId: string) {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return null;
    }
    return order;
  } catch (error) {
    console.error("Error fetching order data for success page:", error);
    return null;
  }
}

function generateWhatsAppMessage(order: NonNullable<Awaited<ReturnType<typeof getOrderData>>>) {
  const itemsList = order.items.map((item, idx) => `${idx + 1}. ${item.productName} (Qty: ${item.quantity}) - ${item.isReadyStock ? "Ready Stock" : "Kustom"}`).join("\n");

  const message = `Halo Admin Wiradoor Sumbar,

Saya ingin konfirmasi pesanan dengan detail berikut:

📋 *INFORMASI PESANAN*
━━━━━━━━━━━━━━━━━━━━━
No. Invoice: *${order.invoiceNumber}*
Tanggal: ${new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}

👤 *DATA PEMESAN*
━━━━━━━━━━━━━━━━━━━━━
Nama: ${order.customerName}
No. HP: ${order.customerPhone}
Email: ${order.customerEmail || "-"}
Alamat Proyek: ${order.customerAddress || "-"}

📦 *DAFTAR PRODUK*
━━━━━━━━━━━━━━━━━━━━━
${itemsList}

${order.notes ? `📝 *CATATAN TAMBAHAN*\n━━━━━━━━━━━━━━━━━━━━━\n${order.notes}\n` : ""}
Mohon informasi lebih lanjut mengenai harga dan estimasi pengerjaan.

Terima kasih! 🙏`;

  return message;
}

interface OrderSuccessPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;
  const order = await getOrderData(orderId);

  if (!order) {
    notFound();
  }

  const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const whatsappMessage = generateWhatsAppMessage(order);
  const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pesanan Berhasil Dibuat!</h1>
        <p className="mt-2 text-lg text-muted-foreground">Terima kasih, {order.customerName}. Pesanan Anda telah kami terima.</p>
        <div className="mt-4 px-4 py-2 bg-slate-100 rounded-lg">
          <span className="text-sm text-muted-foreground">Nomor Invoice:</span>
          <p className="text-xl font-bold text-slate-900">{order.invoiceNumber}</p>
        </div>
      </div>

      <div className="mt-8 p-6 md:p-8 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl text-center text-white shadow-xl shadow-green-600/30">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Phone className="w-5 h-5" />
          <h2 className="text-xl font-bold">Langkah Terakhir</h2>
        </div>
        <p className="text-green-100 mb-6">Klik tombol di bawah untuk menghubungi admin via WhatsApp. Pesan akan terisi otomatis dengan detail pesanan Anda.</p>
        <Button size="lg" asChild className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 font-bold text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-6 w-6" />
            Konfirmasi via WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <p className="text-xs text-green-200 mt-4">Admin kami akan segera merespons untuk konfirmasi harga dan jadwal pengerjaan</p>
      </div>

      <Card className="mt-8 border-slate-200">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-slate-600" />
            Ringkasan Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Detail Pelanggan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">Nama:</span>
                <span className="text-slate-600">{order.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">No. WA:</span>
                <span className="text-slate-600">{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-700">Email:</span>
                <span className="text-slate-600">{order.customerEmail || "-"}</span>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-slate-600">{order.customerAddress || "-"}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <Package className="w-4 h-4" />
              Item yang Dipesan ({order.items.length} produk)
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</span>
                    <div>
                      <p className="font-medium text-slate-800">{item.productName}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} unit</p>
                    </div>
                  </div>
                  <Badge variant={item.isReadyStock ? "default" : "secondary"} className={item.isReadyStock ? "bg-green-600" : ""}>
                    {item.isReadyStock ? "Ready Stock" : "Kustom"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Catatan Tambahan</h3>
                <p className="text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">{order.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/produk">Lanjut Belanja</Link>
        </Button>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;
  const order = await getOrderData(orderId);

  if (!order) {
    return { title: "Pesanan Tidak Ditemukan" };
  }

  return {
    title: `Pesanan Berhasil (${order.invoiceNumber}) - Wiradoor Sumbar`,
    description: `Ringkasan pesanan ${order.invoiceNumber}.`,
  };
}
