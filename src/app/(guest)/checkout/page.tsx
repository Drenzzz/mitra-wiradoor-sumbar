import { Metadata } from "next";
import { CheckoutForm } from "@/components/guest/checkout-form";

export const metadata: Metadata = {
  title: "Finalisasi Permintaan | Wiradoor Sumbar",
  description: "Lengkapi data diri Anda untuk mengajukan penawaran proyek.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-32 pb-10 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">Finalisasi Permintaan</h1>
          <p className="text-slate-500">Lengkapi detail di bawah ini agar tim kami dapat menyusun penawaran terbaik untuk proyek Anda.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CheckoutForm />
      </div>
    </div>
  );
}
