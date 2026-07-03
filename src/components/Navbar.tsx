"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, Settings } from "lucide-react";
import { NAV_LINKS, COMPANY_INFO } from "@/lib/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProjectsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/95  shadow-2xl shadow-navy/20 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/#hero-section" className="flex items-center gap-3 group" id="nav-logo">
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center transform transition-transform group-hover:scale-105 shadow-lg rounded-full overflow-hidden">
                <img src="/logo.png" alt="RK Infracon Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -inset-1 bg-gold/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-heading font-bold text-xl tracking-wide leading-tight">
                RK Infracon
              </span>
              <span className="text-gold/70 text-[10px] uppercase tracking-[0.2em] font-medium">
                {COMPANY_INFO.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                    isActive(link.href)
                      ? "text-gold bg-gold/10"
                      : "text-white/80 hover:text-gold hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {link.label === "Projects" && (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Projects dropdown */}
                {link.label === "Projects" && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-navy-light border border-gold/10 rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
                      <div className="p-2">
                        {[
                          { name: "RK Green Valley", slug: "rk-green-valley" },
                          { name: "RK Paradise Enclave", slug: "rk-paradise-enclave" },
                          { name: "RK Sunrise City", slug: "rk-sunrise-city" },
                          { name: "RK Heritage Heights", slug: "rk-heritage-heights" },
                        ].map((project) => (
                          <Link
                            key={project.slug}
                            href={`/projects/${project.slug}`}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-gold hover:bg-gold/5 rounded-lg transition-all duration-200"
                          >
                            {project.name}
                          </Link>
                        ))}
                        <div className="border-t border-gold/10 mt-1 pt-1">
                          <Link
                            href="/projects"
                            className="block px-4 py-2.5 text-sm text-gold hover:bg-gold/5 rounded-lg transition-all duration-200 font-medium"
                          >
                            View All Projects →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin"
              id="nav-admin-panel"
              className="flex items-center gap-2 text-white/50 hover:text-gold px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/5"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              id="nav-call-now"
              className="group flex items-center gap-2.5 bg-gradient-gold text-navy px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-4 h-4 animate-pulse-gold rounded-full" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 text-white hover:text-gold rounded-lg hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] mt-4" : "max-h-0"
          }`}
        >
          <div className="bg-navy-light/95  rounded-2xl border border-gold/10 p-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-gold bg-gold/10"
                      : "text-white/80 hover:text-gold hover:bg-white/5"
                  }`}
                  onClick={
                    link.label === "Projects"
                      ? (e) => {
                          e.preventDefault();
                          setProjectsOpen(!projectsOpen);
                        }
                      : undefined
                  }
                >
                  {link.label}
                  {link.label === "Projects" && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        projectsOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
                {link.label === "Projects" && projectsOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gold/20 pl-4">
                    {[
                      { name: "RK Green Valley", slug: "rk-green-valley" },
                      { name: "RK Paradise Enclave", slug: "rk-paradise-enclave" },
                      { name: "RK Sunrise City", slug: "rk-sunrise-city" },
                      { name: "RK Heritage Heights", slug: "rk-heritage-heights" },
                    ].map((project) => (
                      <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="block px-3 py-2 text-sm text-white/60 hover:text-gold rounded-lg transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {project.name}
                      </Link>
                    ))}
                    <Link
                      href="/projects"
                      className="block px-3 py-2 text-sm text-gold font-medium rounded-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      View All →
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-gold/10 space-y-2">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 border border-gold/30 text-gold px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gold/10 transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center justify-center gap-2 bg-gradient-gold text-navy px-5 py-3 rounded-xl font-semibold text-sm"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
