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
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  CalendarDays,
  X,
  MessageSquare,
} from "lucide-react";
import HouseLoader from "@/components/HouseLoader";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  project_interest: string;
  source: string;
  status: string;
  type: string;
  preferred_date: string;
  preferred_time: string;
  created_at: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: "bg-amber-500/10 text-amber-600", icon: Clock, label: "Pending" },
  "in-progress": { color: "bg-blue-500/10 text-blue-500", icon: ArrowRight, label: "In Progress" },
  completed: { color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle, label: "Completed" },
};

const nextStatus: Record<string, string> = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: "pending",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1, limit: 20, total: 0, pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const fetchLeads = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      setLeads(data.leads || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch {
      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      setSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry? This cannot be undone.")) return;
    setDeletingId(leadId);
    try {
      const res = await fetch(`/api/leads?id=${leadId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      setSuccess("Enquiry deleted successfully.");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to delete enquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (searchTerm === "") return true;
    const q = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.includes(searchTerm)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
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
            Manage enquiries and visit bookings. Update status and take action.
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

      {/* Success/Error */}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm animate-fade-in-up">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
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
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-medium" />
          {["all", "pending", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "bg-navy text-white"
                  : "bg-white text-slate-medium border border-cream-dark hover:bg-cream-dark"
              }`}
            >
              {status === "all" ? "All" : status.replace("-", " ")}
            </button>
          ))}
          <div className="w-px h-6 bg-cream-dark mx-1" />
          {["all", "enquiry", "visit-booking"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                typeFilter === type
                  ? "bg-gold text-navy"
                  : "bg-white text-slate-medium border border-cream-dark hover:bg-cream-dark"
              }`}
            >
              {type === "all" ? "All Types" : type === "visit-booking" ? "Visits" : "Enquiries"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <HouseLoader className="py-20" />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="font-heading text-lg font-bold text-navy">Connection Issue</h3>
          <p className="text-slate-medium text-sm mt-2 max-w-md">{error}</p>
          <button onClick={() => fetchLeads()} className="mt-4 px-4 py-2 rounded-lg bg-gold text-navy text-sm font-semibold hover:bg-gold-dark transition-all">
            Retry
          </button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-cream-dark">
          <Users className="w-12 h-12 text-slate-medium/30 mb-4" />
          <h3 className="font-heading text-lg font-bold text-navy">No Leads Yet</h3>
          <p className="text-slate-medium text-sm mt-2">Form submissions from your website will appear here.</p>
        </div>
      ) : (
        <>
          {/* Lead Cards */}
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const config = statusConfig[lead.status] || statusConfig.pending;
              const isExpanded = expandedLead === lead.id;
              const isVisitBooking = lead.type === "visit-booking";

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded ? "border-gold/30 shadow-lg shadow-gold/5" : "border-cream-dark hover:border-gold/20"
                  }`}
                >
                  <div
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-sm shrink-0">
                        {lead.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-navy">{lead.name}</h3>
                          {isVisitBooking && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 text-[10px] font-bold uppercase">
                              Visit Booking
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-medium mt-1 flex-wrap">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status Badge — clickable to change */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(lead.id, nextStatus[lead.status] || "pending");
                        }}
                        disabled={updatingStatus === lead.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all hover:shadow-md ${config.color}`}
                        title={`Click to change to: ${nextStatus[lead.status]?.replace("-", " ")}`}
                      >
                        {updatingStatus === lead.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <config.icon className="w-3 h-3" />
                        )}
                        {config.label}
                      </button>

                      {/* Date */}
                      <span className="text-xs text-slate-medium flex items-center gap-1 hidden sm:flex">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(lead.created_at)}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(lead.id);
                        }}
                        disabled={deletingId === lead.id}
                        className={`p-2 rounded-lg transition-all ${
                          lead.status === "completed"
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            : "text-slate-medium/40 hover:text-red-500 hover:bg-red-500/5"
                        }`}
                        title="Delete enquiry"
                      >
                        {deletingId === lead.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-cream-dark mt-0 animate-fade-in-up">
                      <div className="grid sm:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-slate-medium uppercase tracking-wider font-semibold">Project Interest</span>
                            <p className="text-sm text-navy font-medium flex items-center gap-1.5 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 text-gold" />
                              {lead.project_interest || "General"}
                            </p>
                          </div>
                          {isVisitBooking && lead.preferred_date && (
                            <div>
                              <span className="text-xs text-slate-medium uppercase tracking-wider font-semibold">Preferred Visit</span>
                              <p className="text-sm text-navy font-medium flex items-center gap-1.5 mt-0.5">
                                <CalendarDays className="w-3.5 h-3.5 text-gold" />
                                {lead.preferred_date} {lead.preferred_time && `at ${lead.preferred_time}`}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-xs text-slate-medium uppercase tracking-wider font-semibold">Source</span>
                            <p className="text-sm text-navy font-medium mt-0.5 capitalize">{lead.source}</p>
                          </div>
                        </div>
                        <div>
                          {lead.message && (
                            <div>
                              <span className="text-xs text-slate-medium uppercase tracking-wider font-semibold flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> Message
                              </span>
                              <p className="text-sm text-navy mt-1 bg-cream rounded-xl p-3 leading-relaxed">
                                {lead.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-cream-dark">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-semibold hover:bg-blue-500/20 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </a>
                        <a
                          href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, "")}?text=Hello ${lead.name}, this is RK Infracon. We received your inquiry regarding ${lead.project_interest || "our projects"}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 text-xs font-semibold hover:bg-green-500/20 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                        {["pending", "in-progress", "completed"].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(lead.id, s)}
                            disabled={lead.status === s}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                              lead.status === s
                                ? "bg-navy text-white cursor-default"
                                : "bg-cream text-navy hover:bg-cream-dark"
                            }`}
                          >
                            {s.replace("-", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-slate-medium text-sm">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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
