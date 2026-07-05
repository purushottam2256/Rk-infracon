"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Pencil,
  X,
  Monitor,
} from "lucide-react";
import { PLACEHOLDER_IMAGES } from "@/lib/constants";

interface ImageSlot {
  key: string;
  label: string;
  section: string;
  currentUrl: string;
  description: string;
}

const imageSlots: ImageSlot[] = [
  {
    key: "hero-main",
    label: "Hero Banner (Main)",
    section: "hero",
    currentUrl: PLACEHOLDER_IMAGES.hero,
    description: "Main homepage hero background image (1920×1080 recommended)",
  },
  {
    key: "hero-secondary",
    label: "Hero Banner (Secondary)",
    section: "hero",
    currentUrl: PLACEHOLDER_IMAGES.heroAlt,
    description: "Second slide in hero carousel",
  },
  {
    key: "about-main",
    label: "About Us Image",
    section: "about",
    currentUrl: PLACEHOLDER_IMAGES.about,
    description: "Main image on the About Us page",
  },
  {
    key: "project-greenvalley-thumb",
    label: "RK Green Valley - Thumbnail",
    section: "projects",
    currentUrl: PLACEHOLDER_IMAGES.plotLandscape1,
    description: "Card thumbnail for RK Green Valley",
  },
  {
    key: "project-greenvalley-hero",
    label: "RK Green Valley - Hero",
    section: "projects",
    currentUrl: PLACEHOLDER_IMAGES.plotAerial1,
    description: "Hero background for RK Green Valley detail page",
  },
  {
    key: "project-paradise-thumb",
    label: "RK Paradise Enclave - Thumbnail",
    section: "projects",
    currentUrl: PLACEHOLDER_IMAGES.plotLandscape2,
    description: "Card thumbnail for RK Paradise Enclave",
  },
  {
    key: "project-paradise-hero",
    label: "RK Paradise Enclave - Hero",
    section: "projects",
    currentUrl: PLACEHOLDER_IMAGES.plotAerial2,
    description: "Hero background for RK Paradise Enclave detail page",
  },
  {
    key: "project-sunrise-thumb",
    label: "RK Sunrise City - Thumbnail",
    section: "projects",
    currentUrl: PLACEHOLDER_IMAGES.plotLandscape3,
    description: "Card thumbnail for RK Sunrise City",
  },
  {
    key: "gallery-1",
    label: "Gallery Image 1",
    section: "gallery",
    currentUrl: PLACEHOLDER_IMAGES.gallery1,
    description: "Gallery image for project pages",
  },
  {
    key: "gallery-2",
    label: "Gallery Image 2",
    section: "gallery",
    currentUrl: PLACEHOLDER_IMAGES.gallery2,
    description: "Gallery image for project pages",
  },
  {
    key: "gallery-3",
    label: "Gallery Image 3",
    section: "gallery",
    currentUrl: PLACEHOLDER_IMAGES.gallery3,
    description: "Gallery image for project pages",
  },
  {
    key: "gallery-4",
    label: "Gallery Image 4",
    section: "gallery",
    currentUrl: PLACEHOLDER_IMAGES.gallery4,
    description: "Gallery image for project pages",
  },
];

const sections = ["All", "hero", "about", "projects", "gallery"];

export default function ImageManagerPage() {
  const [activeSection, setActiveSection] = useState("All");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, "success" | "error">>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSlots =
    activeSection === "All"
      ? imageSlots
      : imageSlots.filter((s) => s.section === activeSection);

  const handleUpload = async (slot: ImageSlot, file: File) => {
    setUploading(slot.key);

    try {
      // Preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [slot.key]: previewUrl }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", slot.key);
      formData.append("section", slot.section);
      formData.append("alt", slot.label);

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setUploadStatus((prev) => ({ ...prev, [slot.key]: "success" }));
      setTimeout(() => {
        setUploadStatus((prev) => {
          const next = { ...prev };
          delete next[slot.key];
          return next;
        });
      }, 3000);
    } catch {
      setUploadStatus((prev) => ({ ...prev, [slot.key]: "error" }));
      setPreviewUrls((prev) => {
        const next = { ...prev };
        delete next[slot.key];
        return next;
      });
      setTimeout(() => {
        setUploadStatus((prev) => {
          const next = { ...prev };
          delete next[slot.key];
          return next;
        });
      }, 3000);
    } finally {
      setUploading(null);
      setEditingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-gold" />
            Image Manager
          </h1>
          <p className="text-slate-medium mt-1">
            Replace any image on the website by clicking &quot;Edit&quot; and uploading a new one.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs">
          <Monitor className="w-4 h-4" />
          Changes appear live on the website
        </div>
      </div>

      {/* Section Filter removed per request to merge everything */}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlots.map((slot) => (
          <div
            key={slot.key}
            className="bg-white rounded-2xl overflow-hidden border border-cream-dark hover:shadow-lg transition-all duration-300"
          >
            {/* Image Preview */}
            <div className="relative h-48 bg-cream-dark group">
              <Image
                src={previewUrls[slot.key] || slot.currentUrl}
                alt={slot.label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => {
                    setEditingKey(slot.key);
                    fileInputRef.current?.click();
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-navy px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gold hover:text-navy transform hover:scale-105"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Image
                </button>
              </div>

              {/* Upload Status */}
              {uploading === slot.key && (
                <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                </div>
              )}

              {uploadStatus[slot.key] === "success" && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-scale-in">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Updated!
                </div>
              )}

              {uploadStatus[slot.key] === "error" && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-scale-in">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Failed
                </div>
              )}

              {/* Section Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy/70  text-white text-[10px] font-semibold uppercase tracking-wider">
                {slot.section}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-navy text-sm">{slot.label}</h3>
              <p className="text-slate-medium text-xs mt-1">{slot.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-dark">
                <span className="text-[10px] text-slate-medium font-mono">
                  {slot.key}
                </span>
                <button
                  onClick={() => {
                    setEditingKey(slot.key);
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-1.5 text-gold text-xs font-semibold hover:text-gold-dark transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Replace
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editingKey) {
            const slot = imageSlots.find((s) => s.key === editingKey);
            if (slot) {
              handleUpload(slot, file);
            }
          }
          e.target.value = "";
        }}
      />

      {/* Upload Modal Overlay */}
      {editingKey && uploading && (
        <div className="fixed inset-0 bg-navy/30  z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <Loader2 className="w-10 h-10 text-gold animate-spin mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-navy">
              Uploading Image
            </h3>
            <p className="text-slate-medium text-sm mt-2">
              Your new image is being uploaded to the cloud. This will be live on
              the website momentarily.
            </p>
            <button
              onClick={() => {
                setEditingKey(null);
                setUploading(null);
              }}
              className="mt-4 text-slate-medium text-xs hover:text-navy transition-all flex items-center gap-1 mx-auto"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
