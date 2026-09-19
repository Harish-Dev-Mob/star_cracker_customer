import { prisma } from "@/lib/prisma";
import CategoryGridClient from "./CategoryGridClient";

export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section className="py-16 lg:py-20 bg-[var(--color-bg-muted)]">
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-dark)] mb-3">
            Browse by Category
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Shop by Category
          </h2>
        </div>

        <CategoryGridClient categories={categories} />
      </div>
    </section>
  );
}
