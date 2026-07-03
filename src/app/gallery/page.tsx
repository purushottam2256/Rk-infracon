import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryContent from "@/components/GalleryContent";

export const metadata: Metadata = {
  title: "Gallery – RK Infracon | Photos & Videos",
  description:
    "Explore our gallery of project images, aerial views, infrastructure photos, and video walkthroughs of RK Infracon ventures.",
};

export default function GalleryPage() {
  return (
    <main>
      <Navbar />
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/3 w-80 h-80 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            Gallery
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Our <span className="text-gradient-gold">Gallery</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto text-base">
            Browse through photos and videos of our ventures, infrastructure, and happy customers.
          </p>
        </div>
      </section>
      <GalleryContent />
      <Footer />
    </main>
  );
}
