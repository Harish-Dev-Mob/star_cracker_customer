import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── Helpers ──────────────────────────────────────────────────────────────────
const ALLOWED_PAGE_SIZES = [12, 24, 48] as const;
type PageSize = (typeof ALLOWED_PAGE_SIZES)[number];

function parsePageSize(raw: string | undefined): PageSize {
  const n = parseInt(raw ?? "12", 10);
  return (ALLOWED_PAGE_SIZES as readonly number[]).includes(n)
    ? (n as PageSize)
    : 12;
}

function buildPages(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    )
      pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }
  return pages;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "Name: A–Z" },
];

// ── Metadata ─────────────────────────────────────────────────────────────────
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string; pageSize?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | Star Cracker`,
    description: `Shop ${category.name} — premium quality firecrackers and sparklers for every celebration.`,
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const sort = sp.sort ?? "newest";
  const pageSize = parsePageSize(sp.pageSize);
  const page = Math.max(1, Number(sp.page || "1"));

  // Fetch category
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });
  if (!category) notFound();

  // OrderBy
  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (sort) {
    case "price-asc":  orderBy = { price: "asc" }; break;
    case "price-desc": orderBy = { price: "desc" }; break;
    case "name":       orderBy = { name: "asc" }; break;
    case "popular":    orderBy = { isFeatured: "desc" }; break;
  }

  const where = { isActive: true, categoryId: category.id };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageList = buildPages(safePage, totalPages);

  function pageHref(p: number) {
    const s = new URLSearchParams();
    if (sort !== "newest") s.set("sort", sort);
    s.set("pageSize", String(pageSize));
    s.set("page", String(p));
    return `/categories/${slug}?${s.toString()}`;
  }

  function sortHref(newSort: string) {
    const s = new URLSearchParams();
    if (newSort !== "newest") s.set("sort", newSort);
    s.set("pageSize", String(pageSize));
    return `/categories/${slug}?${s.toString()}`;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Category Hero ─────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-gray-950 via-red-950 to-orange-950">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-site relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm font-semibold mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white/80 transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-white/90">{category.name}</span>
          </nav>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {category.name}
            </h1>
            <p className="text-white/60 mt-2 font-semibold text-base">
              {total} product{total !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
      </section>

      {/* ── Filters Bar ───────────────────────────────────────────────── */}
      <section className="sticky top-[60px] z-20 backdrop-blur-2xl border-b shadow-lg"
        style={{ background: "rgba(255,245,240,0.92)", borderColor: "rgba(185,28,28,0.12)" }}>
        <div className="container-site py-2.5 flex items-center justify-between gap-3 flex-wrap">

          {/* Result count badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
              style={{ background: "linear-gradient(135deg,#B91C1C,#F97316)", color: "white", boxShadow: "0 2px 8px rgba(185,28,28,0.3)" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
              {total}
            </span>
            <span className="text-xs font-semibold" style={{ color: "#6B6B6B" }}>products</span>
          </div>

          {/* Controls group */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* Per-page pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: "rgba(185,28,28,0.07)" }}>
              <span className="text-[10px] font-bold px-2" style={{ color: "#9B7B6B" }}>PER PAGE</span>
              {ALLOWED_PAGE_SIZES.map((ps) => (
                <Link
                  key={ps}
                  href={`/categories/${slug}?sort=${sort}&pageSize=${ps}`}
                  className="h-7 min-w-[32px] flex items-center justify-center rounded-lg text-xs font-black transition-all duration-200 px-2"
                  style={ps === pageSize ? {
                    background: "linear-gradient(135deg,#B91C1C,#F97316)",
                    color: "white",
                    boxShadow: "0 2px 8px rgba(185,28,28,0.4)",
                    transform: "scale(1.05)",
                  } : {
                    color: "#6B6B6B",
                    background: "transparent",
                  }}
                >
                  {ps}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-6 w-px" style={{ background: "rgba(185,28,28,0.15)" }} />

            {/* Sort pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: "rgba(185,28,28,0.07)" }}>
              <span className="text-[10px] font-bold px-2" style={{ color: "#9B7B6B" }}>SORT</span>
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={sortHref(opt.value)}
                  id={`sort-${opt.value}`}
                  className="px-3 h-7 flex items-center rounded-lg text-[11px] font-black whitespace-nowrap transition-all duration-200"
                  style={sort === opt.value ? {
                    background: "linear-gradient(135deg,#B91C1C,#F97316)",
                    color: "white",
                    boxShadow: "0 2px 8px rgba(185,28,28,0.35)",
                    transform: "scale(1.05)",
                  } : {
                    color: "#6B6B6B",
                    background: "transparent",
                  }}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Products Grid ──────────────────────────────────────────────── */}
      <section className="py-12 lg:py-16">
        <div className="container-site">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                No products in this category yet
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6 font-medium">
                We&apos;re adding new items soon. Browse other categories in the meantime!
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-sm"
              >
                ← Back to Categories
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-14">
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {/* Prev */}
                <Link
                  href={safePage > 1 ? pageHref(safePage - 1) : "#"}
                  aria-disabled={safePage === 1}
                  id="pagination-prev"
                  className="h-9 px-4 flex items-center gap-1.5 rounded-full text-xs font-black border-2 transition-all duration-200"
                  style={safePage === 1 ? {
                    opacity: 0.4, pointerEvents: "none",
                    background: "white", borderColor: "rgba(185,28,28,0.15)", color: "#9B7B6B"
                  } : {
                    background: "white", borderColor: "rgba(185,28,28,0.2)", color: "#B91C1C"
                  }}
                >
                  ← Prev
                </Link>

                {pageList.map((p, i) =>
                  p === "…" ? (
                    <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm select-none" style={{ color: "#9B7B6B" }}>…</span>
                  ) : (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      id={`pagination-page-${p}`}
                      className="h-9 min-w-[36px] flex items-center justify-center rounded-full text-sm font-black transition-all duration-200"
                      style={p === safePage ? {
                        background: "linear-gradient(135deg,#B91C1C,#F97316)",
                        color: "white",
                        boxShadow: "0 4px 14px rgba(185,28,28,0.4)",
                        transform: "scale(1.1)",
                      } : {
                        background: "white",
                        color: "#6B6B6B",
                        border: "2px solid rgba(185,28,28,0.15)",
                      }}
                    >
                      {p}
                    </Link>
                  )
                )}

                {/* Next */}
                <Link
                  href={safePage < totalPages ? pageHref(safePage + 1) : "#"}
                  aria-disabled={safePage === totalPages}
                  id="pagination-next"
                  className="h-9 px-4 flex items-center gap-1.5 rounded-full text-xs font-black border-2 transition-all duration-200"
                  style={safePage === totalPages ? {
                    opacity: 0.4, pointerEvents: "none",
                    background: "white", borderColor: "rgba(185,28,28,0.15)", color: "#9B7B6B"
                  } : {
                    background: "white", borderColor: "rgba(185,28,28,0.2)", color: "#B91C1C"
                  }}
                >
                  Next →
                </Link>
              </div>

              <p className="text-[11px] font-semibold" style={{ color: "#9B7B6B" }}>
                Showing{" "}
                <span style={{ color: "#1A1A1A", fontWeight: 800 }}>
                  {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, total)}
                </span>{" "}
                of{" "}
                <span style={{ color: "#1A1A1A", fontWeight: 800 }}>{total.toLocaleString()}</span>{" "}
                products &nbsp;·&nbsp; Page {safePage} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Related Categories ──────────────────────────────────────── */}
      <RelatedCategories currentSlug={slug} />
    </div>
  );
}

// ── Related Categories strip (server) ────────────────────────────────────────
async function RelatedCategories({ currentSlug }: { currentSlug: string }) {
  const others = await prisma.category.findMany({
    where: { isActive: true, NOT: { slug: currentSlug } },
    orderBy: { sortOrder: "asc" },
    take: 6,
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  if (others.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--color-bg-muted)] dark:bg-gray-900/50">
      <div className="container-site">
        <h2 className="font-display text-2xl font-black text-[var(--color-text)] mb-8 tracking-tight">
          Other Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {others.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-5 rounded-2xl
                bg-white dark:bg-gray-900 border border-[var(--color-border)]
                shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[var(--color-primary)]/40
                transition-all duration-300 text-center"
            >
              <span className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                {cat.name}
              </span>
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                {cat._count.products} items
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
