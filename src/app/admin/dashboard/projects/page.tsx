"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  MapPin,
  Eye,
  Star,
  RefreshCw,
} from "lucide-react";
import HouseLoader from "@/components/HouseLoader";

interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  short_description: string;
  price: string;
  status: string;
  featured: boolean;
  thumbnail: string;
  total_plots: number;
  total_area: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-500",
  ongoing: "bg-emerald-500/10 text-emerald-500",
  completed: "bg-amber-500/10 text-amber-500",
  "sold-out": "bg-red-500/10 text-red-500",
};

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      setError("Failed to load projects. Check your database connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This will also remove all associated images from storage.`)) {
      return;
    }

    setDeleting(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch {
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy flex items-center gap-3">
            <Building2 className="w-8 h-8 text-gold" />
            Projects Manager
          </h1>
          <p className="text-slate-medium mt-1">
            Add, edit, or remove property listings from your website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream-dark text-navy text-sm font-medium hover:bg-cream-dark transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/admin/dashboard/projects/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <HouseLoader className="py-20" />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="font-heading text-lg font-bold text-navy">Connection Issue</h3>
          <p className="text-slate-medium text-sm mt-2 max-w-md">{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-4 px-4 py-2 rounded-lg bg-gold text-navy text-sm font-semibold hover:bg-gold-dark transition-all"
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-cream-dark">
          <Building2 className="w-16 h-16 text-slate-medium/20 mb-4" />
          <h3 className="font-heading text-xl font-bold text-navy">No Projects Yet</h3>
          <p className="text-slate-medium text-sm mt-2 max-w-md">
            Start by adding your first property project.
          </p>
          <Link
            href="/admin/dashboard/projects/new"
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-cream-dark overflow-hidden hover:shadow-lg hover:shadow-navy/5 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  ) : (
                    <div className="w-full h-full bg-cream-dark flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-slate-medium/30" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-gold text-navy text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-heading text-lg font-bold text-navy truncate">
                        {project.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColors[project.status] || statusColors.ongoing}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-medium text-sm mb-2">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      {project.location}
                    </div>
                    <p className="text-slate-medium text-sm line-clamp-1">
                      {project.short_description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-medium">
                      <span className="font-semibold text-navy">{project.price}</span>
                      {project.total_area && <span>• {project.total_area}</span>}
                      {project.total_plots > 0 && <span>• {project.total_plots} plots</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="p-2.5 rounded-lg border border-cream-dark text-slate-medium hover:text-navy hover:bg-cream-dark transition-all"
                      title="View on site"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/dashboard/projects/${project.id}`}
                      className="p-2.5 rounded-lg border border-cream-dark text-slate-medium hover:text-gold hover:border-gold/30 transition-all"
                      title="Edit project"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
                      disabled={deleting === project.id}
                      className="p-2.5 rounded-lg border border-cream-dark text-slate-medium hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50"
                      title="Delete project"
                    >
                      {deleting === project.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
