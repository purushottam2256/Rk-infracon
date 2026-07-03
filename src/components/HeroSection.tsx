"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown, Download } from "lucide-react";
import { PLACEHOLDER_IMAGES, COMPANY_INFO } from "@/lib/constants";

const slides = [
  {
    image: PLACEHOLDER_IMAGES.hero,
    tag: `${COMPANY_INFO.experience} Years of Excellence`,
    title: "Your Dream Plot Awaits",
    subtitle: "Premium DTCP Approved & RERA Registered Open Plots",
  },
  {
    image: PLACEHOLDER_IMAGES.heroAlt,
    tag: "Prime Locations",
    title: "Invest in Your Future",
    subtitle: "Prime Locations with World-Class Amenities",
  },
  {
    image: PLACEHOLDER_IMAGES.plotAerial1,
    tag: "Trusted Developers",
    title: "Building Communities",
    subtitle: "Transparent Transactions & Hassle-Free Documentation",
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
    tag: "High ROI",
    title: "Secure Your Legacy",
    subtitle: "High Returns on Investment in Rapidly Growing Corridors",
  },
  {
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1920&q=80",
    tag: "Premium Lifestyle",
    title: "Experience Premium Living",
    subtitle: "Modern Infrastructure Designed for Your Comfort",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden" id="hero-section">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/90" />
        </div>
      ))}

      {/* Floating Decorations */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-gold rounded-full animate-float opacity-60" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-gold/40 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-gold/50 rounded-full animate-float" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="animate-fade-in-up mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-semibold uppercase tracking-wider ">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            {slides[currentSlide].tag}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {slides[currentSlide].title.split(" ").map((word, i, arr) =>
            i >= arr.length - 2 ? (
              <span key={i} className="text-gradient-gold">
                {word}{" "}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/70 text-base sm:text-lg md:text-xl mt-5 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {slides[currentSlide].subtitle}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/projects"
            id="hero-explore-projects"
            className="group bg-gradient-gold text-navy px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-2xl hover:shadow-gold/30 transition-all duration-500 transform hover:scale-105 flex items-center gap-3"
          >
            Explore Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="/brochure.jpg"
            target="_blank"
            rel="noopener noreferrer"
            id="hero-download-brochure"
            className="group border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:border-gold/50 hover:bg-white/5 transition-all duration-500 flex items-center gap-3 "
          >
            <Download className="w-4 h-4 text-gold" />
            Download Brochure
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-6 sm:gap-12 mt-16 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          {[
            { value: COMPANY_INFO.experience, label: "Years Experience" },
            { value: COMPANY_INFO.happyCustomers, label: "Happy Customers" },
            { value: COMPANY_INFO.projectsDelivered, label: "Projects Delivered" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gradient-gold">
                {stat.value}
              </div>
              <div className="text-white/40 text-xs sm:text-sm mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-3 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-gold"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="w-6 h-6 text-gold/60" />
      </div>
    </section>
  );
}
