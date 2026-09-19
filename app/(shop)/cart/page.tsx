"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/store/useI18n";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
}

const MIN_ORDER_VALUE = 299;
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 49;

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { t } = useTranslation();
  const total = subtotal();
  const belowMinimum = items.length > 0 && total < MIN_ORDER_VALUE;

  // Progress bar calculations for Free Delivery
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const progressPercentage = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="py-20 lg:py-32 flex justify-center items-center px-4 bg-gray-50/50 dark:bg-gray-950/50 min-h-[70vh]">
        <div className="container-site max-w-lg mx-auto bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-3xl px-10 py-16 text-center shadow-xl relative overflow-hidden animate-pop-in">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-transparent opacity-50 -z-10" />
          <div className="h-24 w-24 mx-auto mt-8 bg-gradient-to-tr from-orange-100 to-red-50 rounded-full flex justify-center items-center mb-6 shadow-inner ring-4 ring-white">
            <span className="text-5xl block">🛒</span>
          </div>
          <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            {t.cart.empty}
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Looks like you haven&apos;t added any fireworks yet. Browse our spectacular collection and light up your celebration!
          </p>
          <Link href="/products" className="inline-block w-full sm:w-auto mb-8">
            <Button variant="primary" className="w-full sm:w-auto rounded-xl h-10 px-6 text-sm shadow-lg hover:shadow-orange-500/25 transition-all group">
              <span className="group-hover:animate-sparkle mr-2 text-lg">🎆</span>
              <span className="font-bold tracking-wide uppercase">Start Shopping</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12 bg-gray-50/30 dark:bg-gray-950/30 min-h-screen">
      <div className="container-site max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 animate-slide-up">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t.cart.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
              You have {items.length} {items.length === 1 ? 'item' : 'items'} in your cart.
            </p>
          </div>
          <button
            onClick={() => {
              clearCart();
              toast.info("Cart cleared", "All items removed");
            }}
            className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-2 group bg-white dark:bg-gray-900 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer"
          >
            <span className="group-hover:scale-125 transition-transform origin-center">🗑️</span> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {items.map((item, index) => {
              const img = (() => {
                try { return (item.product.images as unknown as string[])[0] || "/images/products/placeholder.jpg"; }
                catch { return "/images/products/placeholder.jpg"; }
              })();
              const price = item.product.discountPrice ?? item.product.price;

              return (
                <div
                  key={item.product.id}
                  className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Subtle Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative h-24 sm:h-32 w-24 sm:w-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-inner group-hover:shadow-md transition-all duration-300 z-10"
                  >
                    <Image
                      src={img}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/placeholder.jpg"; }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-base sm:text-lg font-bold text-gray-900 dark:text-white hover:text-[var(--color-primary)] transition-colors line-clamp-2 pr-4 leading-snug"
                      >
                        {item.product.name}
                      </Link>

                      {/* Mobile Remove Button */}
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.info("Removed", item.product.name);
                        }}
                        className="sm:hidden text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer text-lg p-1 bg-gray-50 dark:bg-gray-800 rounded-full"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 mb-4">
                      {formatPrice(price)} <span className="font-normal text-gray-400 dark:text-gray-500">each</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-9 w-9 flex items-center justify-center text-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="h-9 w-10 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-white bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-9 w-9 flex items-center justify-center text-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-lg sm:text-xl font-black text-[var(--color-primary)] bg-orange-50 px-3 py-1 rounded-lg">
                          {formatPrice(price * item.quantity)}
                        </span>
                        {/* Desktop Remove Button */}
                        <button
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.info("Removed", item.product.name);
                          }}
                          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="sticky top-28 p-6 lg:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800 shadow-xl overflow-hidden relative">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100/50 dark:from-orange-500/10 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />

              <h2 className="font-display text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>🧾</span> Order Summary
              </h2>

              {/* Free Delivery Progress Bar */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                  <span className="text-gray-500 dark:text-gray-400">Delivery</span>
                  <span className={cn(amountToFreeDelivery === 0 ? "text-green-600 font-black" : "text-gray-500")}>
                    {amountToFreeDelivery === 0 ? "Free!" : `${formatPrice(amountToFreeDelivery)} to Free`}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out relative",
                      amountToFreeDelivery === 0
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-orange-400 to-[var(--color-primary)]"
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite] opacity-50" />
                  </div>
                </div>
                {amountToFreeDelivery === 0 && (
                  <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1 animate-pop-in">
                    <span className="animate-bounce">🎉</span> You unlocked Free Delivery!
                  </p>
                )}
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Delivery Fee</span>
                  <span className={cn("font-bold", amountToFreeDelivery === 0 ? "text-green-500" : "text-gray-900 dark:text-white")}>
                    {amountToFreeDelivery === 0 ? "FREE" : formatPrice(DELIVERY_FEE)}
                  </span>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount</span>
                    <span className="text-2xl font-black text-[var(--color-primary)]">
                      {formatPrice(total + (amountToFreeDelivery === 0 ? 0 : DELIVERY_FEE))}
                    </span>
                  </div>
                  <p className="text-xs text-right text-gray-400 mt-1 font-medium">Inclusive of all taxes</p>
                </div>
              </div>

              {belowMinimum && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-sm font-semibold text-red-700 animate-pop-in flex gap-3 items-start shadow-sm">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p>Minimum order value is {formatPrice(MIN_ORDER_VALUE)}.</p>
                    <p className="text-xs mt-1 text-red-600/80">Add {formatPrice(MIN_ORDER_VALUE - total)} more to checkout.</p>
                  </div>
                </div>
              )}

              <Link href="/checkout" className={cn("block", belowMinimum ? "pointer-events-none" : "")}>
                <Button
                  variant="primary"
                  className={cn(
                    "w-full h-14 rounded-xl text-[15px] uppercase tracking-wider font-bold shadow-lg transition-all overflow-hidden relative group",
                    belowMinimum ? "opacity-50 cursor-not-allowed grayscale" : "hover:shadow-orange-500/30 hover:-translate-y-0.5"
                  )}
                  disabled={belowMinimum}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Proceed to Checkout <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  {!belowMinimum && (
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
                  )}
                </Button>
              </Link>

              <Link href="/products" className="block mt-4">
                <Button variant="ghost" className="w-full h-12 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-bold uppercase tracking-wider text-xs transition-colors">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
