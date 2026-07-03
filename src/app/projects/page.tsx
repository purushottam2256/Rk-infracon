import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";
import { createAdminClient } from "@/lib/supabase/server";
import { SEED_PROJECTS } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Projects – RK Infracon | Premium Open Plots",
  description:
    "Explore RK Infracon's portfolio of premium open plot ventures. DTCP Approved & RERA Registered plots in prime locations across Hyderabad.",
};

async function getProjects() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data && data.length > 0) return data;
    throw new Error("No data");
  } catch {
    return SEED_PROJECTS.map(p => ({
      ...p,
      short_description: p.shortDescription,
      total_area: p.totalArea,
      total_plots: p.totalPlots,
      plot_sizes: p.plotSizes,
    }));
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-gold rounded-full " />
          <div className="absolute bottom-10 left-1/3 w-60 h-60 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            Our Portfolio
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Our <span className="text-gradient-gold">Projects</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto text-base">
            Discover premium open plots in the fastest-growing corridors
            around Hyderabad. Every venture is DTCP approved for your peace
            of mind.
          </p>
        </div>
      </section>

      <ProjectsGrid initialProjects={projects} />
      <Footer />
    </main>
  );
}
