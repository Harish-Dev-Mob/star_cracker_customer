import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  // Parse JSON fields
  const images: string[] = (() => {
    try { return JSON.parse(product.images); }
    catch { return ["/images/products/placeholder.jpg"]; }
  })();

  const tags: string[] = (() => {
    try { return JSON.parse(product.tags); }
    catch { return []; }
  })();

  // Related products — same category, different product
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { category: true },
    take: 4,
  });

  return (
    <ProductDetailClient
      product={{
        ...product,
        parsedImages: images,
        parsedTags: tags,
      }}
      relatedProducts={related}
    />
  );
}
