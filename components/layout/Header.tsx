"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { NAV_LINKS, SITE_NAME, CONTACT_INFO } from "@/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/store/useI18n";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin } = useCurrentUser();
  const { t } = useTranslation();
  const cartItems = useCart((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = useWishlist((s) => s.count());

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Top promo bar - fetched from SiteConfig
  const [topBannerEnabled, setTopBannerEnabled] = useState(true);
  const [topBannerText, setTopBannerText] = useState("Festival Sale is LIVE! Up to 40% OFF on all Crackers");

  useEffect(() => {
    fetch("/api/public/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.topBannerEnabled !== undefined) {
          setTopBannerEnabled(data.topBannerEnabled === "true");
        }
        if (data.topBannerText) {
          setTopBannerText(data.topBannerText);
        }
      })
      .catch(() => { /* keep defaults */ });
  }, []);

  // Detect scroll for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Top Contact & Promo Bar ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white text-[11px] font-medium tracking-wide py-2 relative z-50 shadow-sm border-b border-red-950/20">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Contact Info */}
          <div className="flex items-center gap-4 sm:gap-5 opacity-90">
            <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-1.5 hover:text-orange-200 transition-colors">
              <span>📞</span> {CONTACT_INFO.phone}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-1.5 hover:text-orange-200 transition-colors hidden sm:flex">
              <span>✉️</span> {CONTACT_INFO.email}
            </a>
            <div className="hidden md:flex items-center gap-1.5">
              <span>📍</span> {CONTACT_INFO.address}
            </div>
          </div>

          {/* Promo Text */}
          {topBannerEnabled && (
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-orange-200">
              <span className="animate-pulse text-sm">✨</span>
              {topBannerText}
              <span className="animate-pulse text-sm">✨</span>
            </div>
          )}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800 shadow-sm py-2 lg:py-3"
            : "bg-white/40 dark:bg-gray-950/40 backdrop-blur-md py-4 lg:py-5"
        )}
      >
        <div className="container-site flex items-center justify-between">
          {/* ── Logo ────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group relative z-50 outline-none rounded-xl"
          >
            <div className="relative flex items-center justify-center h-11 w-11 transition-all duration-300 group-hover:-translate-y-0.5">
              <Image src="/icons/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-display text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight group-hover:to-[var(--color-primary)] transition-all duration-300">
              {SITE_NAME}
            </span>
          </Link>



          {/* ── Right Actions ───────────────────────────────────────── */}
          <div className="flex items-center gap-3 relative z-50">
            {/* <div className="hidden lg:flex items-center gap-2 mr-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div> */}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-red-300 dark:hover:border-red-500 transition-all duration-200 group"
              aria-label={`Wishlist with ${isMounted ? wishlistCount : 0} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors duration-300"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isMounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-6 w-6 flex items-center justify-center text-[11px] font-black text-white bg-red-500 rounded-full shadow-sm border-2 border-white transform transition-transform group-hover:scale-110">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-200 group"
              aria-label={`Cart with ${isMounted ? cartCount : 0} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-[var(--color-primary)] transition-colors group-hover:animate-rocket-launch duration-300"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-6 w-6 flex items-center justify-center text-[11px] font-black text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-sm border-2 border-white transform transition-transform group-hover:animate-firework-burst">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="hidden lg:flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-200 cursor-pointer"
                >
                  <span className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-inner ring-2 ring-white dark:ring-gray-900">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 max-w-[90px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <svg
                    className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", accountOpen && "rotate-180")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <div className="absolute right-0 top-14 z-50 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800 rounded-2xl shadow-2xl py-2 animate-pop-in origin-top-right">
                      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2 space-y-1">
                        {!isAdmin && (
                          <Link
                            href="/orders"
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group",
                              isActive("/orders")
                                ? "bg-orange-50 dark:bg-orange-950/40 text-[var(--color-primary)] ring-1 ring-orange-200 dark:ring-orange-800"
                                : "text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-orange-50 dark:hover:bg-gray-800"
                            )}
                          >
                            <span className={cn("text-lg transition-transform", isActive("/orders") ? "scale-110" : "group-hover:scale-110")}>📦</span>
                            <span className="flex-1">{t.header.myOrders}</span>
                            {isActive("/orders") && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] ml-auto" />}
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group",
                            isActive("/profile")
                              ? "bg-orange-50 dark:bg-orange-950/40 text-[var(--color-primary)] ring-1 ring-orange-200 dark:ring-orange-800"
                              : "text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-orange-50 dark:hover:bg-gray-800"
                          )}
                        >
                          <span className={cn("text-lg transition-transform", isActive("/profile") ? "scale-110" : "group-hover:scale-110")}>👤</span>
                          <span className="flex-1">My Profile</span>
                          {isActive("/profile") && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] ml-auto" />}
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 group",
                              isActive("/admin")
                                ? "bg-orange-50 dark:bg-orange-950/40 text-[var(--color-primary)] ring-1 ring-orange-200 dark:ring-orange-800"
                                : "text-[var(--color-primary)] hover:bg-orange-50 dark:hover:bg-gray-800"
                            )}
                          >
                            <span className={cn("text-lg transition-transform", isActive("/admin") ? "rotate-45" : "group-hover:rotate-45")}>⚙️</span>
                            <span className="flex-1">{t.header.dashboard}</span>
                            {isActive("/admin") && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] ml-auto" />}
                          </Link>
                        )}
                      </div>
                      <div className="px-2 pb-1">
                        <hr className="border-gray-100 dark:border-gray-800 my-1 mx-2" />
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer mt-1 group"
                        >
                          <span className="text-lg group-hover:-translate-x-1 transition-transform">🚪</span> {t.header.logout}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block">
                <Button size="sm" variant="primary" className="rounded-full px-6 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm h-11 uppercase tracking-wider">
                  {t.header.login}
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-5">
                <span
                  className={cn(
                    "block h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 origin-center",
                    mobileOpen && "rotate-45 translate-y-2"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300",
                    mobileOpen && "opacity-0 scale-0"
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 origin-center",
                    mobileOpen && "-rotate-45 -translate-y-2"
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────────────────── */}
        <div
          className={cn(
            "lg:hidden absolute left-0 w-full overflow-hidden transition-all duration-300 ease-in-out z-30 shadow-2xl rounded-b-3xl border-b border-gray-200/50 dark:border-gray-800",
            "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl",
            mobileOpen ? "max-h-[700px] opacity-100 top-full" : "max-h-0 opacity-0 top-full"
          )}
        >
          <nav className="container-site py-5 flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-3.5 rounded-xl text-[15px] font-bold transition-all uppercase tracking-wide",
                    active
                      ? "text-white bg-gradient-to-r from-[var(--color-primary)] to-orange-400 shadow-sm translate-x-2"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:translate-x-1"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <hr className="border-gray-100 my-3" />
            {isAuthenticated ? (
              <div className="space-y-1">
                {!isAdmin && (
                  <Link
                    href="/orders"
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 text-[15px] font-bold rounded-xl transition-all duration-200",
                      isActive("/orders")
                        ? "bg-orange-50 dark:bg-orange-950/40 text-[var(--color-primary)] ring-1 ring-orange-200 dark:ring-orange-800 translate-x-1"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1"
                    )}
                  >
                    <span>📦</span>
                    <span className="flex-1">{t.header.myOrders}</span>
                    {isActive("/orders") && <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-[15px] font-bold rounded-xl transition-all duration-200",
                    isActive("/profile")
                      ? "bg-orange-50 dark:bg-orange-950/40 text-[var(--color-primary)] ring-1 ring-orange-200 dark:ring-orange-800 translate-x-1"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1"
                  )}
                >
                  <span>👤</span>
                  <span className="flex-1">My Profile</span>
                  {isActive("/profile") && <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 text-[15px] font-bold rounded-xl transition-all duration-200",
                      isActive("/admin")
                        ? "bg-orange-50 dark:bg-orange-950/40 text-[var(--color-primary)] ring-1 ring-orange-200 dark:ring-orange-800 translate-x-1"
                        : "text-[var(--color-primary)] hover:bg-orange-50 dark:hover:bg-gray-800 hover:translate-x-1"
                    )}
                  >
                    <span>⚙️</span>
                    <span className="flex-1">{t.header.dashboard}</span>
                    {isActive("/admin") && <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full text-left px-5 py-3 text-[15px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer mt-2"
                >
                  🚪 {t.header.logout}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-2 pt-2 pb-4">
                <div className="flex items-center justify-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
                <Link href="/login" className="w-full">
                  <Button variant="primary" className="w-full rounded-xl shadow-md h-12 text-sm uppercase tracking-wider font-bold">
                    {t.header.login}
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="secondary" className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 border-none text-gray-800 h-12 text-sm uppercase tracking-wider font-bold">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        hideCloseButton
        size="sm"
      >
        <div className="relative -m-6 mb-6 h-32 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center overflow-hidden rounded-t-[var(--radius-xl)]">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-red-900/20 rounded-full blur-2xl pointer-events-none" />
          <span className="text-6xl animate-bounce drop-shadow-xl relative z-10">👋</span>
        </div>

        <div className="text-center px-2 pb-2">
          <h2 className="text-2xl font-black text-gray-900 mb-2 font-display tracking-tight">
            Leaving so soon?
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
            Are you sure you want to sign out? You&apos;ll need to sign back in to track your orders and grab festive deals.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              className="w-full rounded-xl h-12 font-bold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 transition-all border-none uppercase tracking-wider text-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Yes, Sign Out
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-xl h-12 font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Stay Logged In
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
