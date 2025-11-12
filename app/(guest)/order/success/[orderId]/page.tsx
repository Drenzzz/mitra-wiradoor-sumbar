import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrderById } from '@/lib/services/order.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MessageCircle } from 'lucide-react';

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

  const whatsAppNumber = process.env.WHATSAPP_NUMBER || '6281234567890';
  const whatsappMessage = `Halo, saya ingin konfirmasi pesanan saya dengan nomor invoice: ${order.invoiceNumber}`;
  const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Terima kasih, {order.customerName}. Pesanan Anda telah kami terima.
        </p>
        <p className="mt-2 text-muted-foreground">
          Nomor Invoice Anda: <strong className="text-foreground">{order.invoiceNumber}</strong>
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ringkasan Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Detail Pelanggan</h3>
            <div className="text-sm">
              <p><strong>Nama:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>No. WA:</strong> {order.customerPhone}</p>
              <p><strong>Alamat:</strong> {order.customerAddress || '-'}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Item yang Dipesan</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <p>{item.productName} (x{item.quantity})</p>
                <Badge variant={item.isReadyStock ? 'default' : 'secondary'}>
                  {item.isReadyStock ? 'Ready Stock' : 'Kustom'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <h2 className="text-xl font-semibold">Langkah Terakhir: Konfirmasi Pembayaran</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Silakan klik tombol di bawah ini untuk mengonfirmasi pesanan dan melanjutkan proses pembayaran via WhatsApp dengan admin kami.
        </p>
        <Button size="lg" asChild>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            Konfirmasi via WhatsApp
          </Link>
        </Button>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;
  const order = await getOrderData(orderId);

  if (!order) {
    return { title: 'Pesanan Tidak Ditemukan' };
  }

  return {
    title: `Pesanan Berhasil (${order.invoiceNumber}) - Wiradoor Sumbar`,
    description: `Ringkasan pesanan ${order.invoiceNumber}.`,
  };
}
