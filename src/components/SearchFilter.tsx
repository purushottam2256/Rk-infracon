"use client";

import { useState } from "react";
import { Search, MapPin, IndianRupee, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const locations = [
  "All Locations",
  "Shadnagar",
  "Maheshwaram",
  "Adibatla",
  "Shamshabad",
];

const budgets = [
  "Any Budget",
  "Under ₹15,000/sq.yd",
  "₹15,000 - ₹20,000/sq.yd",
  "₹20,000 - ₹25,000/sq.yd",
  "Above ₹25,000/sq.yd",
];

export default function SearchFilter() {
  const [location, setLocation] = useState("All Locations");
  const [budget, setBudget] = useState("Any Budget");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location !== "All Locations") params.set("location", location);
    if (budget !== "Any Budget") params.set("budget", budget);
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <section className="relative -mt-12 z-20 px-4" id="search-filter">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl shadow-navy/10 border border-cream-dark/50 p-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Location */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold">
                <MapPin className="w-5 h-5" />
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                id="search-location"
                className="w-full pl-12 pr-4 py-4 bg-cream rounded-xl text-navy text-sm font-medium appearance-none cursor-pointer border border-transparent focus:border-gold/30 transition-all outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium pointer-events-none" />
            </div>

            {/* Budget */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold">
                <IndianRupee className="w-5 h-5" />
              </div>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                id="search-budget"
                className="w-full pl-12 pr-4 py-4 bg-cream rounded-xl text-navy text-sm font-medium appearance-none cursor-pointer border border-transparent focus:border-gold/30 transition-all outline-none"
              >
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium pointer-events-none" />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              id="search-submit"
              className="bg-gradient-gold text-navy px-8 py-4 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="md:hidden lg:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
