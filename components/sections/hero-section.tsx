import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
      <div className="absolute inset-0">
        <Image src="https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Wiradoor Hero Background" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Pintu Premium Berkualitas Ekspor</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">Kini hadir di Sumatera Barat. Temukan solusi pintu terbaik untuk interior dan eksterior hunian Anda dengan standar pabrikasi berteknologi tinggi.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/produk">Lihat Katalog</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white hover:bg-white hover:text-black">
            <Link href="/kontak">Konsultasi Gratis</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
