"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquareQuote, Trash2, Edit2, Loader2, Save, X, Star } from "lucide-react";
import HouseLoader from "@/components/HouseLoader";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  active: boolean;
  sort_order: number;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ name: "", role: "", text: "", rating: 5, active: true, sort_order: 0 });

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const resetForm = () => {
    setForm({ name: "", role: "", text: "", rating: 5, active: true, sort_order: testimonials.length });
    setEditingId(null);
  };

  const handleEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      role: t.role,
      text: t.text,
      rating: t.rating,
      active: t.active,
      sort_order: t.sort_order
    });
    setEditingId(t.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete Testimonial");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return alert("Name and Text are required");
    
    setSaving(true);
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error("Failed");
      
      await fetchTestimonials();
      resetForm();
    } catch (err) {
      alert("Failed to save Testimonial");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <HouseLoader className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy flex items-center gap-3">
            <MessageSquareQuote className="w-7 h-7 text-gold" />
            Manage Testimonials
          </h1>
          <p className="text-slate-medium text-sm mt-1">Add, edit, or remove client reviews shown on the homepage.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-cream-dark p-6 shadow-sm h-fit sticky top-24">
          <h2 className="font-heading text-lg font-bold text-navy mb-4 border-b border-cream-dark pb-3">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Customer Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none transition-all"
                placeholder="E.g., Rajesh Kumar"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Role / Designation</label>
              <input
                required
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none transition-all"
                placeholder="E.g., Plot Owner, RK Green Valley"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Review Text</label>
              <textarea
                required
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none transition-all resize-none h-24"
                placeholder="What did they say?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none"
                >
                  {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none"
                />
              </div>
            </div>
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-gold rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-navy">Active (Visible on site)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-gold text-navy py-2.5 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? "Update" : "Save"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-cream text-navy rounded-xl font-semibold hover:bg-cream-dark transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 h-fit">
          {testimonials.length === 0 ? (
            <div className="sm:col-span-2 bg-white rounded-2xl border border-cream-dark p-12 text-center text-slate-medium">
              No testimonials found.
            </div>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${editingId === t.id ? "border-gold shadow-md" : "border-cream-dark hover:border-gold/30"}`}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {!t.active && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Hidden</span>}
                      <span className="text-slate-medium text-xs font-mono">#{t.sort_order}</span>
                    </div>
                  </div>
                  <p className="text-navy text-sm italic mb-4 line-clamp-4">"{t.text}"</p>
                </div>
                <div className="flex items-center justify-between border-t border-cream-dark pt-3 mt-auto">
                  <div>
                    <p className="text-sm font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-slate-medium">{t.role}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-1.5 bg-cream text-navy rounded-lg hover:bg-gold/10 hover:text-gold transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 bg-cream text-red-500 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
