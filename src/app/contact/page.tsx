import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us – RK Infracon | Get in Touch",
  description:
    "Contact RK Infracon to schedule a free site visit, inquire about our premium plots, or learn more about our ventures. We're here to help.",
};

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: COMPANY_INFO.phone,
    href: `tel:${COMPANY_INFO.phone}`,
    description: "Call us for immediate assistance",
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY_INFO.email,
    href: `mailto:${COMPANY_INFO.email}`,
    description: "Drop us an email anytime",
  },
  {
    icon: MapPin,
    label: "Office",
    value: COMPANY_INFO.address,
    href: "#",
    description: "Visit our office",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: COMPANY_INFO.workingHours,
    href: "#",
    description: "We're available during",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Get in Touch
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto text-base">
            Have questions? Want to schedule a site visit? We&apos;re here to
            help you find your perfect plot.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-navy mb-2">
                  Let&apos;s Start a Conversation
                </h2>
                <p className="text-slate-medium text-sm">
                  Reach out to us through any of the channels below, or fill in
                  the form and we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-cream-dark hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 group-hover:scale-105 transition-all duration-300">
                      <info.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-medium uppercase tracking-wider">
                        {info.description}
                      </span>
                      <p className="text-navy font-semibold text-sm mt-0.5">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
                <h3 className="font-heading text-xl font-bold text-navy mb-1">
                  Send Us a Message
                </h3>
                <p className="text-slate-medium text-sm mb-6">
                  Fill in the form below and our team will reach out to you shortly.
                </p>
                <InquiryForm variant="default" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4!2d78.3497!3d17.4435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93e0e5fd6a1f%3A0x0!2sGachibowli%2C%20Hyderabad!5e0!3m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="RK Infracon Office - Gachibowli, Hyderabad"
        />
      </section>

      <Footer />
    </main>
  );
}
