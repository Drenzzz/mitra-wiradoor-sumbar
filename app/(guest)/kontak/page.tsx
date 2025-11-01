import { MapPin, Mail, Phone } from 'lucide-react';
import { InquiryForm } from '@/components/guest/inquiry-form';

const whatsAppNumber = process.env.WHATSAPP_NUMBER || '6281234567890';
const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

const contactInfo = {
  address: "Jl. By Pass Gg. Ipuh No.23, Campago Ipuh, Kec. Mandiangin Koto Selayan, Kota Bukittinggi, Sumatera Barat 26117",
  email: "wiradoorsumbar@gmail.com",
  phoneDisplay: "0812-3456-7890",
  phoneLink: whatsAppLink,
};

const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.3603254363303!2d100.37636605503603!3d-0.2956401729024136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd5392f5a7cee13%3A0x88e035e26b5b6898!2sJl.%20By%20Pass%20Gg.%20Ipuh%20No.23%2C%20Campago%20Ipuh%2C%20Kec.%20Mandiangin%20Koto%20Selayan%2C%20Kota%20Bukittinggi%2C%20Sumatera%20Barat%2026117!5e0!3m2!1sen!2sid!4v1761895268540!5m2!1sen!2sid"; // Placeholder: Peta UNP

export default function KontakPage() {
  return (
    <>
      <div className="bg-muted/40 py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Kami siap membantu Anda menemukan solusi pintu terbaik. Tanyakan apa saja atau kirimkan pesan kepada kami.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Informasi Kontak</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span>{contactInfo.address}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <a href={contactInfo.phoneLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {contactInfo.phoneDisplay} (WhatsApp)
                  </a>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Kirim Pesan</h2>
              <div className="p-8 bg-muted/50 rounded-lg text-center text-muted-foreground">
                <InquiryForm />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Lokasi Kami</h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
