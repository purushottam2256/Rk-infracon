"use client";

import { useState, useEffect, useCallback } from "react";
import { HelpCircle, Plus, Trash2, Edit2, Loader2, Save, X } from "lucide-react";
import HouseLoader from "@/components/HouseLoader";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  sort_order: number;
}

export default function FAQsManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ question: "", answer: "", active: true, sort_order: 0 });

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const resetForm = () => {
    setForm({ question: "", answer: "", active: true, sort_order: faqs.length });
    setEditingId(null);
  };

  const handleEdit = (faq: FAQ) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      active: faq.active,
      sort_order: faq.sort_order
    });
    setEditingId(faq.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      alert("Failed to delete FAQ");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) return alert("Question and Answer are required");
    
    setSaving(true);
    try {
      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error("Failed");
      
      await fetchFaqs();
      resetForm();
    } catch (err) {
      alert("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <HouseLoader className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-gold" />
            Manage FAQs
          </h1>
          <p className="text-slate-medium text-sm mt-1">Add, edit, or remove frequently asked questions.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-cream-dark p-6 shadow-sm h-fit sticky top-24">
          <h2 className="font-heading text-lg font-bold text-navy mb-4 border-b border-cream-dark pb-3">
            {editingId ? "Edit FAQ" : "Add New FAQ"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Question</label>
              <textarea
                required
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none transition-all resize-none h-20"
                placeholder="E.g., What is the process to buy a plot?"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Answer</label>
              <textarea
                required
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none transition-all resize-none h-32"
                placeholder="Provide a detailed answer..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-cream-dark text-sm focus:border-gold/40 outline-none"
                />
              </div>
              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 accent-gold rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-navy">Active</span>
                </label>
              </div>
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
        <div className="md:col-span-2 space-y-3">
          {faqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-dark p-12 text-center text-slate-medium">
              No FAQs found. Create your first one!
            </div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className={`bg-white rounded-2xl border p-5 transition-all ${editingId === faq.id ? "border-gold shadow-md" : "border-cream-dark hover:border-gold/30"}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-cream-dark text-navy px-2 py-0.5 rounded text-xs font-mono font-bold">
                        #{faq.sort_order}
                      </span>
                      {!faq.active && (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">Inactive</span>
                      )}
                      <h3 className="font-semibold text-navy">{faq.question}</h3>
                    </div>
                    <p className="text-slate-medium text-sm line-clamp-2 mt-1">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-2 bg-cream text-navy rounded-lg hover:bg-gold/10 hover:text-gold transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 bg-cream text-red-500 rounded-lg hover:bg-red-50 transition-all"
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
