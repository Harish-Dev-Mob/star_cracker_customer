"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "@/store/useI18n";

interface HeroSectionProps {
  minPrice?: number;
}

export default function HeroSection({ minPrice }: HeroSectionProps) {
  const { t } = useTranslation();

  // Fetch promo banner text from site-config
  const [promoTexts, setPromoTexts] = useState<string[]>(["Festival Sale is LIVE! Up to 40% OFF on all Crackers"]);
  const [marqueeSecondaryText, setMarqueeSecondaryText] = useState("Shop Now & Celebrate Big!");
  const [promoEnabled, setPromoEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/public/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.topBannerEnabled !== undefined) {
          setPromoEnabled(data.topBannerEnabled === "true");
        }
        if (data.topBannerText) {
          try {
            const parsed = JSON.parse(data.topBannerText);
            if (Array.isArray(parsed)) setPromoTexts(parsed);
            else setPromoTexts([data.topBannerText]);
          } catch {
            setPromoTexts([data.topBannerText]);
          }
        }
        if (data.marqueeSecondaryText) {
          setMarqueeSecondaryText(data.marqueeSecondaryText);
        }
      })
      .catch(() => { /* keep defaults */ });
  }, []);

  const fmtPrice = minPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(minPrice)
    : null;

  // Build ticker items: mix promo text + price
  const showTicker = promoEnabled || fmtPrice;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">

      {/* ── Scrolling Ticker Strip ───────────────────────────────── */}
      {showTicker && (
        <div className="absolute top-0 left-0 right-0 z-20 overflow-hidden bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
          <div className="flex items-center animate-marquee whitespace-nowrap py-2">
            {/* 6 repetitions for a seamless infinite scroll */}
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-3 mx-8 text-red-900 font-bold text-sm">
                {/* Promo text segments (multiple) */}
                {promoEnabled && promoTexts.map((text, idx) => (
                  <span key={idx} className="inline-flex items-center gap-3">
                    <span className="text-base">🧨</span>
                    <span>{text}</span>
                    <span className="text-red-700 font-black">•</span>
                  </span>
                ))}
                
                {/* Price segment */}
                {fmtPrice && (
                  <>
                    <span className="text-base">🎆</span>
                    <span>Crackers starting from just</span>
                    <span className="bg-red-700 text-white px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide shadow-sm">
                      {fmtPrice}
                    </span>
                    <span className="text-red-700 font-black">•</span>
                  </>
                )}

                {/* Secondary Marquee Text (Optional) */}
                {marqueeSecondaryText?.trim() && (
                  <>
                    <span className="text-base">🪔</span>
                    <span>{marqueeSecondaryText}</span>
                    <span className="text-red-700 font-black">•</span>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Animated background particles & Fireworks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
        {/* Sparkles */}
        <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle opacity-80" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[25%] right-[15%] w-2 h-2 bg-orange-400 rounded-full animate-sparkle opacity-60" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[45%] left-[20%] w-1 h-1 bg-amber-200 rounded-full animate-sparkle opacity-70" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-red-400 rounded-full animate-sparkle opacity-50" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-[80%] right-[35%] w-1 h-1 bg-yellow-400 rounded-full animate-sparkle opacity-50" style={{ animationDelay: "0.7s" }} />
        <div className="absolute top-[10%] left-[70%] w-2 h-2 bg-amber-300 rounded-full animate-sparkle opacity-30" style={{ animationDelay: "1.5s" }} />
        
        {/* Firework Blasts */}
        <div className="firework-center top-[20%] left-[25%]" style={{ animationDelay: "0.2s" }}></div>
        <div className="firework-center top-[30%] right-[20%]" style={{ animationDelay: "1.1s" }}></div>
        <div className="firework-center top-[65%] left-[15%]" style={{ animationDelay: "0.7s" }}></div>
        <div className="firework-center top-[70%] right-[30%]" style={{ animationDelay: "1.5s" }}></div>
        <div className="firework-center top-[40%] left-[60%]" style={{ animationDelay: "0.4s" }}></div>
        <div className="firework-center top-[15%] right-[40%]" style={{ animationDelay: "1.8s" }}></div>

        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[800px] h-[150vw] md:h-[800px] rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] md:w-[1000px] h-[300px] md:h-[400px] bg-gradient-to-t from-yellow-500/10 to-transparent blur-[60px] md:blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site text-center pt-12">
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

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
    </section>
  );
}

