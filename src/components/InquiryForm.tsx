"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle, Loader2, CalendarDays, Clock } from "lucide-react";

interface InquiryFormProps {
  projectName?: string;
  className?: string;
  variant?: "default" | "compact";
  formType?: "enquiry" | "visit-booking";
}

export default function InquiryForm({
  projectName = "General",
  className = "",
  variant = "default",
  formType = "enquiry",
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isVisitBooking = formType === "visit-booking";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectInterest: projectName,
          source: "website",
          type: formType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "", preferredDate: "", preferredTime: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  if (status === "success") {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 animate-scale-in">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="font-heading text-xl font-bold text-navy">
          {isVisitBooking ? "Visit Booked!" : "Thank You!"}
        </h3>
        <p className="text-slate-medium text-sm mt-2">
          {isVisitBooking
            ? "Your visit has been booked. Our team will confirm shortly."
            : "Your inquiry has been received. We'll get back to you within 24 hours."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${className}`}
      id={isVisitBooking ? "visit-booking-form" : "inquiry-form"}
    >
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className={variant === "compact" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div>
          <input
            type="text"
            placeholder="Full Name *"
            required
            id={isVisitBooking ? "visit-name" : "inquiry-name"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-cream border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address *"
            required
            id={isVisitBooking ? "visit-email" : "inquiry-email"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-cream border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none"
          />
        </div>
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone Number *"
          required
          id={isVisitBooking ? "visit-phone" : "inquiry-phone"}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3.5 rounded-xl bg-cream border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none"
        />
      </div>

      {/* Visit booking fields */}
      {isVisitBooking && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
            <input
              type="date"
              required
              id="visit-preferred-date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-cream border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
            <select
              id="visit-preferred-time"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-cream border border-cream-dark text-navy text-sm appearance-none cursor-pointer focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none"
            >
              <option value="">Preferred Time</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>
        </div>
      )}

      {variant === "default" && (
        <div>
          <textarea
            placeholder={isVisitBooking ? "Any special requests? (Optional)" : "Your Message (Optional)"}
            rows={4}
            id={isVisitBooking ? "visit-message" : "inquiry-message"}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-cream border border-cream-dark text-navy text-sm placeholder:text-slate-medium/50 focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all outline-none resize-none"
          />
        </div>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        id={isVisitBooking ? "visit-submit" : "inquiry-submit"}
        className="w-full bg-gradient-gold text-navy py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isVisitBooking ? "Booking..." : "Submitting..."}
          </>
        ) : (
          <>
            {isVisitBooking ? <CalendarDays className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {isVisitBooking ? "Book Visit" : "Send Inquiry"}
          </>
        )}
      </button>
    </form>
  );
}
