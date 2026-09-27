"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";

interface Props {
  categories: { id: string; name: string; slug: string }[];
  activeCategory?: string;
  activeSort: string;
  searchQuery?: string;
  activePageSize?: number;
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest",           icon: "✦" },
  { value: "popular",    label: "Popular",           icon: "🔥" },
  { value: "price-asc",  label: "Price: Low → High", icon: "↑" },
  { value: "price-desc", label: "Price: High → Low", icon: "↓" },
  { value: "name",       label: "Name: A–Z",         icon: "A" },
];

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export default function ProductFilters({ categories, activeCategory, activeSort, searchQuery, activePageSize = 12 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery ?? "");

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) { params.set(key, value); } else { params.delete(key); }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", search.trim() || null);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search firecrackers..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl text-sm font-medium
              border-2 transition-all duration-200 outline-none
              placeholder:text-gray-400"
            style={{
              background: "white",
              borderColor: "rgba(185,28,28,0.2)",
              color: "#1A1A1A",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#B91C1C"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(185,28,28,0.12)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(185,28,28,0.2)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none">🔍</span>
        </div>
        <button
          type="submit"
          className="h-11 px-5 rounded-2xl text-sm font-black text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg,#B91C1C,#F97316)", boxShadow: "0 4px 14px rgba(185,28,28,0.35)" }}
        >
          Search
        </button>
      </form>

      {/* Filter bar */}
      <div
        className="rounded-2xl p-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap"
        style={{ background: "rgba(255,245,240,0.9)", border: "1.5px solid rgba(185,28,28,0.1)" }}
      >
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5 p-1">
          <button
            onClick={() => updateParams("category", null)}
            className="px-3 h-7 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer"
            style={!activeCategory ? {
              background: "linear-gradient(135deg,#B91C1C,#F97316)",
              color: "white",
              boxShadow: "0 2px 8px rgba(185,28,28,0.35)",
              transform: "scale(1.05)",
            } : { color: "#6B6B6B", background: "transparent" }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParams("category", activeCategory === cat.slug ? null : cat.slug)}
              className="px-3 h-7 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer"
              style={activeCategory === cat.slug ? {
                background: "linear-gradient(135deg,#B91C1C,#F97316)",
                color: "white",
                boxShadow: "0 2px 8px rgba(185,28,28,0.35)",
                transform: "scale(1.05)",
              } : { color: "#6B6B6B", background: "transparent" }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right: per-page + sort */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Per page */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl" style={{ background: "rgba(185,28,28,0.07)" }}>
            <span className="text-[10px] font-bold px-2" style={{ color: "#9B7B6B" }}>PER PAGE</span>
            {PAGE_SIZE_OPTIONS.map((ps) => (
              <button
                key={ps}
                onClick={() => updateParams("pageSize", ps === 12 ? null : String(ps))}
                className="h-7 min-w-[32px] px-2 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer"
                style={ps === activePageSize ? {
                  background: "linear-gradient(135deg,#B91C1C,#F97316)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(185,28,28,0.4)",
                  transform: "scale(1.05)",
                } : { color: "#6B6B6B", background: "transparent" }}
              >
                {ps}
              </button>
            ))}
          </div>

          <div className="h-6 w-px" style={{ background: "rgba(185,28,28,0.15)" }} />

          {/* Sort */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl" style={{ background: "rgba(185,28,28,0.07)" }}>
            <span className="text-[10px] font-bold px-2" style={{ color: "#9B7B6B" }}>SORT</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParams("sort", opt.value === "newest" ? null : opt.value)}
                className="px-3 h-7 rounded-lg text-[11px] font-black whitespace-nowrap transition-all duration-200 cursor-pointer"
                style={activeSort === opt.value ? {
                  background: "linear-gradient(135deg,#B91C1C,#F97316)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(185,28,28,0.35)",
                  transform: "scale(1.05)",
                } : { color: "#6B6B6B", background: "transparent" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
