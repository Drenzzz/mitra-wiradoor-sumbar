// components/site-footer.tsx
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg">Wiradoor Sumbar</h3>
            <p className="text-sm text-gray-400 mt-2">Solusi pintu interior dan eksterior berkualitas.</p>
          </div>
          <div>
            <h4 className="font-semibold">Navigasi</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/produk" className="text-gray-400 hover:text-white">Produk</Link></li>
              <li><Link href="/tentang-kami" className="text-gray-400 hover:text-white">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="text-gray-400 hover:text-white">Kontak</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Kontak</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>Email: info@wiradoor-sumbar.com</li>
              <li>Telepon: (0751) 123-456</li>
              <li>Jl. Hayam Wuruk No. 22, Padang</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Wiradoor Sumatera Barat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}