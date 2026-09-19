import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { TranslatedText } from "@/components/ui/TranslatedText";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="container-site">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-dark)] mb-3">
            Handpicked for you
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            <TranslatedText id="home.featuredProducts" />
          </h2>
          <p className="text-[var(--color-text-muted)] mt-2 max-w-lg mx-auto">
            Our best sellers and most-loved combos — perfect for making your celebration unforgettable.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
