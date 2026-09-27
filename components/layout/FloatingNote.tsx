"use client";

import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";

export function FloatingNote() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a small delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-white/90 backdrop-blur-md border border-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/10 p-3 sm:p-4 rounded-2xl flex items-start sm:items-center gap-3 relative group">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-orange-500 text-white flex items-center justify-center shadow-inner">
          <MapPin size={20} />
        </div>
        
        <div className="flex-1 pr-6">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-0.5">
            Delivery Notice
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-snug">
            Collect your order from the nearest delivery hub.
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 sm:top-1/2 sm:-translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close note"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
