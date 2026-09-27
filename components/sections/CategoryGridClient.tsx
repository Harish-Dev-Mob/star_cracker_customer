"use client";

import Link from "next/link";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const COLS_PER_ROW = 6;
const VISIBLE_ROWS = 2;
const DEFAULT_VISIBLE = COLS_PER_ROW * VISIBLE_ROWS;

// Vivid gradient palettes — cycles through categories
const CARD_GRADIENTS = [
  { from: "#B91C1C", to: "#F97316", glow: "#F9731650" },
  { from: "#7C3AED", to: "#EC4899", glow: "#EC489950" },
  { from: "#0EA5E9", to: "#06B6D4", glow: "#06B6D450" },
  { from: "#16A34A", to: "#84CC16", glow: "#84CC1650" },
  { from: "#D97706", to: "#F59E0B", glow: "#F59E0B50" },
  { from: "#DB2777", to: "#F43F5E", glow: "#F43F5E50" },
  { from: "#2563EB", to: "#6366F1", glow: "#6366F150" },
  { from: "#0D9488", to: "#10B981", glow: "#10B98150" },
  { from: "#DC2626", to: "#FB923C", glow: "#FB923C50" },
  { from: "#9333EA", to: "#C084FC", glow: "#C084FC50" },
  { from: "#EA580C", to: "#FBBF24", glow: "#FBBF2450" },
  { from: "#059669", to: "#34D399", glow: "#34D39950" },
];

export default function CategoryGridClient({ categories }: { categories: Category[] }) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hasMore = categories.length > DEFAULT_VISIBLE;
  const displayed = expanded ? categories : categories.slice(0, DEFAULT_VISIBLE);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
        {displayed.map((cat, i) => {
          const palette = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
          const isHovered = hoveredId === cat.id;

          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl overflow-hidden cursor-pointer min-h-[90px]"
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`
                  : "white",
                border: isHovered ? "none" : "1.5px solid #F0E8E0",
                boxShadow: isHovered
                  ? `0 20px 40px ${palette.glow}, 0 8px 16px rgba(0,0,0,0.12)`
                  : "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Shimmer overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
                }}
              />

              {/* Category name */}
              <span
                className="relative z-10 text-xs font-bold text-center leading-snug transition-colors duration-200"
                style={{
                  color: isHovered ? "white" : "#1A1A1A",
                  textShadow: isHovered ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
                }}
              >
                {cat.name}
              </span>

              {/* Arrow indicator slides in on hover */}
              <div
                className="relative z-10 transition-all duration-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0)" : "translateY(6px)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #B91C1C 0%, #F97316 100%)",
              color: "white",
              boxShadow: "0 8px 24px rgba(185,28,28,0.35)",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(185,28,28,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(185,28,28,0.35)";
            }}
          >
            {expanded ? (
              <>
                Show Less
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </>
            ) : (
              <>
                Show All Categories
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
