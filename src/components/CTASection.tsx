import Link from "next/link";
import { Phone, ArrowRight, MapPin } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import { getSiteSettings } from "@/lib/settings";

export default async function CTASection() {
  const settings = await getSiteSettings();

  return (
    <section className="py-20 lg:py-28 bg-navy relative overflow-hidden" id="cta-section">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-40 h-40 bg-gold/5 rounded-full " />
        <div className="absolute bottom-1/4 right-10 w-60 h-60 bg-gold/5 rounded-full " />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Own Your{" "}
              <span className="text-gradient-gold">Dream Plot?</span>
            </h2>
            <p className="text-white/60 mt-5 text-base leading-relaxed max-w-lg">
              Take the first step towards your dream investment. Fill in the
              form or call us directly to schedule a free site visit. Our team
              will guide you through every step.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <div>
                  <span className="text-xs text-white/40 block">Call Us At</span>
                  <span className="text-sm font-semibold">{settings.phone}</span>
                </div>
              </a>
              <Link
                href="/projects"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              >
                <MapPin className="w-5 h-5 text-gold" />
                <div>
                  <span className="text-xs text-white/40 block">Visit Our</span>
                  <span className="text-sm font-semibold">Project Sites</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-navy/50">
            <h3 className="font-heading text-xl font-bold text-navy mb-1">
              Get in Touch
            </h3>
            <p className="text-slate-medium text-sm mb-6">
              Fill in your details and we&apos;ll call you back within 24 hours.
            </p>
            <InquiryForm variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
