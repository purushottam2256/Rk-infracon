import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchFilter from "@/components/SearchFilter";
import FeaturedVentures from "@/components/FeaturedVentures";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { createAdminClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createAdminClient();
  
  const [faqsRes, testimonialsRes] = await Promise.all([
    supabase.from("faqs").select("*").eq("active", true).order("sort_order", { ascending: true }),
    supabase.from("testimonials").select("*").eq("active", true).order("sort_order", { ascending: true })
  ]);
  
  const faqs = faqsRes.data || [];
  const testimonials = testimonialsRes.data || [];

  return (
    <main>
      <Navbar />
      <HeroSection />
      <SearchFilter />
      <FeaturedVentures />
      <CTASection />
      <WhyChooseUs />
      <TestimonialsSection initialTestimonials={testimonials} />
      <FAQSection initialFaqs={faqs} />
      <Footer />
    </main>
  );
}
