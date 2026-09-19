import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import ProductFilters from "./ProductFilters";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of premium firecrackers, sparklers, rockets, fountains, and combo packs.",
};

const ALLOWED_PAGE_SIZES = [12, 24, 48, 96] as const;
type ShopPageSize = (typeof ALLOWED_PAGE_SIZES)[number];
function parseShopPageSize(raw: string | undefined): ShopPageSize {
  const n = parseInt(raw ?? "12", 10);
  return (ALLOWED_PAGE_SIZES as readonly number[]).includes(n) ? (n as ShopPageSize) : 12;
}

/** Build smart ellipsis page list: [1, "…", 5, 6, 7, "…", 18] */
function buildPages(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }
  return pages;
}

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; page?: string; pageSize?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const sort = params.sort ?? "newest";
  const pageSize = parseShopPageSize(params.pageSize);
  const page = Math.max(1, Number(params.page || "1"));
  const limit = pageSize;

  // Build where clause
  const where: Record<string, unknown> = { isActive: true };
  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // OrderBy
  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (sort) {
    case "price-asc":  orderBy = { price: "asc" }; break;
    case "price-desc": orderBy = { price: "desc" }; break;
    case "name":       orderBy = { name: "asc" }; break;
    case "popular":    orderBy = { isFeatured: "desc" }; break;
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const pageList = buildPages(safePage, totalPages);

  /** Build an href that preserves all current filters */
  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (search)   sp.set("search", search);
    if (sort !== "newest") sp.set("sort", sort);
    sp.set("pageSize", String(pageSize));
    sp.set("page", String(p));
    return `/products?${sp.toString()}`;
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-site">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            {category
              ? categories.find((c) => c.slug === category)?.name ?? "Products"
              : search
              ? `Search: "${search}"`
              : "All Products"}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            {total} product{total !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
          activeCategory={category}
          activeSort={sort}
          searchQuery={search}
          activePageSize={pageSize}
        />

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              No products found
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* Prev */}
              <a
                href={safePage > 1 ? pageHref(safePage - 1) : "#"}
                aria-disabled={safePage === 1}
                className={`h-9 px-4 flex items-center gap-1 rounded-full text-sm font-bold border transition-all duration-200 ${
                  safePage === 1
                    ? "opacity-40 pointer-events-none bg-white border-[var(--color-border)] text-[var(--color-text-muted)]"
                    : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                ← Prev
              </a>

              {pageList.map((p, i) =>
                p === "…" ? (
                  <span
                    key={`e-${i}`}
                    className="h-9 w-9 flex items-center justify-center text-[var(--color-text-muted)] text-sm select-none"
                  >
                    …
                  </span>
                ) : (
                  <a
                    key={p}
                    href={pageHref(p)}
                    className={`h-9 min-w-[36px] flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                      p === safePage
                        ? "bg-[var(--color-primary)] text-white shadow-[0_4px_12px_rgba(220,38,38,0.35)]"
                        : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {p}
                  </a>
                )
              )}

              {/* Next */}
              <a
                href={safePage < totalPages ? pageHref(safePage + 1) : "#"}
                aria-disabled={safePage === totalPages}
                className={`h-9 px-4 flex items-center gap-1 rounded-full text-sm font-bold border transition-all duration-200 ${
                  safePage === totalPages
                    ? "opacity-40 pointer-events-none bg-white border-[var(--color-border)] text-[var(--color-text-muted)]"
                    : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                Next →
              </a>
            </div>

            {/* Summary */}
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Showing{" "}
              <span className="text-[var(--color-text)] font-bold">
                {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, total)}
              </span>{" "}
              of{" "}
              <span className="text-[var(--color-text)] font-bold">{total.toLocaleString()}</span>
              {" "}products &nbsp;·&nbsp; Page {safePage} of {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
