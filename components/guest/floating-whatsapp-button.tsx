'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingWhatsAppButton() {
  const whatsAppNumber = '6281234567890';
  const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

  return (
    <motion.div
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: 0.5
      }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        )}
        aria-label="Hubungi kami di WhatsApp"
      >
        <MessageCircle className="h-8 w-8" />
      </Link>
    </motion.div>
  );
}
