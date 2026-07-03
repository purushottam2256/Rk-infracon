"use client";

import Link from "next/link";
import { ImageIcon, Users, TrendingUp, ArrowUpRight, Building2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

const quickActions = [
  {
    icon: ImageIcon,
    title: "Manage Images",
    description: "Update hero banners, project thumbnails, and gallery photos",
    href: "/admin/dashboard/images",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Users,
    title: "View Leads",
    description: "Check form submissions and inquiries from the website",
    href: "/admin/dashboard/leads",
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-navy">
          Welcome Back 👋
        </h1>
        <p className="text-slate-medium mt-1">
          Here&apos;s an overview of your {COMPANY_INFO.name} website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: "4", icon: Building2, change: "+1 this month" },
          { label: "Active Ventures", value: "2", icon: TrendingUp, change: "Ongoing" },
          { label: "Happy Customers", value: COMPANY_INFO.happyCustomers, icon: Users, change: "Growing" },
          { label: "Site Images", value: "16+", icon: ImageIcon, change: "Managed" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-cream-dark hover:shadow-lg hover:shadow-navy/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
            </div>
            <div className="text-2xl font-heading font-bold text-navy">
              {stat.value}
            </div>
            <div className="text-slate-medium text-xs mt-1">{stat.label}</div>
            <div className="text-emerald-500 text-xs mt-2 font-medium">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-xl font-bold text-navy mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-white rounded-2xl p-6 border border-cream-dark hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-medium opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy mt-4">
                {action.title}
              </h3>
              <p className="text-slate-medium text-sm mt-1">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
