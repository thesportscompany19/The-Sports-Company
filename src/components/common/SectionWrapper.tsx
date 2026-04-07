import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({
  title,
  subtitle,
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("py-24 px-4 md:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-[#0B1C2D]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
