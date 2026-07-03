import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, ArrowLeft, Ruler, LayoutGrid, TrendingUp,
  IndianRupee, CheckCircle, Phone, Download,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import ProjectGallery from "@/components/ProjectGallery";
import { COMPANY_INFO, SEED_PROJECTS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/server";

// Revalidate every 60 seconds so admin edits appear quickly
export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    return data;
  } catch {
    // Fallback to seed data if DB not ready
    const seed = SEED_PROJECTS.find((p) => p.slug === slug);
    if (!seed) return null;
    return {
      title: seed.title, slug: seed.slug, location: seed.location,
      description: seed.description, short_description: seed.shortDescription,
      price: seed.price, price_range: seed.priceRange, plot_sizes: seed.plotSizes,
      total_area: seed.totalArea, total_plots: seed.totalPlots, status: seed.status,
      thumbnail: seed.thumbnail, hero_image: seed.heroImage,
      gallery_images: seed.galleryImages, layout_image: seed.layoutImage,
      amenities: seed.amenities, highlights: seed.highlights,
      lat: seed.coordinates.lat, lng: seed.coordinates.lng,
    };
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found – RK Infracon" };
  return {
    title: `${project.title} – RK Infracon`,
    description: project.short_description,
  };
}

export async function generateStaticParams() {
  return SEED_PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const statusConfig: Record<string, { color: string; label: string }> = {
    upcoming: { color: "bg-amber-500", label: "Upcoming" },
    ongoing: { color: "bg-emerald-500", label: "Ongoing" },
    completed: { color: "bg-blue-500", label: "Completed" },
    "sold-out": { color: "bg-red-500", label: "Sold Out" },
  };

  const whatsappUrl = `https://wa.me/91${COMPANY_INFO.phone.replace(/[^0-9]/g, "")}?text=Hello%20RK%20Infracon%2C%0AI%20am%20interested%20in%20${encodeURIComponent(project.title)}.%20Please%20share%20more%20details.`;

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-0">
        <div className="relative h-[50vh] min-h-[400px]">
          <Image src={project.hero_image} alt={project.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/30" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
            <div className="max-w-7xl mx-auto">
              <Link href="/projects" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm mb-4 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
              </Link>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig[project.status]?.color || "bg-emerald-500"}`}>
                  {statusConfig[project.status]?.label || project.status}
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{project.title}</h1>
              <div className="flex items-center gap-2 mt-3">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-white/70">{project.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { icon: IndianRupee, label: "Price Range", value: project.price_range },
              { icon: Ruler, label: "Plot Sizes", value: project.plot_sizes },
              { icon: TrendingUp, label: "Total Area", value: project.total_area },
              { icon: LayoutGrid, label: "Total Plots", value: `${project.total_plots} Plots` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 py-6 px-6">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider block">{stat.label}</span>
                  <span className="text-white font-semibold text-sm">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="font-heading text-2xl font-bold text-navy mb-4">About This Project</h2>
                <p className="text-slate-medium leading-relaxed">{project.description}</p>
              </div>

              {project.gallery_images?.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Project Gallery</h2>
                  <ProjectGallery images={project.gallery_images} title={project.title} />
                </div>
              )}

              {project.layout_image && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Layout Plan</h2>
                  <div className="relative h-96 rounded-2xl overflow-hidden border border-cream-dark">
                    <Image src={project.layout_image} alt={`${project.title} Layout`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                  </div>
                </div>
              )}

              {/* Google Maps */}
              {project.lat && project.lng && project.lat !== 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Location Map</h2>
                  <div className="rounded-2xl overflow-hidden border border-cream-dark h-80">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${project.lng}!3d${project.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`}
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Project Location"
                    />
                  </div>
                </div>
              )}

              {project.amenities?.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Amenities & Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream-dark hover:border-gold/20 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4 text-gold" />
                        </div>
                        <span className="text-navy text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.highlights?.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Key Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.highlights.map((h: string) => (
                      <div key={h} className="flex items-center gap-3 p-4 bg-navy rounded-xl">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-white text-sm font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-cream-dark sticky top-28">
                <div className="text-center pb-6 border-b border-cream-dark mb-6">
                  <span className="text-slate-medium text-xs uppercase tracking-wider">Starting From</span>
                  <div className="text-3xl font-heading font-bold text-gradient-gold mt-1">{project.price}</div>
                </div>

                <h3 className="font-heading text-lg font-bold text-navy mb-4">Interested? Let&apos;s Talk</h3>
                <InquiryForm projectName={project.title} variant="compact" />

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-navy text-navy font-semibold text-xs hover:bg-navy hover:text-white transition-all">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-xs hover:bg-[#1da851] transition-all">
                    <Download className="w-4 h-4" /> WhatsApp
                  </a>
                </div>

                <a
                  href="/brochure.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-xl bg-cream text-navy font-semibold text-sm hover:bg-cream-dark transition-all border border-cream-dark"
                >
                  <Download className="w-4 h-4" />
                  Download Brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
