import Image from "next/image";
import { SectionWrapper } from "@/components/common/SectionWrapper";
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
  { icon: <SportIcon src="/images/svg/basket.png" alt="Basketball" />, title: "Basketball" },
  { icon: <SportIcon src="/images/svg/tennis.png" alt="Tennis" />, title: "Tennis" },
  { icon: <SportIcon src="/images/svg/bedminton.png" alt="Badminton" />, title: "Badminton" },
  { icon: <SportIcon src="/images/svg/tabletennis.png" alt="Table Tennis" />, title: "Table Tennis" },
  { icon: <SportIcon src="/images/svg/handball.png" alt="Hockey" />, title: "Hockey" },
  { icon: <SportIcon src="/images/svg/hacky.png" alt="Volleyball" />, title: "Volleyball" },
  { icon: <SportIcon src="/images/svg/swimming.png" alt="Swimming" />, title: "Swimming" },
  { icon: <SportIcon src="/images/svg/athletics.png" alt="Athletics" />, title: "Athletics" },
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
    </SectionWrapper>
  );
}
