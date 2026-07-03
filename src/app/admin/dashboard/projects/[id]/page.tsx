"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2, ImageIcon,
} from "lucide-react";
import { uploadImage, compressImage } from "@/lib/image-utils";

interface ProjectData {
  title: string; location: string; description: string; short_description: string;
  price: string; price_range: string; plot_sizes: string; total_area: string;
  total_plots: number; status: string; featured: boolean;
  thumbnail: string; hero_image: string; gallery_images: string[];
  layout_image: string; amenities: string[]; highlights: string[];
  lat: number; lng: number;
}

const emptyProject: ProjectData = {
  title: "", location: "", description: "", short_description: "",
  price: "", price_range: "", plot_sizes: "", total_area: "",
  total_plots: 0, status: "ongoing", featured: false,
  thumbnail: "", hero_image: "", gallery_images: [],
  layout_image: "", amenities: [], highlights: [],
  lat: 0, lng: 0,
};

export default function ProjectEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [form, setForm] = useState<ProjectData>(emptyProject);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [newAmenity, setNewAmenity] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setForm(data.project);
    } catch { router.push("/admin/dashboard/projects"); }
    finally { setLoading(false); }
  }, [id, router]);

  useEffect(() => { if (!isNew) fetchProject(); }, [isNew, fetchProject]);

  const updateField = (field: keyof ProjectData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "hero_image" | "layout_image",
    maxWidth: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadImage(file, "projects", form[field] || undefined, maxWidth);
      updateField(field, url);
    } catch { alert("Upload failed. Try again."); }
    finally { setUploading(null); e.target.value = ""; }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading("gallery");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, "gallery", undefined, 1200);
        urls.push(url);
      }
      updateField("gallery_images", [...form.gallery_images, ...urls]);
    } catch { alert("Some uploads failed."); }
    finally { setUploading(null); e.target.value = ""; }
  };

  const removeGalleryImage = async (index: number) => {
    const url = form.gallery_images[index];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    // Delete from storage via upload API with empty file trick — or just remove from array
    // The image stays in storage but URL is removed. Full cleanup happens on project delete.
    // For immediate cleanup, call the upload endpoint with old_url
    if (url.includes(supabaseUrl)) {
      try {
        const formData = new FormData();
        const emptyBlob = new Blob([""], { type: "image/webp" });
        formData.append("file", emptyBlob, "del.webp");
        formData.append("folder", "_trash");
        formData.append("old_url", url);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          // Delete the trash file too
          if (data.path) {
            // Small cleanup — acceptable overhead
          }
        }
      } catch { /* best effort */ }
    }
    updateField("gallery_images", form.gallery_images.filter((_, i) => i !== index));
  };

  const addListItem = (field: "amenities" | "highlights", value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    updateField(field, [...form[field], value.trim()]);
    setter("");
  };

  const removeListItem = (field: "amenities" | "highlights", index: number) =>
    updateField(field, form[field].filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!form.title.trim()) { alert("Project title is required"); return; }
    setSaving(true);
    try {
      const url = isNew ? "/api/projects" : `/api/projects/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/dashboard/projects");
    } catch { alert("Failed to save. Try again."); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
    </div>
  );

  const ImageUploadBox = ({ field, label, maxW, current }: {
    field: "thumbnail" | "hero_image" | "layout_image"; label: string; maxW: number; current: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">{label}</label>
      <div className="relative h-40 bg-cream rounded-xl border-2 border-dashed border-cream-dark overflow-hidden group">
        {current ? (
          <>
            <Image src={current} alt={label} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all flex items-center justify-center">
              <label className="opacity-0 group-hover:opacity-100 cursor-pointer bg-white text-navy px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-gold transition-all">
                <Upload className="w-3.5 h-3.5" /> Replace
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field, maxW)} />
              </label>
            </div>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer text-slate-medium hover:text-gold transition-all">
            <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
            <span className="text-xs font-medium">Click to upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field, maxW)} />
          </label>
        )}
        {uploading === field && (
          <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/dashboard/projects")} className="p-2 rounded-lg border border-cream-dark hover:bg-cream-dark transition-all">
            <ArrowLeft className="w-5 h-5 text-navy" />
          </button>
          <h1 className="font-heading text-2xl font-bold text-navy">
            {isNew ? "Add New Project" : "Edit Project"}
          </h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Project"}
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-navy border-b border-cream-dark pb-3">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Project Title *</label>
            <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. RK Green Valley" className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Shadnagar, Hyderabad" className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Price</label>
            <input type="text" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="e.g. ₹15,999/sq.yd" className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Price Range</label>
            <input type="text" value={form.price_range} onChange={(e) => updateField("price_range", e.target.value)} placeholder="e.g. ₹15,999 - ₹22,999 per sq.yd" className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Plot Sizes</label>
            <input type="text" value={form.plot_sizes} onChange={(e) => updateField("plot_sizes", e.target.value)} placeholder="e.g. 150 - 500 sq.yds" className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Total Area</label>
            <input type="text" value={form.total_area} onChange={(e) => updateField("total_area", e.target.value)} placeholder="e.g. 50 Acres" className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Total Plots</label>
            <input type="number" value={form.total_plots} onChange={(e) => updateField("total_plots", parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 outline-none transition-all">
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="sold-out">Sold Out</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="w-4 h-4 accent-gold" />
            <label htmlFor="featured" className="text-sm font-medium text-navy">Mark as Featured Project</label>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-navy border-b border-cream-dark pb-3">Descriptions</h2>
        <div>
          <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Short Description</label>
          <textarea value={form.short_description} onChange={(e) => updateField("short_description", e.target.value)} rows={2} placeholder="Brief one-liner for cards and listings..." className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Full Description</label>
          <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={5} placeholder="Detailed project description for the detail page..." className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all resize-none" />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 space-y-5">
        <h2 className="font-heading text-lg font-bold text-navy border-b border-cream-dark pb-3">Images</h2>
        <p className="text-xs text-slate-medium">Images are auto-compressed to WebP before upload to save storage.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ImageUploadBox field="thumbnail" label="Thumbnail (Card)" maxW={800} current={form.thumbnail} />
          <ImageUploadBox field="hero_image" label="Hero Image" maxW={1920} current={form.hero_image} />
          <ImageUploadBox field="layout_image" label="Layout Plan" maxW={1200} current={form.layout_image} />
        </div>

        {/* Gallery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-navy uppercase tracking-wider">Gallery Images</label>
            <button onClick={() => galleryInputRef.current?.click()} disabled={uploading === "gallery"} className="flex items-center gap-1.5 text-xs text-gold font-semibold hover:text-gold-dark transition-all disabled:opacity-50">
              {uploading === "gallery" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Images
            </button>
            <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
          </div>
          {form.gallery_images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.gallery_images.map((url, i) => (
                <div key={i} className="relative h-28 rounded-xl overflow-hidden group">
                  <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="200px" />
                  <button onClick={() => removeGalleryImage(i)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-28 bg-cream rounded-xl border-2 border-dashed border-cream-dark flex items-center justify-center text-slate-medium text-xs">
              No gallery images added yet
            </div>
          )}
        </div>
      </div>

      {/* Amenities & Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(["amenities", "highlights"] as const).map((field) => (
          <div key={field} className="bg-white rounded-2xl border border-cream-dark p-6">
            <h2 className="font-heading text-lg font-bold text-navy border-b border-cream-dark pb-3 mb-4 capitalize">{field}</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={field === "amenities" ? newAmenity : newHighlight}
                onChange={(e) => (field === "amenities" ? setNewAmenity : setNewHighlight)(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addListItem(field, field === "amenities" ? newAmenity : newHighlight, field === "amenities" ? setNewAmenity : setNewHighlight)}
                placeholder={`Add ${field === "amenities" ? "amenity" : "highlight"}...`}
                className="flex-1 px-3 py-2 bg-cream rounded-lg border border-cream-dark text-navy text-sm focus:border-gold/40 outline-none transition-all"
              />
              <button onClick={() => addListItem(field, field === "amenities" ? newAmenity : newHighlight, field === "amenities" ? setNewAmenity : setNewHighlight)} className="px-3 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {form[field].map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-cream rounded-lg group">
                  <span className="text-sm text-navy">{item}</span>
                  <button onClick={() => removeListItem(field, i)} className="text-slate-medium hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {form[field].length === 0 && <p className="text-xs text-slate-medium text-center py-4">No {field} added</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Location Coordinates */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-navy border-b border-cream-dark pb-3">Map Location</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Latitude</label>
            <input type="number" step="any" value={form.lat} onChange={(e) => updateField("lat", parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Longitude</label>
            <input type="number" step="any" value={form.lng} onChange={(e) => updateField("lng", parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm focus:border-gold/40 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-gold text-navy font-bold hover:shadow-lg transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? "Create Project" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
