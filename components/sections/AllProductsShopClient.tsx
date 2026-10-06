"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useCart, type CartProduct } from "@/hooks/useCart";
import { useWishlist, type WishlistProduct } from "@/hooks/useWishlist";
import { toast } from "@/components/ui/Toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  images: string;
  stock: number;
  isCombo: boolean;
  isFeatured: boolean;
  weight: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface Props {
  categories: Category[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function parseImages(raw: string): string[] {
  const fallback = ["/icons/logo.png"];
  if (!raw || typeof raw !== "string") return fallback;

  // Handle plain (non-JSON) URL strings stored directly
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return [trimmed];
  }

  try {
    const arr = JSON.parse(trimmed);
    if (!Array.isArray(arr)) return fallback;

    // Filter out empty / non-string / invalid entries
    const valid = arr.filter(
      (u): u is string =>
        typeof u === "string" &&
        u.trim().length > 0 &&
        (u.startsWith("/") || u.startsWith("http://") || u.startsWith("https://"))
    );

    return valid.length > 0 ? valid : fallback;
  } catch {
    return fallback;
  }
}


function getDiscount(orig: number, disc: number) {
  return Math.round(((orig - disc) / orig) * 100);
}

// ── Product Row ───────────────────────────────────────────────────────────────

function ProductRow({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const items = useCart((s) => s.items);
  const toggleWishlist = useWishlist((s) => s.toggleItem);
  const wishlistItems = useWishlist((s) => s.items);

  const [mounted, setMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  useEffect(() => setMounted(true), []);

  const images = parseImages(product.images);
  const img = images[0];
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const outOfStock = product.stock === 0;
  const effectivePrice = hasDiscount ? product.discountPrice! : product.price;

  const cartItem = mounted ? items.find((i) => i.product.id === product.id) : undefined;
  const qty = cartItem?.quantity ?? 0;
  const rowTotal = qty > 0 ? effectivePrice * qty : 0;
  const wishlisted = mounted && wishlistItems.some((i) => i.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    const cp: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      images,
      stock: product.stock,
    };
    addItem(cp);
    toast.success("Added to cart", product.name);
  };

  const handleQty = (e: React.MouseEvent, n: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, n);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wp: WishlistProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      images,
      stock: product.stock,
    };
    toggleWishlist(wp);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist", product.name);
  };

  return (
    <div
      className={cn(
        "flex items-center bg-[#FFF9F0] border-b border-[#E8D5C4] last:border-b-0",
        "hover:bg-orange-50/60 transition-colors duration-200",
        qty > 0 && "bg-orange-50/80"
      )}
    >
      {/* Image */}
      <div
        className="relative shrink-0 w-[72px] h-[72px] sm:w-20 sm:h-20 border-r border-[#E8D5C4] overflow-hidden bg-white group/img cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsZoomed(true);
        }}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/20">
          <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="80px"
          className="object-contain p-1 group-hover/img:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/icons/logo.png";
          }}
        />
        {hasDiscount && (
          <span className="absolute top-0.5 left-0.5 bg-red-600 text-yellow-300 text-[8px] font-black px-1 py-0.5 rounded leading-none">
            {getDiscount(product.price, product.discountPrice!)}%
          </span>
        )}
      </div>

      {/* Product Name */}
      <div className="flex-1 min-w-0 px-3 sm:px-4 py-2 border-r border-[#E8D5C4]">
        <h4 className="text-sm sm:text-[15px] font-bold text-gray-800 leading-snug line-clamp-2">
          {product.name}
        </h4>
        {product.weight && (
          <span className="text-xs text-gray-500 font-medium block">{product.weight}</span>
        )}
        {/* Mobile Price Display */}
        <div className="sm:hidden flex items-center gap-1.5 mt-1">
          <span className={cn("text-sm font-black", hasDiscount ? "text-green-600" : "text-gray-800")}>
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] font-semibold text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* MRP */}
      <div className="hidden md:flex flex-col items-center justify-center w-28 px-2 py-3 border-r border-[#E8D5C4] shrink-0">
        {hasDiscount ? (
          <span className="text-sm font-semibold text-gray-400 line-through">
            {formatPrice(product.price)}
          </span>
        ) : (
          <span className="text-sm font-semibold text-gray-700">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Offer Price */}
      <div className="hidden sm:flex flex-col items-center justify-center w-28 px-2 py-3 border-r border-[#E8D5C4] shrink-0">
        <span className={cn("text-sm font-black", hasDiscount ? "text-green-600" : "text-gray-800")}>
          {formatPrice(effectivePrice)}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex flex-col items-center justify-center w-28 sm:w-32 px-2 py-3 border-r border-[#E8D5C4] shrink-0">
        {outOfStock ? (
          <span className="text-xs font-bold text-red-500">Out of stock</span>
        ) : (
          <div
            className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <button
              type="button"
              aria-label="Decrease"
              disabled={qty <= 0}
              onClick={(e) => handleQty(e, qty - 1)}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-lg font-black transition-all",
                qty <= 0
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-red-600 bg-white hover:bg-red-50 cursor-pointer active:scale-90"
              )}
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-black text-gray-800 bg-white border-x border-gray-300">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase"
              disabled={qty >= product.stock}
              onClick={qty === 0 ? handleAdd : (e) => handleQty(e, qty + 1)}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-lg font-black transition-all",
                qty >= product.stock
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-green-600 bg-white hover:bg-green-50 cursor-pointer active:scale-90"
              )}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="hidden sm:flex flex-col items-center justify-center w-24 sm:w-28 px-2 py-3 border-r border-[#E8D5C4] shrink-0">
        <span className={cn("text-sm font-black", rowTotal > 0 ? "text-red-700" : "text-gray-400")}>
          {formatPrice(rowTotal)}
        </span>
      </div>

      {/* Wishlist */}
      <div className="flex items-center justify-center w-10 sm:w-12 shrink-0">
        <button
          type="button"
          aria-label={wishlisted ? "Remove wishlist" : "Add wishlist"}
          onClick={handleWishlist}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90",
            wishlisted ? "text-red-500" : "text-gray-300 hover:text-red-400"
          )}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Fullscreen Image Overlay */}
      {isZoomed && mounted && typeof document !== "undefined" && createPortal(
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
              src={img}
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

// ── Category Group ────────────────────────────────────────────────────────────

function CategoryGroup({ category }: { category: Category }) {
  const [collapsed, setCollapsed] = useState(false);
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Compute total for this category
  const catTotal = mounted
    ? category.products.reduce((sum, p) => {
      const ci = items.find((i) => i.product.id === p.id);
      if (!ci) return sum;
      const price = p.discountPrice != null && p.discountPrice < p.price ? p.discountPrice : p.price;
      return sum + price * ci.quantity;
    }, 0)
    : 0;

  // Discount % for header — show average across products that have discounts
  const discountedProducts = category.products.filter(
    (p) => p.discountPrice != null && p.discountPrice < p.price
  );
  const avgDiscount =
    discountedProducts.length > 0
      ? Math.round(
        discountedProducts.reduce(
          (sum, p) => sum + getDiscount(p.price, p.discountPrice!),
          0
        ) / discountedProducts.length
      )
      : null;

  return (
    <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-[#E8D5C4]">
      {/* Category header row */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1B5C85] text-white hover:bg-[#174f73] transition-colors cursor-pointer"
      >
        <span className="text-sm sm:text-base font-black uppercase tracking-wide flex items-center gap-2">
          {category.name}
          {avgDiscount !== null && (
            <span className="text-yellow-300 text-xs font-black">
              ({avgDiscount}%)
            </span>
          )}
        </span>
        <div className="flex items-center gap-3">
          {mounted && catTotal > 0 && (
            <span className="text-yellow-300 font-black text-sm">
              {formatPrice(catTotal)}
            </span>
          )}
          <span
            className={cn(
              "w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </span>
        </div>
      </button>

      {/* Product rows */}
      {!collapsed && (
        <div className="bg-[#FFF9F0]">
          {category.products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Net Total Bar (Fixed floating bottom) ────────────────────────────────────

function NetTotalBar() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = mounted
    ? items.reduce((sum, i) => {
      const price =
        i.product.discountPrice != null &&
          i.product.discountPrice < i.product.price
          ? i.product.discountPrice
          : i.product.price;
      return sum + price * i.quantity;
    }, 0)
    : 0;

  const itemCount = mounted
    ? items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  // Only show when there are items
  if (!mounted || itemCount === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] pointer-events-none"
      style={{ animation: "slideUpBar 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      <div className="group pointer-events-auto relative">
        {/* Mini Cart Popup on Hover */}
        <div className="absolute bottom-full right-0 mb-3 w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex flex-col max-h-[60vh] sm:max-h-[70vh]">
          <div className="p-3.5 border-b border-gray-100 bg-gray-50/80 rounded-t-2xl flex justify-between items-center backdrop-blur-md">
            <span className="font-black text-gray-800 text-sm tracking-wide">YOUR CART</span>
            <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{itemCount} items</span>
          </div>
          <div className="overflow-y-auto p-3 flex-1 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {items.map(item => {
              const price = item.product.discountPrice != null && item.product.discountPrice < item.product.price ? item.product.discountPrice : item.product.price;
              return (
                <div key={item.product.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <Image src={item.product.images[0] ?? "/icons/logo.png"} alt={item.product.name} fill className="object-contain p-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-800 truncate" title={item.product.name}>{item.product.name}</p>
                    <p className="text-[11px] text-gray-500 font-bold mt-0.5">{formatPrice(price)}</p>
                  </div>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 text-base font-black transition-colors active:scale-90">−</button>
                    <span className="w-7 text-center text-xs font-black text-gray-800 border-x border-gray-100">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 text-base font-black transition-colors active:scale-90 disabled:opacity-50 disabled:bg-gray-50">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Bar */}
        <div
          className="flex items-center gap-3 bg-gradient-to-r from-[#B91C1C] to-[#C82020] text-white rounded-2xl p-2 sm:p-2.5 sm:pr-4 shadow-[0_8px_30px_rgba(185,28,28,0.4)] border border-red-800/30"
        >
          <div className="flex flex-col justify-center bg-white/10 px-3 py-1.5 rounded-xl">
            <p className="text-[9px] font-bold uppercase tracking-widest text-red-200 leading-none mb-1">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
            <p className="text-sm sm:text-base font-black leading-none">
              {formatPrice(total)}
            </p>
          </div>

          <Link
            href="/cart"
            className="flex items-center gap-1.5 bg-white text-red-700 font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-md hover:bg-yellow-50 hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Cart
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideUpBar {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AllProductsShopClient({ categories }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const tabsRef = useRef<HTMLDivElement>(null);

  const visibleCategories =
    activeTab === "all"
      ? categories
      : categories.filter((c) => c.id === activeTab);

  const scrollTabs = (dir: "left" | "right") => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 lg:py-12 bg-[#FFF8F0]">
      <div className="container-site">
        {/* Section heading */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-black tracking-[0.2em] uppercase mb-3">
            🎆 All Products
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            Shop by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B91C1C] to-orange-500">
              Category
            </span>
          </h2>
          <p className="mt-2 text-gray-500 text-sm max-w-lg mx-auto">
            Browse all our products — pick your quantities and add directly to cart.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="relative mb-4 flex items-center gap-1">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollTabs("left")}
            className="shrink-0 w-7 h-7 rounded-full bg-white border border-[#E8D5C4] shadow flex items-center justify-center hover:bg-gray-50 cursor-pointer z-10"
            aria-label="Scroll tabs left"
          >
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable tabs */}
          <div
            ref={tabsRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1"
          >
            {/* ALL tab */}
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border-2 transition-all duration-200 cursor-pointer whitespace-nowrap",
                activeTab === "all"
                  ? "bg-[#B91C1C] border-[#B91C1C] text-white shadow-md shadow-red-300"
                  : "bg-white border-[#E8D5C4] text-gray-600 hover:border-red-300 hover:text-red-700"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border-2 transition-all duration-200 cursor-pointer whitespace-nowrap",
                  activeTab === cat.id
                    ? "bg-[#B91C1C] border-[#B91C1C] text-white shadow-md shadow-red-300"
                    : "bg-white border-[#E8D5C4] text-gray-600 hover:border-red-300 hover:text-red-700"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollTabs("right")}
            className="shrink-0 w-7 h-7 rounded-full bg-white border border-[#E8D5C4] shadow flex items-center justify-center hover:bg-gray-50 cursor-pointer z-10"
            aria-label="Scroll tabs right"
          >
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Table header */}
        <div className="hidden sm:flex items-center bg-gradient-to-r from-[#B91C1C] to-[#E05C1A] text-white rounded-t-xl overflow-hidden text-[11px] font-black uppercase tracking-wider mb-1">
          <div className="w-[72px] sm:w-20 shrink-0 px-2 py-2.5 text-center border-r border-white/20">Image</div>
          <div className="flex-1 px-4 py-2.5 border-r border-white/20">Product Name</div>
          <div className="hidden md:block w-28 px-2 py-2.5 border-r border-white/20 text-center">MRP</div>
          <div className="w-28 px-2 py-2.5 border-r border-white/20 text-center">Offer Price</div>
          <div className="w-28 sm:w-32 px-2 py-2.5 border-r border-white/20 text-center">Quantity</div>
          <div className="w-24 sm:w-28 px-2 py-2.5 border-r border-white/20 text-center">Total</div>
          <div className="w-10 sm:w-12 px-2 py-2.5 text-center">♥</div>
        </div>

        {/* Category groups */}
        <div>
          {visibleCategories.map((cat) => (
            <CategoryGroup key={cat.id} category={cat} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 pb-28 text-center">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#B91C1C] to-orange-500 text-white font-black uppercase tracking-wider text-sm shadow-lg shadow-red-300/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            🛒 Proceed to Cart
          </Link>
        </div>
      </div>

      {/* Floating Net Total Bar — rendered outside container so it overlays everything */}
      <NetTotalBar />
    </section>
  );
}
