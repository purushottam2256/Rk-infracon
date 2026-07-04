"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ImageIcon,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Settings,
  BarChart3,
  Image,
  HelpCircle,
  MessageSquareQuote,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/projects", label: "Projects", icon: Building2 },
  { href: "/admin/dashboard/gallery", label: "Gallery", icon: Image },
  { href: "/admin/dashboard/images", label: "Site Images", icon: ImageIcon },
  { href: "/admin/dashboard/leads", label: "Leads", icon: Users },
  { href: "/admin/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/dashboard/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/dashboard/settings", label: "Site Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  };

  // High security: strict client-side auth verification
  useEffect(() => {
    const verifyAuth = async () => {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // If not authenticated or error, force redirect to login
        router.replace("/admin");
      }
    };
    
    verifyAuth();
    
    // Set up real-time auth listener to log out if session expires
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace("/admin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-navy z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
                <img src="/logo.png" alt="RK Infracon Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-white font-heading font-bold text-base block group-hover:text-gold transition-colors">
                  RK Infracon
                </span>
                <span className="text-gold/50 text-[10px] uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80  border-b border-cream-dark px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-navy hover:bg-cream rounded-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-navy text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-medium text-navy hidden sm:block">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
