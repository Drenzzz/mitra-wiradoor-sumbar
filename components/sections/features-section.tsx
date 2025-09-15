// components/sections/features-section.tsx
import { CubeTransparentIcon, WrenchScrewdriverIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Kualitas Pabrikasi',
    description: 'Diproduksi dengan teknologi tinggi, presisi, dan proses oven untuk daya tahan maksimal terhadap cuaca.',
    icon: CheckBadgeIcon,
  },
  {
    name: 'Desain Kustom',
    description: 'Wujudkan pintu impian Anda. Kami melayani pesanan khusus sesuai desain, bentuk, dan ukiran yang Anda inginkan.',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Layanan Instalasi Profesional',
    description: 'Tim aplikator kami memastikan pintu Anda terpasang dengan sempurna untuk fungsionalitas dan keamanan terbaik.',
    icon: WrenchScrewdriverIcon,
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mengapa Memilih Wiradoor?</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Kami tidak hanya menjual pintu, kami memberikan solusi dan kualitas terbaik.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div key={feature.name} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-orange-600 text-white">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-7 text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}