import { Hero } from "@/components/sections/Hero";
import { SportsCategories } from "@/components/sections/SportsCategories";
import { AboutSection } from "@/components/sections/AboutSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { RecentResultsSection } from "@/components/sections/RecentResultsSection";
import { PlayerRegistration } from "@/components/sections/PlayerRegistration";
import { CoachesSection } from "@/components/sections/CoachesSection";
import { MatchSchedule } from "@/components/sections/MatchSchedule";
import { RulesSection } from "@/components/sections/RulesSection";
import { WellnessSection } from "@/components/sections/WellnessSection";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { FeaturesSection } from "@/components/landing/features-section";
import { VideoGridSection } from "@/components/landing/video-grid-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";
import { GoToTop } from "@/components/common/GoToTop";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <AboutSection />
      <SportsCategories />
      <EventsSection />
      <RecentResultsSection />
      <ImpactSection />
      <SponsorsSection />
      <CoachesSection />
      <MatchSchedule />
      <RulesSection />
      <WellnessSection />
      <MediaGallery />
      <FeaturesSection />
      <VideoGridSection />
      <PricingSection />
      <FAQSection />
      <PlayerRegistration />
      <Footer />
      <GoToTop />
    </div>
  );
}
