import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Link from "next/link";
import { MapPin, ArrowUpRight, TrendingUp, LayoutGrid } from "lucide-react";
import { SEED_PROJECTS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 60; // Revalidate every 60 seconds

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Upcoming" },
  ongoing: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Ongoing" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Completed" },
  "sold-out": { bg: "bg-red-500/10", text: "text-red-500", label: "Sold Out" },
};

async function getFeaturedProjects() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3);
    
    if (data && data.length > 0) return data;
    throw new Error("No data");
  } catch {
    // Fallback to seed data if DB not ready
    return SEED_PROJECTS.filter((p) => p.featured).slice(0, 3).map(p => ({
      ...p,
      short_description: p.shortDescription,
      total_area: p.totalArea,
      total_plots: p.totalPlots,
      plot_sizes: p.plotSizes,
    }));
  }
}

export default async function FeaturedVentures() {
  const featured = await getFeaturedProjects();

  return (
    <section className="py-20 lg:py-28 bg-cream" id="featured-ventures">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <LayoutGrid className="w-3.5 h-3.5" />
            Our Ventures
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            Featured <span className="text-gradient-gold">Projects</span>
          </h2>
          <p className="text-slate-medium mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Discover our premium ventures in rapidly developing corridors.
            DTCP approved & RERA registered for your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              id={`featured-project-${project.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy/8 transition-all duration-500 transform hover:-translate-y-2 border border-cream-dark/50"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[project.status]?.bg || "bg-emerald-500/10"
                    } ${statusColors[project.status]?.text || "text-emerald-500"} `}
                  >
                    {statusColors[project.status]?.label || project.status}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1.5 rounded-lg bg-gold/90 text-navy text-xs font-bold ">
                    {project.price}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-navy group-hover:text-gold transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-slate-medium">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span className="text-sm">{project.location}</span>
                </div>
                <p className="text-slate-medium text-sm mt-3 line-clamp-2 leading-relaxed">
                  {project.short_description}
                </p>

                <div className="flex items-center gap-4 mt-5 pt-5 border-t border-cream-dark">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-slate-medium font-medium">
                      {project.total_area}
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-cream-dark rounded-full" />
                  <span className="text-xs text-slate-medium font-medium">
                    {project.total_plots} Plots
                  </span>
                  <div className="w-1 h-1 bg-cream-dark rounded-full" />
                  <span className="text-xs text-slate-medium font-medium">
                    {project.plot_sizes}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            id="featured-view-all"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-navy text-navy font-semibold text-sm hover:bg-navy hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
