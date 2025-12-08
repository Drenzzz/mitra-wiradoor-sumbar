import Image from "next/image";
import { BadgeCheck, ShieldCheck, Factory, Globe } from "lucide-react";
import MitraImage from "@/assets/foto_mitra_usaha.jpg";

function FeatureItem({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function TentangKamiPage() {
  return (
    <>
      <div className="relative bg-muted/40 py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tentang Kami</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">Mengenal MR Konstruksi, distributor resmi pintu premium Wiradoor untuk wilayah Sumatera Barat.</p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-primary">MR Konstruksi: Mitra Anda di Sumatera Barat</h2>
            <p>Lorem Ipsum</p>
            <p>Lorem Ipsum</p>

            <h3 className="text-xl font-semibold mt-8">Lorem Ipsum</h3>
            <p>Lorem Ipsum</p>
            <p>Lorem Ipsum</p>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
            <Image src={MitraImage} alt="Showroom MR Konstruksi - Wiradoor Sumbar" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </div>

      <div className="bg-muted/40 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Kualitas Adalah Prioritas Kami</h2>
            <p className="mt-4 text-lg text-muted-foreground">Lorem Ipsum.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <FeatureItem icon={BadgeCheck} title="Lorem Ipsum" description="Kayu wok." />
            <FeatureItem icon={ShieldCheck} title="Lorem Ipsum" description="Kayu wok." />
            <FeatureItem icon={Factory} title="Lorem Ipsum" description="Kayu wok." />
            <FeatureItem icon={Globe} title="Lorem Ipsum" description="Kayu wok." />
          </div>
        </div>
      </div>
    </>
  );
}
