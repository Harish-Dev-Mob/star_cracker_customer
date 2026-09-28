import { prisma } from "@/lib/prisma";
import AllProductsShopClient from "./AllProductsShopClient";

export default async function AllProductsShopSection() {
  // Fetch all active categories with their active products
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          images: true,
          stock: true,
          isCombo: true,
          isFeatured: true,
          weight: true,
        },
      },
    },
  });

  // Filter out empty categories
  const filledCategories = categories.filter((c) => c.products.length > 0);

  if (filledCategories.length === 0) return null;

  return <AllProductsShopClient categories={filledCategories} />;
}
