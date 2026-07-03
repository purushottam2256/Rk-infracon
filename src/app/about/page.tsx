import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Award,
  Target,
  Eye,
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Handshake,
  TreePine,
  Building2,
  MapPin,
  Heart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PLACEHOLDER_IMAGES, COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us – RK Infracon",
  description:
    "Learn about RK Infracon, our mission, vision, and our founder's journey in the real estate industry. Trusted real estate developer in Hyderabad.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-gold rounded-full " />
          <div className="absolute bottom-10 left-1/3 w-60 h-60 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5" />
            About Us
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Trust In <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto text-base">
            Building sustainable communities with transparency, integrity, and a
            commitment to excellence that spans over two decades.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative h-[520px] rounded-3xl overflow-hidden border border-cream-dark shadow-xl">
              <Image
                src={PLACEHOLDER_IMAGES.about}
                alt="RK Infracon Office"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-navy/20" />
              {/* Floating Stats Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 rounded-2xl p-5 border border-cream-dark">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-gold">
                      {COMPANY_INFO.experience}
                    </div>
                    <div className="text-[10px] text-slate-medium uppercase tracking-wider font-semibold">
                      Years
                    </div>
                  </div>
                  <div className="w-px h-10 bg-cream-dark" />
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-gold">
                      {COMPANY_INFO.projectsDelivered}
                    </div>
                    <div className="text-[10px] text-slate-medium uppercase tracking-wider font-semibold">
                      Projects
                    </div>
                  </div>
                  <div className="w-px h-10 bg-cream-dark" />
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-gold">
                      {COMPANY_INFO.happyCustomers}
                    </div>
                    <div className="text-[10px] text-slate-medium uppercase tracking-wider font-semibold">
                      Happy Families
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Our Story
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy">
                From a Vision to a{" "}
                <span className="text-gradient-gold">Legacy</span>
              </h2>
              <p className="text-slate-medium leading-relaxed">
                RK Infracon was founded with a singular vision — to make land
                ownership accessible, transparent, and rewarding for every
                Indian family. What began as a small venture in Hyderabad has
                grown into one of the region&apos;s most trusted real estate
                development firms, with a portfolio spanning multiple premium
                ventures across Telangana.
              </p>
              <p className="text-slate-medium leading-relaxed">
                Our journey has been defined by an unwavering commitment to
                quality, legal clarity, and customer satisfaction. Every plot we
                develop is backed by DTCP approvals, RERA registration, and
                meticulous infrastructure planning — from wide internal roads
                and underground drainage to landscaped gardens and 24/7
                security.
              </p>
              <p className="text-slate-medium leading-relaxed">
                We don&apos;t just sell plots; we create communities where
                families can build their dream homes with complete confidence
                and peace of mind. Our after-sales support and transparent
                documentation process ensure that your investment journey with
                us is as smooth as it is rewarding.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Our Philosophy & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-6">
                <Shield className="w-3.5 h-3.5" />
                Our Core Values
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mb-6">
                Integrity in Every Transaction
              </h2>
              <div className="space-y-6 text-slate-medium leading-relaxed text-lg">
                <p>
                  At RK Infracon, our core values are deeply embedded in everything we do. We believe that real estate is not just about buying and selling land; it is about building enduring trust and fostering lifelong relationships. Our commitment to absolute integrity means that we maintain the highest standards of honesty and ethical conduct in all our dealings. Every document we sign, every transaction we process, and every promise we make is backed by a steadfast dedication to doing what is right.
                </p>
                <p>
                  Trust is the currency of our business. We understand that investing in a plot is a significant milestone for any family, often representing years of hard-earned savings. Therefore, we ensure that our operations are entirely transparent. From the initial site visit to the final property registration, our clients are kept informed and empowered. There are no hidden fees, no ambiguous terms, and no unpleasant surprises—just a smooth, legally compliant, and customer-first experience.
                </p>
                <p>
                  Furthermore, we are champions of sustainability. Our ventures are designed to live in harmony with nature. We integrate eco-friendly practices such as rainwater harvesting systems, extensive avenue plantations, and solar street lighting into our projects, ensuring that our communities are not only beautiful today but remain sustainable for future generations.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-cream-dark my-16" />

            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-6">
                <TrendingUp className="w-3.5 h-3.5" />
                Why Invest With Us
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mb-6">
                A Foundation Built on Legality and Growth
              </h2>
              <div className="space-y-6 text-slate-medium leading-relaxed text-lg">
                <p>
                  When you invest with RK Infracon, you are securing a piece of land that is 100% legally clear and completely hassle-free. We exclusively deal in properties that are strictly DTCP (Directorate of Town and Country Planning) Approved and fully RERA (Real Estate Regulatory Authority) Registered. Our stringent legal due diligence process ensures that every plot has a clear title, meaning you can invest with absolute peace of mind without worrying about future legal complications.
                </p>
                <p>
                  Our strategic foresight sets us apart. We don&apos;t just acquire land anywhere; we meticulously analyze infrastructure growth patterns and government development plans. By identifying high-growth corridors—such as areas adjacent to the Outer Ring Road (ORR), the proposed Regional Ring Road (RRR), and emerging IT/industrial hubs—we ensure that our investors benefit from rapid land appreciation. This proactive approach to land acquisition has consistently delivered exceptional returns for our clients over the years.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-cream-dark my-16" />

            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-6">
                <MapPin className="w-3.5 h-3.5" />
                Our Meticulous Approach
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mb-6">
                Transforming Raw Land into Premium Communities
              </h2>
              <div className="space-y-6 text-slate-medium leading-relaxed text-lg">
                <p>
                  Our development approach is comprehensive and highly structured. It begins with careful land acquisition in prime geographic locations. Once a site is secured, our legal team conducts an exhaustive verification process, clearing all encumbrances and obtaining the necessary government approvals. This rigorous foundational work is what guarantees the security of your investment.
                </p>
                <p>
                  Following legal clearance, we focus heavily on premium infrastructure development. We believe a plot is only as good as the amenities that surround it. Our engineering teams lay down high-quality blacktop roads, install robust underground drainage systems, establish reliable electricity and water supply networks, and design beautifully landscaped parks and secure compound walls. 
                </p>
                <p>
                  The final step is a seamless customer handover. We assist our clients through every stage of the documentation and registration process. Even after the sale is complete, our dedicated after-sales service team remains available to support you, proving that our relationship with our clients extends far beyond a mere transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold rounded-full " />
          <div className="absolute top-10 right-10 w-48 h-48 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Mission & <span className="text-gradient-gold">Vision</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <Target className="w-12 h-12 text-gold mb-6" />
              <h3 className="font-heading text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                To provide high-quality, legally clear, and affordable real
                estate opportunities to every Indian family. We strive to create
                sustainable communities that harmonize with nature while
                delivering exceptional value and fostering long-term trust.
              </p>
              <p className="text-white/70 leading-relaxed">
                We are committed to raising the bar in the open plot development
                industry by setting new standards for transparency,
                infrastructure quality, and customer experience. Every venture
                we undertake is driven by the goal of making land ownership a
                safe, simple, and rewarding experience.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <Eye className="w-12 h-12 text-gold mb-6" />
              <h3 className="font-heading text-2xl font-bold text-white mb-4">
                Our Vision
              </h3>
              <p className="text-white/70 leading-relaxed mb-4">
                To be the most trusted and preferred real estate developer in
                the region, known for our uncompromising quality, transparency,
                and dedication to building enduring relationships with our
                clients and stakeholders.
              </p>
              <p className="text-white/70 leading-relaxed">
                We envision a future where every family has access to premium,
                well-developed plots in thriving locations — communities that
                are not just addresses, but legacies that appreciate in value
                and meaning over generations. RK Infracon aims to be the
                benchmark for trust in Indian real estate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-gold text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mb-4">
            Ready to Find Your Perfect Plot?
          </h2>
          <p className="text-navy/70 mb-8 max-w-xl mx-auto">
            Join {COMPANY_INFO.happyCustomers} happy families who have already
            invested with RK Infracon. Contact us today to explore our premium
            properties and schedule a free site visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-navy-light hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Contact Us Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Explore Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
