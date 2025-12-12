import { InquiryForm } from "@/components/guest/inquiry-form";
import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hubungi Kami | Wiradoor Sumbar",
  description: "Konsultasikan kebutuhan pintu Anda. Kunjungi showroom kami atau kirim pesan secara online.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-neutral-950">
      <DotPattern className={cn("[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]", "fill-neutral-700/50")} />
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-neutral-900/80 p-8 text-white lg:col-span-2 lg:p-12 relative flex flex-col justify-between border-r border-white/5">
              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Get In Touch</h3>
                  <h1 className="font-serif text-3xl font-medium leading-tight">Mari Diskusikan Proyek Anda</h1>
                  <p className="mt-4 text-sm text-white/60 leading-relaxed">Kunjungi showroom kami untuk melihat langsung kualitas material dan finishing pintu Wiradoor.</p>
                </div>

                <div className="space-y-6">
                  <div className="group rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-sm">Showroom Utama</h4>
                        <p className="text-sm text-white/60 mt-1 leading-relaxed">
                          Jl. Bypass Ipuh Mandi Angin No. 12
                          <br />
                          Bukittinggi, Sumatera Barat
                        </p>
                        <Link href="https://maps.google.com/?q=Wiradoor+Sumatera+Barat" target="_blank" className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline">
                          Buka di Google Maps <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-4">
                      <Phone className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Telepon / WA</p>
                        <p className="text-sm font-medium">+62 812-3456-7890</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4">
                      <Mail className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium">info@wiradoorsumbar.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-4">
                      <Clock className="h-5 w-5 text-white/40" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Jam Kerja</p>
                        <p className="text-sm font-medium">Senin - Sabtu: 08.00 - 17.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-xs text-white/40 mb-4">Ikuti Kami</p>
                <div className="flex gap-3">
                  <Button size="icon" variant="outline" className="rounded-full bg-transparent border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full bg-transparent border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8 lg:col-span-3 lg:p-16 bg-neutral-950/50">
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-medium text-white mb-2">Kirim Pesan</h2>
                <p className="text-white/50 text-sm">Silakan isi formulir di bawah ini untuk permintaan penawaran atau konsultasi teknis.</p>
              </div>

              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
