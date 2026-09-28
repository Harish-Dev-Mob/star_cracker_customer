"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useCart, type CartProduct } from "@/hooks/useCart";
import { useWishlist, type WishlistProduct } from "@/hooks/useWishlist";
import { toast } from "@/components/ui/Toast";
import { Badge, getStockVariant } from "@/components/ui/Badge";

interface ProductListRowProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    images: string;
    stock: number;
    isCombo?: boolean;
    isFeatured?: boolean;
    weight?: string | null;
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

export function ProductListRow({ product, className }: ProductListRowProps) {
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const items = useCart((s) => s.items);
  const toggleWishlist = useWishlist((s) => s.toggleItem);
  const wishlistItems = useWishlist((s) => s.items);

  const [isMounted, setIsMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const wishlisted = isMounted && wishlistItems.some(i => i.id === product.id);

  const parsedImages: string[] = (() => {
    try {
      return JSON.parse(product.images);
    } catch {
      return ["/icons/logo.png"];
    }
  })();
  const mainImage = parsedImages[0] ?? "/icons/logo.png";
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const outOfStock = product.stock === 0;

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = isMounted ? cartItem?.quantity || 0 : 0;

  const effectivePrice = hasDiscount ? product.discountPrice! : product.price;
  const rowTotal = quantityInCart > 0 ? effectivePrice * quantityInCart : 0;

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
        "group flex items-center bg-[var(--color-bg-card)] border border-[var(--color-border)]",
        "hover:border-orange-300 hover:shadow-md transition-all duration-300",
        "rounded-xl overflow-hidden",
        quantityInCart > 0 &&
        "border-orange-300 bg-orange-50/30 dark:bg-orange-950/10",
        className
      )}
    >
      {/* Image */}
      <div
        className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 overflow-hidden cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsZoomed(true);
        }}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="96px"
          className="object-contain group-hover:scale-110 transition-transform duration-500 p-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/icons/logo.png";
          }}
        />
        {hasDiscount && (
          <span className="absolute top-1 left-1 bg-red-600 text-yellow-300 text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none">
            {getDiscount(product.price, product.discountPrice!)}% OFF
          </span>
        )}
      </div>

      {/* Product Name */}
      <div className="flex-1 min-w-0 px-3 sm:px-4 py-3 border-r border-[var(--color-border)]">
        <div>
          {product.category?.name && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-0.5 hidden sm:block">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm sm:text-base font-black text-[var(--color-text)] leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.weight && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-medium">
              {product.weight}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {product.isCombo && (
              <Badge variant="combo" className="text-[10px] py-0 font-bold">
                Combo
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="featured" className="text-[10px] py-0 font-bold">
                ⭐ Popular
              </Badge>
            )}
            <Badge
              variant={getStockVariant(product.stock)}
              className="text-[10px] py-0 font-bold"
            >
              {outOfStock
                ? "Out of Stock"
                : product.stock <= 10
                  ? `Only ${product.stock} left`
                  : "In Stock"}
            </Badge>
          </div>
        </div>
      </div>

      {/* MRP */}
      <div className="hidden md:flex flex-col items-center justify-center w-28 px-3 py-3 border-r border-[var(--color-border)] shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
          MRP
        </p>
        {hasDiscount ? (
          <span className="text-sm font-bold text-gray-400 line-through">
            {formatPrice(product.price)}
          </span>
        ) : (
          <span className="text-sm font-bold text-[var(--color-text)]">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Offer Price */}
      <div className="hidden sm:flex flex-col items-center justify-center w-28 px-3 py-3 border-r border-[var(--color-border)] shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
          Offer Price
        </p>
        <span
          className={cn(
            "text-sm font-black",
            hasDiscount ? "text-green-600" : "text-[var(--color-text)]"
          )}
        >
          {formatPrice(effectivePrice)}
        </span>
      </div>

      {/* Quantity Stepper */}
      <div className="flex flex-col items-center justify-center w-28 sm:w-32 px-2 sm:px-3 py-3 border-r border-[var(--color-border)] shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
          Qty
        </p>
        {outOfStock ? (
          <span className="text-xs font-bold text-red-500">Unavailable</span>
        ) : (
          <div
            className="flex items-center rounded-lg overflow-hidden border-2 border-[var(--color-border)] group-hover:border-orange-300 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={(e) => handleUpdateQty(e, quantityInCart - 1)}
              disabled={quantityInCart <= 0}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-base font-black transition-all duration-200",
                "hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-90",
                quantityInCart <= 0
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-red-600 cursor-pointer"
              )}
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-black text-[var(--color-text)] border-x border-[var(--color-border)]">
              {quantityInCart}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={
                quantityInCart === 0
                  ? handleAddToCart
                  : (e) => handleUpdateQty(e, quantityInCart + 1)
              }
              disabled={quantityInCart >= product.stock}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-base font-black transition-all duration-200",
                "hover:bg-green-50 dark:hover:bg-green-950/30 active:scale-90",
                quantityInCart >= product.stock
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-green-600 cursor-pointer"
              )}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Row Total */}
      <div className="hidden sm:flex flex-col items-center justify-center w-24 sm:w-28 px-3 py-3 border-r border-[var(--color-border)] shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
          Total
        </p>
        <span
          className={cn(
            "text-sm font-black",
            rowTotal > 0 ? "text-red-600" : "text-[var(--color-text-muted)]"
          )}
        >
          {rowTotal > 0 ? formatPrice(rowTotal) : "₹0.00"}
        </span>
      </div>

      {/* Wishlist */}
      <div className="flex items-center justify-center w-12 shrink-0 px-2">
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleToggleWishlist}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-all duration-300 hover:scale-110 active:scale-95",
            wishlisted
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white dark:bg-gray-800 border-[var(--color-border)] text-gray-400 hover:border-red-300 hover:text-red-500"
          )}
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
      </div>

      {/* Fullscreen Image Overlay */}
      {isZoomed && isMounted && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsZoomed(false);
          }}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-4xl max-h-[85vh] aspect-square bg-transparent rounded-2xl overflow-hidden shadow-2xl"
               onClick={(e) => e.stopPropagation()}>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
