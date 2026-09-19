"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Props {
  categories: { id: string; name: string; slug: string }[];
  activeCategory?: string;
  activeSort: string;
  searchQuery?: string;
  activePageSize?: number;
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Popular" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name",       label: "Name: A–Z" },
];

const PAGE_SIZE_OPTIONS = [
  { value: 12,  label: "12 / page" },
  { value: 24,  label: "24 / page" },
  { value: 48,  label: "48 / page" },
  { value: 96,  label: "96 / page" },
];

export default function ProductFilters({ categories, activeCategory, activeSort, searchQuery, activePageSize = 12 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery ?? "");

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset page on filter change
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
            className="w-full h-10 pl-10 pr-4 rounded-[var(--radius-md)] text-sm
              bg-white border border-[var(--color-border)]
              text-[var(--color-text)] placeholder:text-[var(--color-text-light)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
              transition-all duration-150"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]">
            🔍
          </span>
        </div>
        <Button type="submit" size="md" variant="primary">
          Search
        </Button>
      </form>

      {/* Category pills + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams("category", null)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
              "border",
              !activeCategory
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                updateParams("category", activeCategory === cat.slug ? null : cat.slug)
              }
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                "border",
                activeCategory === cat.slug
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort + Per-page */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Per page */}
          <div className="relative">
            <select
              value={activePageSize}
              onChange={(e) => updateParams("pageSize", e.target.value === "12" ? null : e.target.value)}
              className="h-10 pl-3 pr-8 rounded-[var(--radius-md)] text-xs font-medium
                bg-white border border-[var(--color-border)] text-[var(--color-text)]
                focus:outline-none focus:border-[var(--color-primary)]
                appearance-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-[10px]">▾</span>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => updateParams("sort", e.target.value === "newest" ? null : e.target.value)}
              className="h-10 pl-3 pr-8 rounded-[var(--radius-md)] text-xs font-medium
                bg-white border border-[var(--color-border)] text-[var(--color-text)]
                focus:outline-none focus:border-[var(--color-primary)]
                appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] text-[10px]">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}
