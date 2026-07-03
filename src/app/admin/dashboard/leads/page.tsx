"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  projectInterest: string;
  source: string;
  status: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  contacted: "bg-amber-500/10 text-amber-500",
  qualified: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-slate-500/10 text-slate-500",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchLeads = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      setLeads(data.leads || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch {
      setError("Failed to load leads. Make sure MongoDB is connected.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy flex items-center gap-3">
            <Users className="w-8 h-8 text-gold" />
            Lead Inquiries
          </h1>
          <p className="text-slate-medium mt-1">
            View and manage form submissions from your website.
          </p>
        </div>
        <button
          onClick={() => fetchLeads(pagination.page)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-medium" />
          {["all", "new", "contacted", "qualified", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "bg-navy text-white"
                  : "bg-white text-slate-medium border border-cream-dark hover:bg-cream-dark"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="font-heading text-lg font-bold text-navy">
            Connection Issue
          </h3>
          <p className="text-slate-medium text-sm mt-2 max-w-md">{error}</p>
          <button
            onClick={() => fetchLeads()}
            className="mt-4 px-4 py-2 rounded-lg bg-gold text-navy text-sm font-semibold hover:bg-gold-dark transition-all"
          >
            Retry
          </button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-12 h-12 text-slate-medium/30 mb-4" />
          <h3 className="font-heading text-lg font-bold text-navy">
            No Leads Yet
          </h3>
          <p className="text-slate-medium text-sm mt-2">
            Form submissions from your website will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-dark bg-cream/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-medium uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-medium uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-medium uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-cream/30 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">
                            {lead.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-navy font-semibold text-sm">
                              {lead.name}
                            </p>
                            {lead.message && (
                              <p className="text-slate-medium text-xs line-clamp-1 max-w-[200px]">
                                {lead.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1.5 text-sm text-slate-medium hover:text-gold transition-all"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 text-sm text-slate-medium hover:text-gold transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-navy">
                          <Building2 className="w-3.5 h-3.5 text-gold" />
                          {lead.projectInterest}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            statusColors[lead.status] || statusColors.new
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(lead.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-slate-medium text-sm">
                Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
                total leads)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLeads(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg border border-cream-dark text-slate-medium hover:bg-cream-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fetchLeads(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 rounded-lg border border-cream-dark text-slate-medium hover:bg-cream-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
