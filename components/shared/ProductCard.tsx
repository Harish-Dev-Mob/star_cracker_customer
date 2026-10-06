"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn, parseImages } from "@/lib/utils";
import { Badge, getStockVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart, type CartProduct } from "@/hooks/useCart";
import { useWishlist, type WishlistProduct } from "@/hooks/useWishlist";
import { toast } from "@/components/ui/Toast";
import { useTranslation } from "@/store/useI18n";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    images: string; // JSON string
    stock: number;
    isCombo?: boolean;
    isFeatured?: boolean;
    category?: { name: string };
  };
  className?: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(n);
}

function getDiscount(original: number, discounted: number) {
  return Math.round(((original - discounted) / original) * 100);
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const items = useCart((s) => s.items);
  const toggleWishlist = useWishlist((s) => s.toggleItem);
  const isInWishlist = useWishlist((s) => s.isInWishlist);
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  
  const wishlisted = isMounted && isInWishlist(product.id);
  const { t } = useTranslation();
  
  const parsedImages = parseImages(product.images);
  const mainImage = parsedImages[0] ?? "/icons/logo.png";
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const outOfStock = product.stock === 0;

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = isMounted ? (cartItem?.quantity || 0) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    const cartProd: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      images: parsedImages,
      stock: product.stock,
    };
    addItem(cartProd);
    toast.success("Added to cart", product.name);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wp: WishlistProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      images: parsedImages,
      stock: product.stock,
      category: product.category,
    };
    toggleWishlist(wp);
    toast.success(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      product.name
    );
  };

  const handleUpdateQty = (e: React.MouseEvent, newQty: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, newQty);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl overflow-hidden",
        "bg-white dark:bg-gray-900 border-2 border-transparent hover:border-orange-100 dark:hover:border-orange-900/50",
        "shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.12)] dark:hover:shadow-[0_20px_40px_rgba(220,38,38,0.2)]",
        "transition-all duration-500 transform hover:-translate-y-2",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-800">
        {/* Dark overlay on hover for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/icons/logo.png";
          }}
        />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {hasDiscount && (
            <Badge variant="discount" className="shadow-lg backdrop-blur-md bg-red-600/90 text-yellow-300 border-none font-black tracking-wider uppercase text-[10px]">
              {getDiscount(product.price, product.discountPrice!)}% OFF
            </Badge>
          )}
          {product.isCombo && <Badge variant="combo" className="shadow-lg font-bold">Combo</Badge>}
          {product.isFeatured && <Badge variant="featured" className="shadow-lg font-bold">⭐ Popular</Badge>}
        </div>
        
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
          {/* Wishlist heart */}
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 ${
              wishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={wishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <Badge variant={getStockVariant(product.stock)} className="shadow-lg font-bold">
            {outOfStock ? t.product.outOfStock : product.stock <= 10 ? `Only ${product.stock} left` : "In Stock"}
          </Badge>
        </div>
        
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 bg-white dark:bg-gray-900 relative z-20 border-t border-gray-100 dark:border-gray-800">
        {product.category && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 mb-1">
            {product.category.name}
          </span>
        )}
        <h3 className="text-base font-black text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-display tracking-tight mb-3">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-xl font-black text-red-600 drop-shadow-sm">
                {formatPrice(product.discountPrice!)}
              </span>
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-black text-gray-900 dark:text-white drop-shadow-sm">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart (Always visible) */}
        <div className="mt-4">
          {quantityInCart > 0 ? (
            <div className="flex items-center justify-between bg-orange-50/50 shadow-inner rounded-xl h-11 px-2 border border-orange-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg bg-white text-orange-600 shadow-sm hover:bg-orange-100"
                onClick={(e) => handleUpdateQty(e, quantityInCart - 1)}
              >
                -
              </Button>
              <span className="font-black text-lg text-orange-700">{quantityInCart}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg bg-white text-orange-600 shadow-sm hover:bg-orange-100"
                onClick={(e) => handleUpdateQty(e, quantityInCart + 1)}
                disabled={quantityInCart >= product.stock}
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              variant={outOfStock ? "ghost" : "primary"}
              className="w-full rounded-xl font-bold h-11 shadow-md bg-gradient-to-r from-red-600 to-orange-500 border-none text-white"
            >
              {outOfStock ? t.product.outOfStock : t.product.addToCart}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
