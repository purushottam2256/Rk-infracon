"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Are your plots DTCP approved and RERA registered?",
    a: "Yes, all our ventures are 100% DTCP Approved and RERA Registered, ensuring complete legal compliance and peace of mind for your investment.",
  },
  {
    q: "What locations do you offer plots in?",
    a: "We currently offer premium open plots in rapidly developing areas around Hyderabad including Shadnagar, Maheshwaram, Adibatla, and Shamshabad — all with excellent connectivity to ORR, NH-44, and the airport.",
  },
  {
    q: "Can I visit the site before purchasing?",
    a: "Absolutely! We encourage all prospective buyers to schedule a free site visit. Our team will personally guide you through the venture, show you the infrastructure, and answer all your questions on-site. Contact us to book a visit.",
  },
  {
    q: "What amenities are included in your ventures?",
    a: "Our ventures feature 40ft wide BT roads, underground drainage, 24/7 security with CCTV, street lighting, landscaped parks, children's play areas, compound walls, and avenue plantation — varying by project.",
  },
  {
    q: "Do you work with external agents or brokers?",
    a: "No. RK Infracon believes in direct customer relationships. We do not tie up with external agents or brokers, which means transparent pricing, no hidden commissions, and a hassle-free buying experience.",
  },
  {
    q: "What is the process for purchasing a plot?",
    a: "It's simple: (1) Schedule a site visit, (2) Choose your preferred plot, (3) Pay the booking amount, (4) Complete documentation and registration, (5) Get your registered sale deed. We assist you throughout the entire process.",
  },
];

export default function FAQSection() {
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
          {faqs.map((faq, i) => (
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
                  {faq.q}
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
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
