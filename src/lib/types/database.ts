export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  short_description: string;
  price: string;
  price_range: string;
  plot_sizes: string;
  total_area: string;
  total_plots: number;
  status: "upcoming" | "ongoing" | "completed" | "sold-out";
  featured: boolean;
  thumbnail: string;
  hero_image: string;
  gallery_images: string[];
  layout_image: string;
  amenities: string[];
  highlights: string[];
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  project_interest: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "closed";
  created_at: string;
  updated_at: string;
}

export interface SiteImage {
  id: string;
  key: string;
  url: string;
  storage_path: string;
  alt: string;
  section: string;
  created_at: string;
  updated_at: string;
}
