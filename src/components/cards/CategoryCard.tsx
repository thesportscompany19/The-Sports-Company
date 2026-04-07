import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}

export function CategoryCard({ icon, title, className }: CategoryCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition cursor-pointer",
        className
      )}
    >
      <div className="h-12 w-12 text-[#0B1C2D]">{icon}</div>
      <span className="mt-3 text-sm font-medium text-[#0B1C2D]">{title}</span>
    </div>
  );
}
