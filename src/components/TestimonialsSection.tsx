"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Plot Owner, RK Green Valley",
    text: "Excellent experience with RK Infracon! The plots are exactly as promised — wide roads, proper drainage, and greenery everywhere. The team was transparent throughout the process. Highly recommend!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Investor, RK Paradise Enclave",
    text: "I purchased two plots as an investment and the appreciation has been fantastic. The location near ORR is strategic and the development quality is top-notch. Very trustworthy company.",
    rating: 5,
  },
  {
    name: "Suresh Reddy",
    role: "Plot Owner, RK Heritage Heights",
    text: "What impressed me most was the no-broker policy. Dealing directly with the company meant fair pricing and no hidden costs. My family is now building our dream home on the plot!",
    rating: 5,
  },
  {
    name: "Anitha Rao",
    role: "Homeowner, RK Green Valley",
    text: "From site visit to registration, everything was smooth. The DTCP approval and RERA registration gave us complete peace of mind. The community is wonderful with great amenities.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };
  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

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
              &ldquo;{testimonials[current].text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white font-heading font-bold">{testimonials[current].name}</p>
                <p className="text-gold/60 text-sm">{testimonials[current].role}</p>
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
            {testimonials.map((_, i) => (
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
