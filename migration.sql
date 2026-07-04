-- ============================================
-- RK Infracon — ADDITIONAL MIGRATION SQL
-- Paste this in your Supabase SQL Editor
-- This upgrades your EXISTING schema to support FAQs and Testimonials
-- ============================================

-- ============================================
-- 1. CREATE TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  USING (true);

-- Seed initial testimonials
INSERT INTO testimonials (name, role, text, rating, sort_order) VALUES
  ('Rajesh Kumar', 'Plot Owner, RK Green Valley', 'Excellent experience with RK Infracon! The plots are exactly as promised — wide roads, proper drainage, and greenery everywhere. The team was transparent throughout the process. Highly recommend!', 5, 1),
  ('Priya Sharma', 'Investor, RK Paradise Enclave', 'I purchased two plots as an investment and the appreciation has been fantastic. The location near ORR is strategic and the development quality is top-notch. Very trustworthy company.', 5, 2),
  ('Suresh Reddy', 'Plot Owner, RK Heritage Heights', 'What impressed me most was the no-broker policy. Dealing directly with the company meant fair pricing and no hidden costs. My family is now building our dream home on the plot!', 5, 3),
  ('Anitha Rao', 'Homeowner, RK Green Valley', 'From site visit to registration, everything was smooth. The DTCP approval and RERA registration gave us complete peace of mind. The community is wonderful with great amenities.', 5, 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. CREATE FAQS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT
  USING (true);

-- Seed initial FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Are your plots DTCP approved and RERA registered?', 'Yes, all our ventures are 100% DTCP Approved and RERA Registered, ensuring complete legal compliance and peace of mind for your investment.', 1),
  ('What locations do you offer plots in?', 'We currently offer premium open plots in rapidly developing areas around Hyderabad including Shadnagar, Maheshwaram, Adibatla, and Shamshabad — all with excellent connectivity to ORR, NH-44, and the airport.', 2),
  ('Can I visit the site before purchasing?', 'Absolutely! We encourage all prospective buyers to schedule a free site visit. Our team will personally guide you through the venture, show you the infrastructure, and answer all your questions on-site. Contact us to book a visit.', 3),
  ('What amenities are included in your ventures?', 'Our ventures feature 40ft wide BT roads, underground drainage, 24/7 security with CCTV, street lighting, landscaped parks, children''s play areas, compound walls, and avenue plantation — varying by project.', 4),
  ('Do you work with external agents or brokers?', 'No. RK Infracon believes in direct customer relationships. We do not tie up with external agents or brokers, which means transparent pricing, no hidden commissions, and a hassle-free buying experience.', 5),
  ('What is the process for purchasing a plot?', 'It''s simple: (1) Schedule a site visit, (2) Choose your preferred plot, (3) Pay the booking amount, (4) Complete documentation and registration, (5) Get your registered sale deed. We assist you throughout the entire process.', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE! All migrations applied successfully.
-- ============================================
