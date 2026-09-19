"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

const INTERVAL_MS = 4000;

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch active banners ───────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/public/banners")
      .then((r) => r.json())
      .then((data: Banner[]) => {
        const active = (Array.isArray(data) ? data : []).filter((b) => b.isActive);
        setBanners(active);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // ── Auto-advance ───────────────────────────────────────────────────────
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners.length, paused, next]);

  // ── Nothing to show ────────────────────────────────────────────────────
  if (!loaded || banners.length === 0) return null;

  const banner = banners[current];

  const Wrapper = banner.linkUrl
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={banner.linkUrl!} className="block w-full h-full">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="w-full h-full">{children}</div>
      );

  return (
    <section className="w-full py-4 md:py-6 bg-[var(--color-bg)]">
      <div className="container-site">
        <div
          className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)] select-none"
          style={{ aspectRatio: "21/6" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* ── Slides ──────────────────────────────────────────────── */}
          {banners.map((b, i) => (
            <div
              key={b.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='400' viewBox='0 0 1400 400'%3E%3Crect fill='%23B91C1C' width='1400' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%23ffffff80' font-family='sans-serif' font-size='24' text-anchor='middle' dominant-baseline='middle'%3EBanner Image%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
            </div>
          ))}

          {/* ── Active slide title overlay ───────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-10 py-4 md:py-6">
            <p className="text-white font-black text-base md:text-2xl drop-shadow-lg leading-snug line-clamp-1">
              {banner.title}
            </p>
          </div>

          {/* ── Prev / Next arrows ───────────────────────────────────── */}
          {banners.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); prev(); }}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-lg md:text-xl transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.preventDefault(); next(); }}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-lg md:text-xl transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                ›
              </button>
            </>
          )}

          {/* ── Dot indicators ───────────────────────────────────────── */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* ── Progress bar ──────────────────────────────────────────── */}
          {banners.length > 1 && !paused && (
            <div className="absolute top-0 left-0 right-0 h-0.5 z-20 bg-white/20">
              <div
                key={`${current}-progress`}
                className="h-full bg-white/80 rounded-full"
                style={{
                  animation: `banner-progress ${INTERVAL_MS}ms linear forwards`,
                }}
              />
            </div>
          )}

          {/* Clickable wrapper on top of everything (but behind controls) */}
          <div className="absolute inset-0 z-[5]">
            <Wrapper>
              <span className="sr-only">{banner.title}</span>
            </Wrapper>
          </div>

          {/* Progress animation keyframe injected via style tag */}
          <style>{`
            @keyframes banner-progress {
              from { width: 0%; }
              to   { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
