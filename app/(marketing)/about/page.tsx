import { Shield, Sparkles, Truck, Users, Award, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About Us | FireCrackers",
  description: "Learn more about our mission to bring safe and spectacular fireworks to your celebrations.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[60%] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />

        <div className="container-site relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-sm mb-8 border border-orange-200 dark:border-orange-500/20 animate-fade-in">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Since 2012</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Lighting Up Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              Celebrations
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            We believe every celebration deserves a spectacular finish. For over a decade, we've been India's most trusted source for premium, safe, and breathtaking fireworks.
          </p>

          <div className="animate-slide-up flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.3s' }}>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-transform">
                Explore Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            {[
              { label: "Happy Families", value: "1M+", icon: Heart },
              { label: "Premium Products", value: "500+", icon: Sparkles },
              { label: "Cities Delivered", value: "50+", icon: Truck },
              { label: "Years of Trust", value: "12+", icon: Award },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8 relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                More than just <br />
                <span className="text-orange-500">fireworks.</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400">
                <p>
                  What started as a small family store in Sivakasi has grown into a nationwide platform. But our core mission remains the same: bringing people together through the magic of light and sound.
                </p>
                <p>
                  We handpick every product in our catalog, ensuring it meets the highest safety standards and delivers an unforgettable experience. From sparklers for the little ones to magnificent aerial shells for the grand finale, we curate the best so you can celebrate without worry.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/40 to-purple-500/40 mix-blend-overlay z-10" />
                <img
                  src="https://images.unsplash.com/photo-1533202958742-1e9bfdb5013b?q=80&w=1200&auto=format&fit=crop"
                  alt="Fireworks illuminating the night sky"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 z-20 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-black text-2xl text-gray-900 dark:text-white">100%</p>
                    <p className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm">Safe & Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us Grid ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              The FireCrackers Difference
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We don't just sell fireworks; we deliver memorable experiences right to your doorstep with unmatched quality and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Curated Selection",
                description: "We only stock premium brands and thoroughly tested products to ensure spectacular displays every time.",
                icon: Sparkles,
                color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
              },
              {
                title: "Safety Guaranteed",
                description: "All our products are government certified and strictly adhere to safety and environmental guidelines.",
                icon: Shield,
                color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              },
              {
                title: "Lightning Fast Delivery",
                description: "Last minute plans? Our optimized logistics network ensures your celebration essentials arrive on time.",
                icon: Truck,
                color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-700" />
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[80px]" />

        <div className="container-site relative z-10 text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-6 drop-shadow-sm">
            Ready to make some noise?
          </h2>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-10 font-medium">
            Join millions of happy families and light up your next event with our spectacular fireworks collection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg text-orange-600 bg-white hover:bg-gray-50 shadow-xl shadow-red-900/20 hover:scale-105 transition-transform">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg text-white border-white/30 hover:bg-white/10 backdrop-blur-sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
