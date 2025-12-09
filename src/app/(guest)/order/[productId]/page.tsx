import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/product.service";
import { OrderPageClient } from "@/components/guest/order-page-client";
import { Product } from "@/types";

async function getProduct(productId: string): Promise<Product | null> {
  try {
    const product = await getProductById(productId);

    if (!product || product.isReadyStock !== true) {
      return null;
    }

    return { ...product, price: 0 } as Product;
  } catch (error) {
    console.error("Gagal mengambil data produk untuk halaman order:", error);
    return null;
  }
}

interface OrderPageProps {
  params: {
    productId: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Formulir Pemesanan</h1>
        <p className="mt-2 text-lg text-muted-foreground">Selesaikan pesanan Anda untuk produk di bawah ini.</p>
      </div>

      <OrderPageClient product={product} />
    </div>
  );
}

export async function generateMetadata({ params }: OrderPageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  return {
    title: `Pesan: ${product.name} - Wiradoor Sumbar`,
    description: `Formulir pemesanan untuk ${product.name}`,
  };
}
