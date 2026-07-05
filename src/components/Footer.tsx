import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Camera,
  Play,
  Briefcase,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { getSiteSettings } from "@/lib/settings";
import { createAdminClient } from "@/lib/supabase/server";

async function getProjectsForFooter() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("projects")
      .select("title, slug")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data && data.length > 0) return data;
    throw new Error("No data");
  } catch {
    return [
      { title: "RK Green Valley", slug: "rk-green-valley" },
      { title: "RK Paradise Enclave", slug: "rk-paradise-enclave" },
      { title: "RK Sunrise City", slug: "rk-sunrise-city" },
      { title: "RK Heritage Heights", slug: "rk-heritage-heights" },
    ];
  }
}

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const projects = await getProjectsForFooter();
  const settings = await getSiteSettings();

  return (
    <footer className="bg-gradient-navy text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full " />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold rounded-full " />
      </div>

      {/* CTA Band */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold">
                Ready to Invest in Your{" "}
                <span className="text-gradient-gold">Dream Plot?</span>
              </h3>
              <p className="text-white/60 mt-2 text-sm">
                Book a free site visit today and explore our premium ventures.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/contact?tab=visit"
                id="footer-cta-contact"
                className="bg-gradient-gold text-navy px-7 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                Book Site Visit
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${settings.phone}`}
                className="border border-gold/40 text-gold px-7 py-3 rounded-full font-semibold text-sm hover:bg-gold/10 transition-all duration-300 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
                <img src="/logo.png" alt="RK Infracon Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg group-hover:text-gold transition-colors">
                  RK Infracon
                </span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {settings.tagline}. We deliver premium DTCP approved & RERA
              registered open plots with world-class amenities and transparent
              transactions.
            </p>
            <div className="flex gap-3">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
              >
                <Play className="w-4 h-4" />
              </a>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
              >
                <Briefcase className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gold rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-gold text-sm transition-all duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-white/30 hover:text-white/50 text-xs transition-all duration-200"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Projects — Dynamic */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gold rounded-full" />
              Our Projects
            </h4>
            <ul className="space-y-2.5">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-white/50 hover:text-gold text-sm transition-all duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gold rounded-full" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-start gap-3 text-white/50 hover:text-gold transition-all duration-200 group"
              >
                <Phone className="w-4 h-4 mt-0.5 text-gold/60 group-hover:text-gold" />
                <span className="text-sm">{settings.phone}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-3 text-white/50 hover:text-gold transition-all duration-200 group"
              >
                <Mail className="w-4 h-4 mt-0.5 text-gold/60 group-hover:text-gold" />
                <span className="text-sm">{settings.email}</span>
              </a>
              <div className="flex items-start gap-3 text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/60 shrink-0" />
                <span className="text-sm">{settings.address}</span>
              </div>
              <div className="flex items-start gap-3 text-white/50">
                <Clock className="w-4 h-4 mt-0.5 text-gold/60" />
                <span className="text-sm">{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © {currentYear} RK Infracon. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-white/30 hover:text-white/50 text-xs transition-all"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/30 hover:text-white/50 text-xs transition-all"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
