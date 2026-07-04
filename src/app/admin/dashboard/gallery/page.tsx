"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ImageIcon,
  Upload,
  Trash2,
  Loader2,
  X,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";

interface GalleryImage {
  id: string;
  key: string;
  url: string;
  alt: string;
  section: string;
  created_at: string;
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      setError("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAddByUrl = async () => {
    if (!newImageUrl.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newImageUrl.trim(), alt: newImageAlt.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add");
      setSuccess("Image added successfully!");
      setNewImageUrl("");
      setNewImageAlt("");
      setShowAddModal(false);
      setTimeout(() => setSuccess(""), 3000);
      await fetchImages();
    } catch {
      setError("Failed to add image. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": uploadFile.type },
        body: uploadFile,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // Add to gallery
      const galleryRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url, alt: newImageAlt.trim() || uploadFile.name }),
      });
      if (!galleryRes.ok) throw new Error("Failed to add");

      setSuccess("Image uploaded & added to gallery!");
      setUploadFile(null);
      setNewImageAlt("");
      setShowAddModal(false);
      setTimeout(() => setSuccess(""), 3000);
      await fetchImages();
    } catch {
      setError("Failed to upload image. Try adding by URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this image from the gallery?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setSuccess("Image removed from gallery.");
      setTimeout(() => setSuccess(""), 3000);
      await fetchImages();
    } catch {
      setError("Failed to delete image.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-gold" />
            Gallery Manager
          </h1>
          <p className="text-slate-medium mt-1">
            Add, remove, and manage gallery images. These appear on your website&apos;s Gallery page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchImages}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-cream-dark text-navy text-sm font-medium hover:bg-cream transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm animate-fade-in-up">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={() => setError("")} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-cream-dark">
          <ImageIcon className="w-16 h-16 text-slate-medium/20 mb-4" />
          <h3 className="font-heading text-lg font-bold text-navy">No Gallery Images</h3>
          <p className="text-slate-medium text-sm mt-2 max-w-md">
            Click &quot;Add Image&quot; to upload images that will appear on your website&apos;s Gallery page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-white rounded-2xl overflow-hidden border border-cream-dark hover:border-gold/20 hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt || "Gallery Image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deleting === img.id}
                    className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 transform group-hover:scale-100 scale-75"
                  >
                    {deleting === img.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-navy font-medium truncate">{img.alt || "Gallery Image"}</p>
                <p className="text-xs text-slate-medium mt-0.5">
                  Added {new Date(img.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold text-navy">Add Gallery Image</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-medium hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* By URL */}
              <div>
                <label className="block text-xs text-slate-medium uppercase tracking-wider mb-2 font-semibold">Image URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium/50" />
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="text-center text-xs text-slate-medium py-1">— OR —</div>

              {/* File Upload */}
              <div>
                <label className="block text-xs text-slate-medium uppercase tracking-wider mb-2 font-semibold">Upload File</label>
                <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-cream-dark rounded-xl cursor-pointer hover:border-gold/30 hover:bg-cream/50 transition-all">
                  <Upload className="w-5 h-5 text-slate-medium" />
                  <span className="text-sm text-slate-medium">
                    {uploadFile ? uploadFile.name : "Click to choose an image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs text-slate-medium uppercase tracking-wider mb-2 font-semibold">Alt Text (Description)</label>
                <input
                  type="text"
                  placeholder="e.g. RK Green Valley Main Gate"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-full px-4 py-3 bg-cream rounded-xl border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all"
                />
              </div>

              {/* Preview */}
              {newImageUrl && (
                <div className="rounded-xl overflow-hidden border border-cream-dark h-40">
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-cream-dark text-navy text-sm font-semibold hover:bg-cream transition-all"
                >
                  Cancel
                </button>
                {uploadFile ? (
                  <button
                    onClick={handleUploadFile}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Uploading..." : "Upload & Add"}
                  </button>
                ) : (
                  <button
                    onClick={handleAddByUrl}
                    disabled={adding || !newImageUrl.trim()}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {adding ? "Adding..." : "Add Image"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
