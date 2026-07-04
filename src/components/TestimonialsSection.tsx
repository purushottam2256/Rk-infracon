"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function TestimonialsSection({
  initialTestimonials = [],
}: {
  initialTestimonials?: Testimonial[];
}) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || initialTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % initialTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, initialTestimonials.length]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % initialTestimonials.length);
    setIsAutoPlaying(false);
  };
  const prev = () => {
    setCurrent((prev) => (prev - 1 + initialTestimonials.length) % initialTestimonials.length);
    setIsAutoPlaying(false);
  };

  if (!initialTestimonials || initialTestimonials.length === 0) return null;

  return (
    <section className="py-20 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-gold rounded-full " />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-gold rounded-full " />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            What Our <span className="text-gradient-gold">Customers</span> Say
          </h2>
        </div>

        <div className="relative">
          <div className="bg-white/5  border border-white/10 rounded-3xl p-8 sm:p-12">
            <Quote className="w-10 h-10 text-gold/30 mb-6" />
            <p className="text-white/80 text-lg leading-relaxed mb-8 min-h-[80px]">
              &ldquo;{initialTestimonials[current].text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: initialTestimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white font-heading font-bold">{initialTestimonials[current].name}</p>
                <p className="text-gold/60 text-sm">{initialTestimonials[current].role}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-gold hover:border-gold/30 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-gold hover:border-gold/30 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {initialTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
