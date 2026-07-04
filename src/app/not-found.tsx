import Link from "next/link";
import { Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden pt-32 pb-20">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl -z-10" />
      
      <div className="text-center z-10 animate-fade-in-up">
        <div className="relative inline-block">
          <h1 className="text-[150px] leading-none font-heading font-extrabold text-navy/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-cream animate-bounce">
              <MapPin className="w-10 h-10 text-gold" />
            </div>
          </div>
        </div>
        
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy mt-8 mb-4">
          Plot Not Found!
        </h2>
        
        <p className="text-slate-medium max-w-md mx-auto mb-10 text-base md:text-lg">
          The page you are looking for might have been sold, moved, or possibly never existed on our map.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-3 bg-gradient-gold text-navy px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-xl hover:shadow-gold/25 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
