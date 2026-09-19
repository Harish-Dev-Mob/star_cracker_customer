"use client";

import Link from "next/link";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const COLS_PER_ROW = 6; // matches lg:grid-cols-6
const VISIBLE_ROWS = 2;
const DEFAULT_VISIBLE = COLS_PER_ROW * VISIBLE_ROWS; // 12

export default function CategoryGridClient({ categories }: { categories: Category[] }) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = categories.length > DEFAULT_VISIBLE;
  const displayed = expanded ? categories : categories.slice(0, DEFAULT_VISIBLE);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayed.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-6 rounded-[var(--radius-xl)]
              bg-white border border-[var(--color-border)]
              shadow-[var(--shadow-sm)] transition-all duration-300
              hover:shadow-[var(--shadow-md)] hover:-translate-y-1
              hover:border-[var(--color-primary)]/30"
          >
            <span className="text-4xl group-hover:animate-sparkle transition-transform duration-300 group-hover:scale-110">
              {cat.icon ?? "🎆"}
            </span>
            <span className="text-sm font-semibold text-[var(--color-text)] text-center group-hover:text-[var(--color-primary)] transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
              border border-[var(--color-primary)] text-[var(--color-primary)]
              text-sm font-semibold
              hover:bg-[var(--color-primary)] hover:text-white
              transition-all duration-200 cursor-pointer"
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
                Show More
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
