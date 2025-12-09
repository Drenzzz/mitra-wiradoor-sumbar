import { cn } from "@/lib/utils";
import Link from "next/link";

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={cn("grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ", className)}>{children}</div>;
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
  href?: string;
}) => {
  const containerClasses = cn(
    "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none bg-white dark:bg-neutral-950 border border-transparent dark:border-white/[0.1] overflow-hidden relative h-full flex flex-col justify-end",
    className
  );

  const content = (
    <>
      <div className="absolute inset-0 z-0 transition duration-500 group-hover/bento:scale-110 h-full w-full">{header}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="relative z-20 group-hover/bento:translate-x-2 transition duration-200 h-full flex flex-col justify-end p-6">
        <div className="mb-2 transition duration-200 group-hover/bento:-translate-y-1">{icon}</div>
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">{title}</div>
        <div className="font-sans font-normal text-neutral-300 text-xs">{description}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};
