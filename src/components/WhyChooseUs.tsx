import {
  Shield,
  Eye,
  Heart,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quality Assurance",
    description:
      "We prioritize quality in every aspect, from selecting prime locations to executing development with superior craftsmanship and durability.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "We build trust through transparent processes, keeping clients informed at every stage for complete clarity and assurance.",
  },
  {
    icon: Heart,
    title: "Customer-Centric",
    description:
      "Your satisfaction is our top priority. We go beyond transactions to ensure your experience is about realizing your dreams.",
  },
  {
    icon: Award,
    title: "Proven Credibility",
    description:
      "RK Infracon is a reputable company known for its integrity, transparent dealings, and secure investment opportunities with strong returns.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden" id="why-choose-us">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full " />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/3 rounded-full " />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Why Us
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight">
              Why Choose{" "}
              <span className="text-gradient-gold">RK Infracon?</span>
            </h2>
            <p className="text-slate-medium mt-5 text-base leading-relaxed">
              With a proven track record and commitment to excellence, we
              deliver premium plot developments that stand the test of time.
              Every venture reflects our dedication to quality, transparency,
              and customer satisfaction.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 mt-8">
              {["DTCP Approved", "RERA Registered", "Clear Titles"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-navy text-xs font-semibold border border-cream-dark"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {badge}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group p-6 rounded-2xl border border-cream-dark hover:border-gold/20 bg-cream hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-gold/5 ${
                  index % 2 === 1 ? "sm:mt-8" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 group-hover:scale-105 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-medium text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
