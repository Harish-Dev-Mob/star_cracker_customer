import HeroSection from "@/components/sections/HeroSection";
import BannerCarousel from "@/components/sections/BannerCarousel";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Testimonials from "@/components/sections/Testimonials";
import SafetyGuidelines from "@/components/sections/SafetyGuidelines";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
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

  const [reviews, minPrice] = await Promise.all([
    prisma.review.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
    }),
    fetchMinPrice(),
  ]);

  const fmtPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minPrice);

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      {reviews.length > 0 && <Testimonials reviews={reviews} />}

      <BannerCarousel />

      {/* ── Call to Action / Safety Strip ───────────────────────── */}
      <section className="py-16 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="container-site relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-red-700 via-red-600 to-orange-600 shadow-[0_10px_40px_rgba(220,38,38,0.3)] relative overflow-hidden group">
            {/* Glowing blobs inside CTA */}
            <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-orange-400/40 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-yellow-400/30 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white/20">
                <span className="text-4xl group-hover:animate-sparkle">🎆</span>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
                  Ready to Light Up Your Celebration?
                </h3>
                <p className="text-base text-red-100/90 mt-2 font-medium max-w-lg">
                  Browse our complete collection of premium fireworks — combos starting at just <strong>{fmtPrice}</strong>.
                </p>
              </div>
            </div>
            
            <Link href="/products" className="shrink-0 relative z-10 w-full md:w-auto">
              <Button 
                variant="accent" 
                size="lg" 
                className="w-full md:w-auto h-14 px-10 text-lg rounded-xl shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
              >
                Shop All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
    </>
  );
}
