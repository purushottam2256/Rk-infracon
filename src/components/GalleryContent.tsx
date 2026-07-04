"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Play, X, Loader2 } from "lucide-react";
import { PLACEHOLDER_IMAGES } from "@/lib/constants";

const tabs = [
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Play },
];

// Fallback gallery images (used only if no images in DB)
const fallbackImages = [
  { src: PLACEHOLDER_IMAGES.plotLandscape1, alt: "RK Green Valley - Landscape", category: "RK Green Valley" },
  { src: PLACEHOLDER_IMAGES.plotAerial1, alt: "RK Green Valley - Aerial", category: "RK Green Valley" },
  { src: PLACEHOLDER_IMAGES.gallery1, alt: "Project Infrastructure", category: "Infrastructure" },
  { src: PLACEHOLDER_IMAGES.gallery2, alt: "Community Amenities", category: "Amenities" },
  { src: PLACEHOLDER_IMAGES.plotLandscape2, alt: "RK Paradise Enclave", category: "RK Paradise Enclave" },
  { src: PLACEHOLDER_IMAGES.plotAerial2, alt: "RK Paradise Aerial", category: "RK Paradise Enclave" },
  { src: PLACEHOLDER_IMAGES.gallery3, alt: "Landscaped Gardens", category: "Amenities" },
  { src: PLACEHOLDER_IMAGES.gallery4, alt: "Road Infrastructure", category: "Infrastructure" },
  { src: PLACEHOLDER_IMAGES.plotLandscape3, alt: "RK Sunrise City", category: "RK Sunrise City" },
  { src: PLACEHOLDER_IMAGES.heroAlt, alt: "Premium Development", category: "Overview" },
  { src: PLACEHOLDER_IMAGES.about, alt: "About RK Infracon", category: "Overview" },
  { src: PLACEHOLDER_IMAGES.hero, alt: "RK Infracon Ventures", category: "Overview" },
];

const videos = [
  { title: "RK Green Valley - Project Walkthrough", thumbnail: PLACEHOLDER_IMAGES.plotLandscape1 },
  { title: "RK Paradise Enclave - Aerial Tour", thumbnail: PLACEHOLDER_IMAGES.plotAerial2 },
  { title: "Why Invest in Open Plots?", thumbnail: PLACEHOLDER_IMAGES.gallery1 },
  { title: "Customer Testimonials", thumbnail: PLACEHOLDER_IMAGES.gallery3 },
];

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export default function GalleryContent() {
  const [activeTab, setActiveTab] = useState("images");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(fallbackImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setGalleryImages(
              data.images.map((img: { url: string; alt: string; key: string }) => ({
                src: img.url,
                alt: img.alt || "Gallery Image",
                category: "Gallery",
              }))
            );
          }
          // If no images in DB, keep fallback
        }
      } catch {
        // Keep fallback images
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-navy text-white shadow-lg"
                  : "bg-white text-slate-medium border border-cream-dark hover:border-gold/20"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        {activeTab === "images" && (
          loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{img.alt}</p>
                    <p className="text-gold/70 text-xs">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Videos Grid */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videos.map((video, i) => (
              <div key={i} className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group bg-navy">
                <Image src={video.thumbnail} alt={video.title} fill className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xl">
                    <Play className="w-7 h-7 text-navy fill-navy ml-1" />
                  </div>
                  <p className="text-white font-heading font-bold text-sm text-center px-4">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-all">
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="absolute bottom-8 text-white text-sm font-medium">
            {galleryImages[lightboxIndex].alt}
          </p>
        </div>
      )}
    </section>
  );
}
