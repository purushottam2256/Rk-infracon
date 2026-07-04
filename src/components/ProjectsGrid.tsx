"use client";

import { useState, useMemo } from "react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Link from "next/link";
import {
  MapPin,
  ArrowUpRight,
  TrendingUp,
  Filter,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Upcoming" },
  ongoing: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Ongoing" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Completed" },
  "sold-out": { bg: "bg-red-500/10", text: "text-red-500", label: "Sold Out" },
};

const statusFilters = ["All", "Ongoing", "Upcoming", "Completed"];

export default function ProjectsGrid({ initialProjects }: { initialProjects: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      // Status Filter
      if (activeFilter !== "All" && p.status.toLowerCase() !== activeFilter.toLowerCase()) {
        return false;
      }
      
      // Location or Title Search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesLocation = p.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [activeFilter, initialProjects, searchQuery]);

  return (
    <section className="py-16 bg-cream" id="projects-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-10">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium" />
            <input
              type="text"
              placeholder="Search by name or location (e.g. Shadnagar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-medium hidden sm:block" />
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-navy text-white shadow-lg"
                      : "bg-white text-slate-medium hover:bg-cream-dark border border-cream-dark"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-cream-dark hidden sm:flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-navy text-white"
                    : "text-slate-medium hover:text-navy"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-navy text-white"
                    : "text-slate-medium hover:text-navy"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-slate-medium text-sm mb-6">
          Showing {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
        </p>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy/8 transition-all duration-500 transform hover:-translate-y-2 border border-cream-dark/50"
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
                    <span className="px-3 py-1.5 rounded-lg bg-gold/90 text-navy text-xs font-bold">
                      {project.price}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-navy group-hover:text-gold transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-slate-medium">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <p className="text-slate-medium text-sm mt-3 line-clamp-2">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy/8 transition-all duration-500 border border-cream-dark/50"
              >
                <div className="relative w-full sm:w-72 h-48 sm:h-auto shrink-0 overflow-hidden">
                  <ImageWithFallback
                    src={project.thumbnail || project.hero_image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[project.status]?.bg || "bg-emerald-500/10"
                      } ${statusColors[project.status]?.text || "text-emerald-500"} `}
                    >
                      {statusColors[project.status]?.label || project.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-navy group-hover:text-gold transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5 text-slate-medium">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-sm font-bold shrink-0">
                        {project.price}
                      </span>
                    </div>
                    <p className="text-slate-medium text-sm mt-3 line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-cream-dark">
                    <span className="text-xs text-slate-medium font-medium">
                      {project.total_area}
                    </span>
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
        )}
      </div>
    </section>
  );
}
