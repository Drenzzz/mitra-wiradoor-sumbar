"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Ruler, ThermometerSun, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Presisi Teknologi",
    description: "Diproduksi menggunakan mesin pabrikasi berteknologi tinggi untuk menjamin akurasi ukuran dan potongan yang sempurna di setiap milimeter.",
    icon: <Ruler className="h-8 w-8 text-primary" strokeWidth={1} />,
  },
  {
    title: "Standar Ekspor",
    description: "Kualitas yang diakui dunia. Produk Wiradoor telah menembus pasar internasional di Amerika, Australia, hingga Eropa.",
    icon: <Award className="h-8 w-8 text-primary" strokeWidth={1} />,
  },
  {
    title: "Kiln-Dried System",
    description: "Melalui proses pengovenan (kiln-dry) intensif untuk mengurangi kadar air, mencegah penyusutan, dan menjaga kestabilan kayu jangka panjang.",
    icon: <ThermometerSun className="h-8 w-8 text-primary" strokeWidth={1} />,
  },
  {
    title: "Custom Design",
    description: "Wujudkan visi arsitektur Anda. Kami melayani pembuatan pintu dengan desain, ukuran, dan spesifikasi khusus sesuai kebutuhan proyek.",
    icon: <PenTool className="h-8 w-8 text-primary" strokeWidth={1} />,
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] as const },
    },
  };

  return (
    <section className="bg-neutral-950 py-32 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-24 flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <span className="mb-6 block text-sm font-medium uppercase tracking-[0.2em] text-primary">The Wiradoor Standard</span>
            <h2 className="font-serif text-5xl font-light leading-[1.1] md:text-7xl">
              Lebih dari sekadar pintu. <br />
              <span className="text-white/40">Sebuah dedikasi pada kualitas.</span>
            </h2>
          </div>

          <div className="h-px w-full flex-1 bg-white/10 md:mb-4" />
        </div>

        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="group flex flex-col items-start">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-500 group-hover:border-primary/50 group-hover:bg-primary/10">{feature.icon}</div>

              <h3 className="mb-4 font-serif text-2xl text-white transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>

              <p className="leading-relaxed text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
