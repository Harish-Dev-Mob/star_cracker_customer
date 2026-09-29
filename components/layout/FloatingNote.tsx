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
    <div className="fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] max-w-[260px] sm:max-w-[280px] animate-in slide-in-from-bottom-5 fade-in duration-500 pointer-events-none">
      <div className="bg-white/95 backdrop-blur-md border border-[var(--color-primary)]/20 shadow-xl shadow-[var(--color-primary)]/10 p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 relative pointer-events-auto">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-orange-500 text-white flex items-center justify-center shadow-inner">
          <MapPin size={14} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-[11px] sm:text-xs uppercase tracking-wide mb-0.5">
            Delivery Notice
          </h4>
          <p className="text-[10px] text-gray-500 leading-snug font-medium">
            Once your order is delivered, you can conveniently collect it from your nearest delivery hub.
          </p>
        </div>
      </div>
    </div>
  );
}
