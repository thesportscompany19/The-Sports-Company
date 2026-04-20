import Image from "next/image";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { CategoryCard } from "@/components/cards/CategoryCard";

function SportIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image src={src} alt={alt} width={48} height={48} className="h-12 w-12" />
  );
}

export interface SportCategory {
  icon: React.ReactNode;
  title: string;
}

const defaultCategories: SportCategory[] = [
  { icon: <SportIcon src="/images/svg/bat.png" alt="Cricket" />, title: "Cricket" },
  { icon: <SportIcon src="/images/svg/football.png" alt="Football" />, title: "Football" },
  { icon: <SportIcon src="/images/svg/tennis.svg" alt="Tennis" />, title: "Tennis" },
  { icon: <SportIcon src="/images/svg/bedminton.png" alt="Badminton" />, title: "Badminton" },
  { icon: <SportIcon src="/images/svg/tabletennis.svg" alt="Table Tennis" />, title: "Table Tennis" },
  { icon: <SportIcon src="/images/svg/swimming.png" alt="Swimming" />, title: "Swimming" },
  { icon: <SportIcon src="/images/svg/athletics.png" alt="Athletics" />, title: "Athletics" },
  { icon: <SportIcon src="/images/svg/chess.svg" alt="Chess" />, title: "Chess" },
  { icon: <SportIcon src="/images/svg/skating.svg" alt="Skating" />, title: "Skating" },
  { icon: <SportIcon src="/images/svg/pickleball.svg" alt="Pickleball" />, title: "Pickleball" },
];

interface SportsCategoriesProps {
  title?: string;
  subtitle?: string;
  categories?: SportCategory[];
}

export function SportsCategories({
  title = "Sports Categories",
  subtitle = "Choose your sport and start competing",
  categories = defaultCategories,
}: SportsCategoriesProps) {
  return (
    <SectionWrapper id="sports" title={title} subtitle={subtitle}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.title} icon={cat.icon} title={cat.title} />
        ))}
      </div>
      <div className="mt-12 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-[#042457]/95 via-[#031a3f]/90 to-[#042457]/95 p-8 shadow-[0_20px_60px_rgba(4,36,87,0.18)]">
        <div className="mx-auto flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f0e140]">
              Select Your Sport(s)
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Ready to register for your favourite sport?
            </h3>
            <p className="mt-3 text-sm text-slate-200/80 sm:text-base">
              Choose the categories you love and complete your player registration with one easy step.
            </p>
          </div>
          <a href="#register" className="w-full lg:w-auto">
            <PrimaryButton className="w-full lg:w-auto px-8 py-4 text-base font-semibold">
              Register as Player – ₹99
            </PrimaryButton>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
