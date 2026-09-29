import HeroSection from "@/components/sections/HeroSection";
import BannerCarousel from "@/components/sections/BannerCarousel";
import AllProductsShopSection from "@/components/sections/AllProductsShopSection";
import Testimonials from "@/components/sections/Testimonials";
import SafetyGuidelines from "@/components/sections/SafetyGuidelines";
import { FloatingNote } from "@/components/layout/FloatingNote";
import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // ── Fetch cheapest active combo price (falls back to cheapest product) ──────
  async function fetchMinPrice(): Promise<number> {
    // Try combos first
    const combo = await prisma.product.findFirst({
      where: { isActive: true, isCombo: true },
      orderBy: { price: "asc" },
      select: { price: true, discountPrice: true },
    });
    if (combo) return combo.discountPrice ?? combo.price;

    // Fall back to any cheapest active product
    const any = await prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { price: "asc" },
      select: { price: true, discountPrice: true },
    });
    return any ? (any.discountPrice ?? any.price) : 399;
  }

  const [reviews, minPrice, session] = await Promise.all([
    prisma.review.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
    }),
    fetchMinPrice(),
    auth(),
  ]);

  const orderCount = session?.user?.id
    ? await prisma.order.count({ where: { userId: session.user.id } })
    : 0;

  return (
    <>
      <HeroSection minPrice={minPrice} />
      <AllProductsShopSection />
      {reviews.length > 0 && <Testimonials reviews={reviews} />}

      <BannerCarousel />

      <SafetyGuidelines />

      {/* ── Store Location Map ──────────────────────────────────── */}
      <section className="pt-16 md:pt-24 bg-gradient-to-b from-white dark:from-gray-950 to-orange-50 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-site relative z-10 mb-12">
          <div className="text-center">
            <span className="text-5xl mb-4 inline-block animate-bounce drop-shadow-md">📍</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-orange-500 pb-2">
              Visit Our Store in Sivakasi
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto font-medium text-lg">
              Experience the magic in person. Find us in the fireworks capital of India!
            </p>
          </div>
        </div>
          
        {/* Full-width Map */}
        <div className="w-full h-[400px] md:h-[500px] relative group">
          <div className="absolute inset-0 bg-red-900/5 pointer-events-none z-10 group-hover:bg-transparent transition-colors duration-500" />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125745.54124610191!2d77.7289569766627!3d9.453303833777553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee43e7428c5%3A0xc6c76e26715f57fc!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[30%] contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 w-full h-full object-cover"
          />
        </div>
      </section>

      {orderCount > 0 && <FloatingNote />}
    </>
  );
}
