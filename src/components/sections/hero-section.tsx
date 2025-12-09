"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion"; // Tambahkan Variants jika perlu, tapi casting cukup
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // FIX: Tambahkan tipe eksplisit atau casting pada array ease
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.8,
        // Tambahkan 'as const' atau casting tuple eksplisit
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section ref={targetRef} className="relative h-screen w-full overflow-hidden bg-black">
      <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
      </motion.div>

      <motion.div style={{ y }} className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div custom={0} variants={textVariants} initial="hidden" animate="visible">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md">Established 2025 • Sumatera Barat</span>
        </motion.div>

        <div className="mb-6 overflow-hidden">
          <motion.h1 custom={1} variants={textVariants} initial="hidden" animate="visible" className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl font-serif">
            WIRADOOR
          </motion.h1>
        </div>

        <motion.p custom={2} variants={textVariants} initial="hidden" animate="visible" className="mb-8 max-w-2xl text-lg text-gray-200 md:text-xl font-light tracking-wide">
          Menghadirkan keindahan dan kekuatan pintu solid wood kualitas ekspor ke hunian Anda. Perpaduan sempurna antara teknologi pabrikasi dan seni kriya.
        </motion.p>

        <motion.div custom={3} variants={textVariants} initial="hidden" animate="visible" className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/produk">
            <MagneticButton className="group flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90">
              Lihat Koleksi
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </Link>
          <Link href="/hubungi-kami">
            <MagneticButton className="flex h-12 min-w-[160px] items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10">
              Konsultasi Gratis
            </MagneticButton>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </div>
      </motion.div>
    </section>
  );
}
