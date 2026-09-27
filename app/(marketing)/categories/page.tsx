import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Categories | Star Cracker",
  description:
    "Browse all firecracker categories — sparklers, rockets, fountains, aerial shells, combo packs and more, with all products listed by category.",
};

const SECTION_ACCENTS = [
  { border: "border-red-500", dot: "bg-red-500", badge: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300" },
  { border: "border-orange-500", dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300" },
  { border: "border-yellow-500", dot: "bg-yellow-500", badge: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300" },
  { border: "border-pink-500", dot: "bg-pink-500", badge: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300" },
  { border: "border-purple-500", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" },
  { border: "border-indigo-500", dot: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" },
  { border: "border-teal-500", dot: "bg-teal-500", badge: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300" },
  { border: "border-cyan-500", dot: "bg-cyan-500", badge: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300" },
];

export default async function CategoriesPage() {
  // Fetch all active categories, each with its active products
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { isFeatured: "desc" },
        include: { category: true },
      },
    },
  });

  const totalProducts = categories.reduce((s, c) => s + c.products.length, 0);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-gray-950 via-red-950 to-orange-950">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-site relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-bold tracking-[0.2em] uppercase mb-5">
            🎆 All Collections
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
            Shop by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300">
              Category
            </span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto font-medium mb-8">
            Every category, every product — all in one place.
          </p>

          {/* Quick jump links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.slug}`}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 text-xs font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              >
                {cat.name}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap text-sm font-semibold text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              {categories.length} categories
            </span>
            <span>·</span>
            <span>{totalProducts} products</span>
          </div>
        </div>
      </section>

      {/* ── Category Sections ─────────────────────────────────────────── */}
      <div className="container-site py-12 lg:py-16 space-y-16 lg:space-y-24">
        {categories.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">🎆</span>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">No categories yet</h2>
            <p className="text-[var(--color-text-muted)]">Check back soon — we&apos;re stocking up!</p>
          </div>
        ) : (
          categories.map((cat, i) => {
            const accent = SECTION_ACCENTS[i % SECTION_ACCENTS.length];
            return (
              <section
                key={cat.id}
                id={`cat-${cat.slug}`}
                className="scroll-mt-24"
              >
                {/* ── Category Header ─────────────────────── */}
                <div className={`flex items-center gap-3 mb-6 pb-5 border-b-2 ${accent.border}`}>
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-[var(--color-text)] tracking-tight leading-tight">
                      {cat.name}
                    </h2>
                    <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${accent.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                      {cat.products.length} {cat.products.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                </div>

                {/* ── Products Grid ────────────────────────── */}
                {cat.products.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                    <span className="text-4xl block mb-3">📦</span>
                    <p className="text-[var(--color-text-muted)] font-semibold text-sm">
                      No products yet in this category
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {cat.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
