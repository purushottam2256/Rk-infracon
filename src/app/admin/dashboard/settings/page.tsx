"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  Globe,
  Camera,
  Play,
  Briefcase,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import HouseLoader from "@/components/HouseLoader";

interface SettingItem {
  value: string;
  label: string;
  category: string;
}

const categoryConfig: Record<string, { title: string; icon: React.ElementType; description: string }> = {
  contact: { title: "Contact Information", icon: Phone, description: "Phone, email, address shown across the website" },
  company: { title: "Company Details", icon: Building2, description: "Business stats and branding displayed on homepage" },
  social: { title: "Social Media Links", icon: Globe, description: "Social profile URLs shown in the footer" },
};

const fieldIcons: Record<string, React.ElementType> = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  working_hours: Clock,
  tagline: Building2,
  experience: Building2,
  happy_customers: Building2,
  projects_delivered: Building2,
  facebook_url: Globe,
  instagram_url: Camera,
  youtube_url: Play,
  linkedin_url: Briefcase,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, SettingItem>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSettings(data.settingsWithMeta || {});
      // Initialize edited values
      const values: Record<string, string> = {};
      for (const [key, meta] of Object.entries(data.settingsWithMeta || {})) {
        values[key] = (meta as SettingItem).value;
      }
      setEditedValues(values);
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Find changed values
      const updates: Record<string, string> = {};
      for (const [key, value] of Object.entries(editedValues)) {
        if (settings[key]?.value !== value) {
          updates[key] = value;
        }
      }

      if (Object.keys(updates).length === 0) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setSaving(false);
        return;
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await fetchSettings();
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.entries(editedValues).some(
    ([key, value]) => settings[key]?.value !== value
  );

  // Group settings by category
  const grouped: Record<string, Record<string, SettingItem>> = {};
  for (const [key, meta] of Object.entries(settings)) {
    const cat = meta.category || "general";
    if (!grouped[cat]) grouped[cat] = {};
    grouped[cat][key] = meta;
  }

  if (loading) {
    return <HouseLoader className="py-20" />;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy flex items-center gap-3">
            <Settings className="w-8 h-8 text-gold" />
            Site Settings
          </h1>
          <p className="text-slate-medium mt-1">
            Edit your website content — phone, email, address, stats, and social links. Changes appear instantly on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-cream-dark text-navy text-sm font-medium hover:bg-cream transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-gold text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm animate-fade-in-up">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Settings saved successfully! Changes are now live on your website.
        </div>
      )}

      {/* Settings Groups */}
      {Object.entries(categoryConfig).map(([catKey, catInfo]) => {
        const catSettings = grouped[catKey];
        if (!catSettings) return null;

        return (
          <div
            key={catKey}
            className="bg-white rounded-2xl border border-cream-dark overflow-hidden animate-fade-in-up"
          >
            <div className="p-6 sm:p-8 border-b border-cream-dark bg-cream/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <catInfo.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-navy">
                    {catInfo.title}
                  </h2>
                  <p className="text-slate-medium text-sm">{catInfo.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {Object.entries(catSettings).map(([key, meta]) => {
                const Icon = fieldIcons[key] || Settings;
                const isChanged = editedValues[key] !== meta.value;
                return (
                  <div key={key} className="group">
                    <label className="block text-xs text-slate-medium uppercase tracking-wider mb-2 font-semibold">
                      {meta.label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium/50" />
                      <input
                        type="text"
                        value={editedValues[key] || ""}
                        onChange={(e) =>
                          setEditedValues({ ...editedValues, [key]: e.target.value })
                        }
                        className={`w-full pl-11 pr-4 py-3.5 bg-cream rounded-xl border text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none ${
                          isChanged ? "border-gold/50 bg-gold/5" : "border-cream-dark"
                        }`}
                      />
                      {isChanged && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gold font-semibold">
                          Modified
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
