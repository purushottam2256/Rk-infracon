import { Home } from "lucide-react";

export default function HouseLoader({ className = "min-h-[60vh]" }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col items-center justify-center relative ${className}`}>
      <div className="relative animate-fade-in-up">
        {/* Animated House Container */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden border border-gold/20 z-10">
          <div className="absolute inset-0 bg-gradient-gold opacity-10 animate-pulse" />
          
          {/* House Icon with subtle bounce */}
          <Home className="w-10 h-10 sm:w-12 sm:h-12 text-gold animate-[bounce_2s_infinite]" />
        </div>
        
        {/* Soft Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-gold/30 blur-2xl rounded-full z-0 animate-pulse" />
      </div>
      
      {/* Loading Text & Dots */}
      <div className="mt-6 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <h3 className="font-heading text-sm sm:text-base font-bold text-navy tracking-[0.2em] uppercase">
          RK Infracon
        </h3>
        
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
