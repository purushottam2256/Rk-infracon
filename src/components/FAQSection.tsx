"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection({ initialFaqs = [] }: { initialFaqs?: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQs
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-slate-medium mt-3 max-w-xl mx-auto">
            Everything you need to know about investing in RK Infracon plots.
          </p>
        </div>

        <div className="space-y-3">
          {initialFaqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === i
                  ? "border-gold/20 shadow-lg shadow-gold/5"
                  : "border-cream-dark hover:border-gold/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-navy text-sm pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-60 pb-5" : "max-h-0"
                }`}
              >
                <p className="px-6 text-slate-medium text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
