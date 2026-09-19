"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/store/useI18n";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sparkle dots */}
        <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle opacity-80" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[25%] right-[15%] w-2 h-2 bg-orange-400 rounded-full animate-sparkle opacity-60" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[45%] left-[20%] w-1 h-1 bg-amber-200 rounded-full animate-sparkle opacity-70" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-red-400 rounded-full animate-sparkle opacity-50" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-[30%] left-[55%] w-2 h-2 bg-yellow-200 rounded-full animate-sparkle opacity-40" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-[70%] left-[40%] w-1.5 h-1.5 bg-orange-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-[80%] right-[35%] w-1 h-1 bg-yellow-400 rounded-full animate-sparkle opacity-50" style={{ animationDelay: "0.7s" }} />
        <div className="absolute top-[10%] left-[70%] w-2 h-2 bg-amber-300 rounded-full animate-sparkle opacity-30" style={{ animationDelay: "1.5s" }} />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-[var(--color-accent)]/5 to-transparent blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site text-center">
        <div className="max-w-3xl mx-auto animate-slide-up">
          {/* Tagline chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-200 text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="animate-sparkle">✨</span>
            Diwali 2026 Collection Now Live
            <span className="animate-sparkle" style={{ animationDelay: "0.5s" }}>✨</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            {t.home.heroTitle}
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="accent" size="lg" className="text-base px-8">
                🛒 {t.home.shopNow}
              </Button>
            </Link>
            <Link href="/products?category=combo-packs">
              <Button variant="secondary" size="lg" className="text-base px-8 border-white/30 text-white hover:bg-white/10 hover:text-white">
                📦 View Combos
              </Button>
            </Link>
          </div>


        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
    </section>
  );
}
