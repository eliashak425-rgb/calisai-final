import {
  Navbar,
  HeroSection,
  MarqueeSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Noise overlay for texture */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-50" />
      
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
