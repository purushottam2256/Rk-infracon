# 🏢 RK Infracon

RK Infracon is a modern, high-performance real estate platform built for discovering, showcasing, and managing premium open plots, ventures, and gated communities. The platform includes a beautiful public-facing marketing website and a comprehensive, secure Admin Dashboard to manage projects, leads, and assets.

## ✨ Key Features

### Public Website

- **Modern UI/UX**: Aesthetic, responsive, and dynamic design utilizing a premium gold and navy color palette.
- **Dynamic Projects Showcase**: Beautiful project grids and detailed pages with Google Maps integration, rich galleries, and layout plans.
- **Lead Generation**: Integrated inquiry forms and quick WhatsApp/Call CTAs to instantly capture visitor interest.
- **Fast Performance**: Built with Next.js App Router and optimized image rendering for lightning-fast page loads.

### Admin Dashboard

- **Secure Authentication**: Protected admin routes using Supabase Auth.
- **Project Management**: Add, edit, or remove projects, update pricing, availability status, and amenities in real-time.
- **Lead Management**: View, filter, and track customer inquiries originating from the website.
- **Asset Management**: Integrated media management for uploading and assigning project galleries and layout plans.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL & Authentication)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18.17.0 or higher)
- A [Supabase](https://supabase.com/) account for database and authentication services

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rk-infracon.git
cd rk-infracon
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following keys from your Supabase dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the public application.
To access the admin panel, navigate to [http://localhost:3000/admin](http://localhost:3000/admin).

## 📂 Project Structure

- `src/app/`: Next.js App Router pages, API routes, and layout definitions.
  - `src/app/admin/`: Secure routes for the Admin Dashboard.
  - `src/app/projects/`: Dynamic routes for individual real estate projects.
- `src/components/`: Reusable UI components (Navbar, Footer, Hero, Forms, etc.).
- `src/lib/`: Utility functions, constants, and Supabase client configurations.
- `public/`: Static assets including images, logos, and brochures.

## 📄 License

This codebase is proprietary and intended for use by **RK Infracon**. All rights reserved.
