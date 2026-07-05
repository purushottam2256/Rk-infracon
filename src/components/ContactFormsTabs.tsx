"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, CalendarDays } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";

export default function ContactFormsTabs() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "visit" ? "visit" : "enquiry";
  const [activeTab, setActiveTab] = useState<"enquiry" | "visit">(initialTab);

  useEffect(() => {
    if (searchParams.get("tab") === "visit") {
      setActiveTab("visit");
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-cream-dark">
        <button
          onClick={() => setActiveTab("enquiry")}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            activeTab === "enquiry"
              ? "bg-navy text-white"
              : "bg-cream/30 text-slate-medium hover:bg-cream/80 hover:text-navy"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Send a Message
        </button>
        <button
          onClick={() => setActiveTab("visit")}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            activeTab === "visit"
              ? "bg-gradient-gold text-navy"
              : "bg-cream/30 text-slate-medium hover:bg-cream/80 hover:text-navy"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Book a Visit
        </button>
      </div>

      {/* Tabs Content */}
      <div className="p-8">
        {activeTab === "enquiry" ? (
          <div className="animate-fade-in-up">
            <h3 className="font-heading text-xl font-bold text-navy mb-1">
              General Inquiry
            </h3>
            <p className="text-slate-medium text-sm mb-6">
              Have questions? Fill in the form below and our team will reach out to you shortly.
            </p>
            <InquiryForm variant="default" formType="enquiry" />
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <h3 className="font-heading text-xl font-bold text-navy mb-1">
              Schedule a Site Visit
            </h3>
            <p className="text-slate-medium text-sm mb-6">
              Book a date and time to see our projects and meet our team in person.
            </p>
            <InquiryForm variant="default" formType="visit-booking" />
          </div>
        )}
      </div>
    </div>
  );
}
