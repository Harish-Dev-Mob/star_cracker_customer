"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge, getStockVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/shared/ProductCard";
import { useCart, type CartProduct } from "@/hooks/useCart";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  weight: string | null;
  isCombo: boolean;
  isFeatured: boolean;
  images: string;
  parsedImages: string[];
  parsedTags: string[];
  category: { id: string; name: string; slug: string } | null;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: {
    id: string; name: string; slug: string; price: number; discountPrice: number | null;
    images: string; stock: number; isCombo: boolean; isFeatured: boolean;
    category: { name: string } | null;
  }[];
}) {
  const addItem = useCart((s) => s.addItem);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const effectivePrice = hasDiscount ? product.discountPrice! : product.price;
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    const cartProd: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.parsedImages,
      stock: product.stock,
    };
    addItem(cartProd, qty);
    toast.success("Added to cart", `${qty}× ${product.name}`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="container-site">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[var(--color-primary)] transition-colors">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[var(--color-text)] font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Image Gallery ────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)] border border-[var(--color-border)]">
              <Image
                src={product.parsedImages[activeImage] ?? "/images/products/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/products/placeholder.jpg";
                }}
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge variant="discount">
                    {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
                  </Badge>
                )}
                {product.isCombo && <Badge variant="combo">Combo</Badge>}
                {product.isFeatured && <Badge variant="featured">⭐ Popular</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.parsedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.parsedImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 rounded-[var(--radius-md)] overflow-hidden border-2 transition-all cursor-pointer",
                      i === activeImage ? "border-[var(--color-primary)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ─────────────────────────────────────── */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-dark)] hover:underline mb-2"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-[var(--color-primary)]">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-[var(--color-text-light)] line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock & Weight */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant={getStockVariant(product.stock)}>
                {outOfStock ? "Out of Stock" : product.stock <= 10 ? `Only ${product.stock} left` : "In Stock"}
              </Badge>
              {product.weight && (
                <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-muted)] px-2.5 py-1 rounded-full">
                  ⚖️ {product.weight}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tags */}
            {product.parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.parsedTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-muted)] px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            {!outOfStock && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center text-lg hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-x border-[var(--color-border)]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="h-10 w-10 flex items-center justify-center text-lg hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  (max {product.stock})
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={outOfStock}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                {outOfStock ? "Out of Stock" : "🛒 Add to Cart"}
              </Button>
              {!outOfStock && (
                <Button
                  onClick={handleBuyNow}
                  variant="accent"
                  size="lg"
                  className="flex-1"
                >
                  ⚡ Buy Now
                </Button>
              )}
            </div>


          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <h2 className="font-display text-2xl font-bold text-[var(--color-text)] mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={{ ...p, category: p.category ? { name: p.category.name } : undefined }} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
