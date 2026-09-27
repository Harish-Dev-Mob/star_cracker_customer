"use client";

import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/shared/ProductCard";

export default function WishlistPage() {
  const { items, clearAll } = useWishlist();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-gray-950 via-red-950 to-orange-950">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-site relative z-10">
          <nav className="flex items-center gap-2 text-white/50 text-sm font-semibold mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/90">Wishlist</span>
          </nav>

          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl shrink-0">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white fill-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  My Wishlist
                </h1>
                <p className="text-white/60 mt-2 font-semibold text-base">
                  {items.length} saved item{items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <section className="py-12 lg:py-16">
        <div className="container-site">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    images: JSON.stringify(product.images), // ProductCard expects a JSON string
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-[var(--color-text-muted)] font-medium mb-8">
                Found something you like? Tap on the heart icon next to the item to add it to your wishlist!
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-base shadow-lg"
              >
                Browse Categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
