import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedVentures from "@/components/FeaturedVentures";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedVentures />
      <CTASection />
      <WhyChooseUs />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
