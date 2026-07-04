"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Eye,
  Users,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  Calendar,
  Clock,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  Globe2,
} from "lucide-react";
import HouseLoader from "@/components/HouseLoader";

interface Analytics {
  today: { pageViews: number; uniqueVisitors: number };
  week: { pageViews: number; uniqueVisitors: number };
  month: { pageViews: number; uniqueVisitors: number };
  year: { pageViews: number; uniqueVisitors: number };
  allTime: { pageViews: number; uniqueVisitors: number };
  topPages: { page: string; count: number }[];
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  recentVisitors: {
    id: string;
    visitor_id: string;
    page: string;
    device_type: string;
    browser: string;
    created_at: string;
  }[];
  dailyChart: { date: string; views: number; visitors: number }[];
}

const deviceIcons: Record<string, React.ElementType> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/visits");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  if (loading) {
    return <HouseLoader className="py-20" />;
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-slate-medium">
        Failed to load analytics data.
      </div>
    );
  }

  const maxChartView = Math.max(...data.dailyChart.map((d) => d.views), 1);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-gold" />
            Visitor Analytics
          </h1>
          <p className="text-slate-medium mt-1">
            Track how many people visit your website with detailed breakdowns.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Period Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Today", icon: Clock, data: data.today, color: "text-blue-500", bg: "bg-blue-500/10", delay: "0s" },
          { label: "This Week", icon: Calendar, data: data.week, color: "text-emerald-500", bg: "bg-emerald-500/10", delay: "0.05s" },
          { label: "This Month", icon: TrendingUp, data: data.month, color: "text-amber-500", bg: "bg-amber-500/10", delay: "0.1s" },
          { label: "This Year", icon: BarChart3, data: data.year, color: "text-purple-500", bg: "bg-purple-500/10", delay: "0.15s" },
          { label: "All Time", icon: Globe, data: data.allTime, color: "text-gold", bg: "bg-gold/10", delay: "0.2s" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-cream-dark hover:shadow-lg hover:border-gold/20 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: stat.delay }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-slate-medium font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl font-heading font-bold text-navy">
              {stat.data.pageViews.toLocaleString()}
            </div>
            <div className="text-xs text-slate-medium mt-1">Page Views</div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-cream-dark">
              <Users className="w-3 h-3 text-gold" />
              <span className="text-sm font-semibold text-navy">
                {stat.data.uniqueVisitors.toLocaleString()}
              </span>
              <span className="text-xs text-slate-medium">unique</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart — Last 30 Days */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-dark p-6 overflow-hidden">
          <h2 className="font-heading text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            Last 30 Days
          </h2>
          <div className="flex items-end gap-[3px] h-48">
            {data.dailyChart.map((day) => {
              const height = maxChartView > 0 ? (day.views / maxChartView) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 group relative"
                  title={`${formatShortDate(day.date)}: ${day.views} views, ${day.visitors} unique`}
                >
                  <div
                    className="w-full bg-gradient-to-t from-gold/80 to-gold/40 rounded-t-sm group-hover:from-gold group-hover:to-gold/60 transition-all duration-200 cursor-pointer"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {formatShortDate(day.date)}: {day.views} views
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-medium">
            <span>{data.dailyChart.length > 0 ? formatShortDate(data.dailyChart[0].date) : ""}</span>
            <span>Today</span>
          </div>
        </div>

        {/* Device & Browser Breakdown */}
        <div className="space-y-4">
          {/* Devices */}
          <div className="bg-white rounded-2xl border border-cream-dark p-6">
            <h3 className="font-heading text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gold" />
              Devices
            </h3>
            <div className="space-y-3">
              {Object.entries(data.deviceBreakdown).length === 0 ? (
                <p className="text-slate-medium text-sm">No data yet</p>
              ) : (
                Object.entries(data.deviceBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([device, count]) => {
                    const total = Object.values(data.deviceBreakdown).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const DeviceIcon = deviceIcons[device] || Monitor;
                    return (
                      <div key={device} className="flex items-center gap-3">
                        <DeviceIcon className="w-4 h-4 text-slate-medium" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize text-navy font-medium">{device}</span>
                            <span className="text-slate-medium">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-cream rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Browsers */}
          <div className="bg-white rounded-2xl border border-cream-dark p-6">
            <h3 className="font-heading text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-gold" />
              Browsers
            </h3>
            <div className="space-y-2">
              {Object.entries(data.browserBreakdown).length === 0 ? (
                <p className="text-slate-medium text-sm">No data yet</p>
              ) : (
                Object.entries(data.browserBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([browser, count]) => (
                    <div key={browser} className="flex items-center justify-between text-sm py-1">
                      <span className="text-navy font-medium">{browser}</span>
                      <span className="text-slate-medium bg-cream px-2 py-0.5 rounded-md text-xs font-semibold">{count}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl border border-cream-dark p-6">
          <h2 className="font-heading text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-gold" />
            Top Pages (Today)
          </h2>
          {data.topPages.length === 0 ? (
            <p className="text-slate-medium text-sm py-4">No page views recorded today.</p>
          ) : (
            <div className="space-y-2">
              {data.topPages.map((p, i) => (
                <div key={p.page} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream/50 transition-all">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-navy font-medium flex-1 truncate">{p.page}</span>
                  <span className="text-xs text-slate-medium bg-cream px-2.5 py-1 rounded-lg font-semibold">
                    {p.count} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="p-6 border-b border-cream-dark bg-cream/30">
            <h2 className="font-heading text-lg font-bold text-navy flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              Recent Visitors
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {data.recentVisitors.length === 0 ? (
              <p className="p-6 text-slate-medium text-sm">No visitors recorded yet.</p>
            ) : (
              <div className="divide-y divide-cream-dark">
                {data.recentVisitors.map((v) => {
                  const DeviceIcon = deviceIcons[v.device_type] || Monitor;
                  return (
                    <div key={v.id} className="p-4 hover:bg-cream/20 transition-all flex items-center gap-3">
                      <DeviceIcon className="w-4 h-4 text-slate-medium shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-navy font-medium truncate">{v.page}</p>
                        <p className="text-xs text-slate-medium">
                          {v.browser} · {v.device_type}
                        </p>
                      </div>
                      <span className="text-xs text-slate-medium whitespace-nowrap">
                        {formatDate(v.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
