import { Home } from "lucide-react";

export default function HouseLoader({ className = "min-h-[60vh]" }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer subtle static ring */}
        <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 border-[2px] border-cream-dark rounded-full" />
        
        {/* Animated spinning gold ring */}
        <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 border-[2px] border-gold rounded-full border-t-transparent animate-spin" />
        
        {/* Inner house icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-transparent rounded-full z-10">
          <Home className="w-6 h-6 sm:w-7 sm:h-7 text-navy/80 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Minimalist text */}
      <div className="mt-5 text-center animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <h3 className="font-heading text-[10px] sm:text-xs font-bold text-slate-medium uppercase tracking-[0.2em]">
          Loading
        </h3>
      </div>
    </div>
  );
}
