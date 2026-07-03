"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ImageIcon, Users, TrendingUp, ArrowUpRight, Building2, Calendar, Mail, Loader2, Sparkles, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  projectInterest: string;
  status: string;
  createdAt: string;
}

const quickActions = [
  {
    icon: ImageIcon,
    title: "Manage Gallery & Media",
    description: "Update project assets and site images",
    href: "/admin/dashboard/images",
    color: "bg-blue-500/10 text-blue-500",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    icon: Users,
    title: "Lead Inquiries",
    description: "Respond to customer form submissions",
    href: "/admin/dashboard/leads",
    color: "bg-emerald-500/10 text-emerald-500",
    hoverBorder: "hover:border-emerald-500/30",
  },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-amber-500/10 text-amber-500",
  qualified: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-slate-500/10 text-slate-500",
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Welcome Back");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch("/api/leads?page=1&limit=5");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotalLeads(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider border border-white/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Admin Portal
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              {greeting}, Admin 👋
            </h1>
            <p className="text-white/70 max-w-lg">
              Here is what&apos;s happening across the {COMPANY_INFO.name} platform today. Manage your properties and customer inquiries effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Properties", value: "4", icon: Building2, change: "+1 this month", delay: "0s" },
          { label: "Active Inquiries", value: loading ? "..." : totalLeads.toString(), icon: Users, change: "Real-time from forms", delay: "0.1s" },
          { label: "Ongoing Ventures", value: "2", icon: TrendingUp, change: "Active Development", delay: "0.2s" },
          { label: "Happy Customers", value: COMPANY_INFO.happyCustomers, icon: Sparkles, change: "Growing steadily", delay: "0.3s" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-cream-dark hover:shadow-xl hover:shadow-navy/5 hover:border-gold/30 transition-all duration-500 animate-fade-in-up group"
            style={{ animationDelay: stat.delay }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-300">
                <stat.icon className="w-5 h-5 text-navy group-hover:text-gold transition-colors" />
              </div>
            </div>
            <div className="text-3xl font-heading font-bold text-navy">
              {stat.value}
            </div>
            <div className="text-slate-medium text-sm mt-1">{stat.label}</div>
            <div className="text-emerald-500 text-xs mt-3 font-medium bg-emerald-500/10 inline-block px-2 py-1 rounded-md">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-cream-dark shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="p-6 sm:p-8 border-b border-cream-dark flex items-center justify-between bg-cream/30">
            <div>
              <h2 className="font-heading text-xl font-bold text-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                Recent Inquiries
              </h2>
              <p className="text-slate-medium text-sm mt-1">Latest potential buyers from your website.</p>
            </div>
            <Link href="/admin/dashboard/leads" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold transition-colors">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : leads.length === 0 ? (
              <div className="py-12 text-center text-slate-medium text-sm">
                No recent inquiries found.
              </div>
            ) : (
              <div className="divide-y divide-cream-dark">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-6 sm:p-8 hover:bg-cream/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center font-bold text-navy">
                        {lead.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy">{lead.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-medium mt-1">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {lead.email}</span>
                          <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3"/> {lead.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[lead.status] || statusColors.new}`}>
                        {lead.status}
                      </span>
                      <span className="text-xs text-slate-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 bg-cream/30 border-t border-cream-dark sm:hidden">
            <Link href="/admin/dashboard/leads" className="flex items-center justify-center gap-1 text-sm font-semibold text-navy hover:text-gold transition-colors w-full">
              View All Leads <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <h2 className="font-heading text-xl font-bold text-navy px-1">
            Quick Actions
          </h2>
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex items-start p-6 bg-white rounded-3xl border border-cream-dark transition-all duration-300 hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1 ${action.hoverBorder}`}
            >
              <div className="flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy">
                  {action.title}
                </h3>
                <p className="text-slate-medium text-sm mt-1">
                  {action.description}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
