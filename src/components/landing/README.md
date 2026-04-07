# Landing Page Components

This directory contains all the sub-components for the Studio Ghibli streaming service landing page.

## Components

### HeroSection
- Full-screen hero with background image
- Call-to-action buttons (Start Free Trial, Watch Trailer)
- Gradient overlay effect

### FeaturesSection
- 4 feature cards with icons
- Highlights key service benefits
- Responsive grid layout

### VideoGridSection
- Grid of popular Studio Ghibli films
- Hover effects with play button
- Video metadata (duration, category, rating)
- Add to watchlist functionality

### PricingSection
- 3 pricing tiers (Basic, Standard, Premium)
- Feature comparison
- Highlighted "Most Popular" plan
- Call-to-action buttons

### FAQSection
- Accordion-based FAQ
- 6 common questions and answers
- Smooth expand/collapse animations

### Footer
- Company information and links
- Social media icons
- Newsletter subscription
- Multi-column layout

## Usage

All components are imported and used in `src/app/page.tsx`:

```tsx
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
// ... other imports

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <VideoGridSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
```

## Images Required

Add the following images to the `/public` directory:
- `hero-bg.jpg` - Hero section background
- `spirited-away.jpg` - Movie thumbnail
- `totoro.jpg` - Movie thumbnail
- `howls-castle.jpg` - Movie thumbnail
- `mononoke.jpg` - Movie thumbnail
- `kiki.jpg` - Movie thumbnail
- `wind-rises.jpg` - Movie thumbnail

## Customization

All components use:
- **shadcn/ui** components for UI elements
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Next.js Image** for optimized images

You can customize colors, text, and layout by editing the individual component files.
