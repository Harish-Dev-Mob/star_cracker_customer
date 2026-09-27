import { prisma } from "@/lib/prisma";
import CategoryGridClient from "./CategoryGridClient";

export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E8]">
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #B91C1C 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B91C1C]/10 text-[#B91C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            ✦ Browse by Category ✦
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--color-text)] leading-tight">
            Shop by{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #B91C1C 0%, #F97316 100%)" }}
            >
              Category
            </span>
          </h2>
          <p className="mt-3 text-[var(--color-text-muted)] text-base max-w-md mx-auto">
            Explore our wide range of handpicked fireworks for every celebration
          </p>
        </div>

        <CategoryGridClient categories={categories} />
      </div>
    </section>
  );
}
