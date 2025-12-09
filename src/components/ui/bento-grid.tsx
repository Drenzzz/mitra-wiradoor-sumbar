import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={cn("grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto", className)}>{children}</div>;
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href: string;
}) => {
  return (
    <Link href={href} className={cn("row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none bg-neutral-950 border-white/[0.1] border overflow-hidden relative h-full block", className)}>
      <div className="absolute inset-0 z-0 transition duration-500 group-hover/bento:scale-110 h-full w-full">{header}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="relative z-20 group-hover/bento:translate-x-2 transition duration-200 h-full flex flex-col justify-end p-6">
        <div className="mb-2">{icon}</div>
        <div className="font-serif font-bold text-white mb-2 text-xl">{title}</div>
        <div className="font-sans font-normal text-gray-200 text-sm line-clamp-2">{description}</div>

        <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 -translate-x-4 transition-all duration-300 group-hover/bento:opacity-100 group-hover/bento:translate-x-0">
          Lihat Koleksi <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  );
};
