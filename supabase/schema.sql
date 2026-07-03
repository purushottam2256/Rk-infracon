-- ============================================
-- RK Infracon - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 0. SUPABASE STORAGE BUCKET
-- ============================================
-- Create public bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read access for site images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

-- Allow authenticated users to upload/update/delete
CREATE POLICY "Authenticated users can upload site images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can update site images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can delete site images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-images');

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price TEXT NOT NULL,
  price_range TEXT DEFAULT '',
  plot_sizes TEXT DEFAULT '',
  total_area TEXT DEFAULT '',
  total_plots INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'sold-out')),
  featured BOOLEAN DEFAULT false,
  thumbnail TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  layout_image TEXT DEFAULT '',
  amenities TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT DEFAULT '',
  project_interest TEXT DEFAULT 'General',
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. SITE IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  storage_path TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  section TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Projects: Public read, no public write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

-- Leads: Public insert (form submissions), no public read
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Site Images: Public read, no public write
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site images are viewable by everyone"
  ON site_images FOR SELECT
  USING (true);

-- ============================================
-- 5. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_images_key ON site_images(key);
CREATE INDEX IF NOT EXISTS idx_site_images_section ON site_images(section);

-- ============================================
-- 6. AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_images_updated_at
  BEFORE UPDATE ON site_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. SEED DATA - Projects
-- ============================================
INSERT INTO projects (title, slug, location, description, short_description, price, price_range, plot_sizes, total_area, total_plots, status, featured, thumbnail, hero_image, gallery_images, layout_image, amenities, highlights, lat, lng)
VALUES
(
  'RK Green Valley',
  'rk-green-valley',
  'Shadnagar, Hyderabad',
  'RK Green Valley is a premium 50-acre gated community venture offering DTCP approved open plots in the rapidly developing Shadnagar corridor. With lush green landscapes, 40ft wide internal roads, underground drainage, and 24/7 security, this venture sets a new benchmark for plot developments. Located just 15 minutes from the proposed Regional Ring Road, this is the ideal investment for those seeking both tranquility and connectivity.',
  'Premium 50-acre gated community with DTCP approved plots near Shadnagar. Wide roads, full amenities, and excellent connectivity.',
  '₹15,999/sq.yd',
  '₹15,999 - ₹22,999 per sq.yd',
  '150 - 500 sq.yds',
  '50 Acres',
  320,
  'ongoing',
  true,
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  ARRAY['40ft & 30ft Wide Roads', 'Underground Drainage', 'Electricity with Street Lights', 'Overhead Water Tank', 'Children''s Play Area', 'Landscaped Gardens', '24/7 Security with CCTV', 'Compound Wall', 'Avenue Plantation', 'Community Hall'],
  ARRAY['DTCP Approved Layout', 'RERA Registered', '15 min from Regional Ring Road', 'Close to NH-44', 'Near Educational Institutions', 'Banks & ATMs Nearby'],
  17.0671, 78.2025
),
(
  'RK Paradise Enclave',
  'rk-paradise-enclave',
  'Maheshwaram, Hyderabad',
  'RK Paradise Enclave is a beautifully planned 35-acre residential plot venture located in the thriving Maheshwaram corridor. This RERA registered venture features excellent infrastructure including blacktop roads, storm water drains, and decorative entrance archways. With proximity to the Outer Ring Road and major IT hubs, Paradise Enclave offers the perfect blend of suburban peace and urban accessibility.',
  '35-acre RERA registered venture in Maheshwaram with premium infrastructure and proximity to ORR & IT corridor.',
  '₹18,500/sq.yd',
  '₹18,500 - ₹25,000 per sq.yd',
  '167 - 333 sq.yds',
  '35 Acres',
  210,
  'ongoing',
  true,
  'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'],
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  ARRAY['40ft & 33ft BT Roads', 'Storm Water Drains', 'Electricity & Street Lighting', 'Bore Well & Water Supply', 'Jogging Track', 'Meditation Garden', 'Entrance Archway', 'Security Cabin', 'Avenue Plantation', 'Open Gym Area'],
  ARRAY['RERA Registered', '10 min from ORR', 'Near Rajiv Gandhi International Airport', 'Close to TSPA Academy', 'Hospitals Within 5 km', 'Schools & Colleges Nearby'],
  17.1247, 78.4378
),
(
  'RK Sunrise City',
  'rk-sunrise-city',
  'Adibatla, Hyderabad',
  'RK Sunrise City is an upcoming world-class 75-acre township project near Adibatla, one of the fastest-growing destinations in Hyderabad. This mega venture will feature premium residential plots with access to club house facilities, swimming pool, tennis courts, and more. Located adjacent to the Pharma City SEZ and near major aerospace & defense corridors, this is the future of premium living.',
  'Upcoming 75-acre mega township near Adibatla with club house, sports facilities, and proximity to Pharma City SEZ.',
  '₹12,999/sq.yd',
  '₹12,999 - ₹19,500 per sq.yd',
  '200 - 600 sq.yds',
  '75 Acres',
  480,
  'upcoming',
  true,
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'],
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
  ARRAY['60ft & 40ft Wide Roads', 'Club House with Swimming Pool', 'Tennis & Badminton Courts', 'Cycling Track', 'Amphitheatre', 'Commercial Complex', 'Temple & Community Space', 'Rain Water Harvesting', 'Solar Street Lighting', 'Grand Entrance with Water Feature'],
  ARRAY['DTCP & RERA Approved', 'Adjacent to Pharma City SEZ', 'Near Aerospace & Defense Hub', 'Proposed Metro Connectivity', '5 min from ORR', 'Premium Township Living'],
  17.1742, 78.5258
),
(
  'RK Heritage Heights',
  'rk-heritage-heights',
  'Shamshabad, Hyderabad',
  'RK Heritage Heights is a completed and fully developed 25-acre residential venture near Shamshabad. All infrastructure is in place with families already residing in the community. This sold-out venture stands as a testament to RK Infracon''s commitment to quality and customer satisfaction. Limited resale plots may be available.',
  'Completed 25-acre residential venture near Shamshabad. Fully developed with families in residence. A testament to quality.',
  '₹22,000/sq.yd',
  '₹22,000 - ₹28,000 per sq.yd',
  '150 - 300 sq.yds',
  '25 Acres',
  180,
  'completed',
  false,
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'],
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  ARRAY['40ft BT Roads', 'Underground Drainage', '24/7 Water Supply', 'Electricity with Backup', 'Park & Garden', 'Security with CCTV', 'Compound Wall', 'Avenue Plantation'],
  ARRAY['Fully Developed', 'Families in Residence', 'Near RGIA Airport', 'Close to ORR', 'Schools & Hospitals Nearby', 'Excellent Appreciation'],
  17.2403, 78.4294
)
ON CONFLICT (slug) DO NOTHING;

-- Seed default site images
INSERT INTO site_images (key, url, section, alt) VALUES
  ('hero-main', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80', 'hero', 'Hero Background'),
  ('hero-secondary', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 'hero', 'Hero Secondary'),
  ('about-main', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80', 'about', 'About Section'),
  ('contact-main', 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80', 'contact', 'Contact Section')
ON CONFLICT (key) DO NOTHING;
