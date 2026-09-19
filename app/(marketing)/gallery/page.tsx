"use client";

import { useState } from "react";
import { Camera, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder images from Unsplash
const GALLERY_ITEMS = [
  { id: 1, category: "Diwali", src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop", title: "Festival of Lights", alt: "Diwali celebration lights" },
  { id: 2, category: "Weddings", src: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?q=80&w=800&auto=format&fit=crop", title: "Grand Reception", alt: "Wedding fireworks display" },
  { id: 3, category: "Aerial", src: "https://images.unsplash.com/photo-1533202958742-1e9bfdb5013b?q=80&w=800&auto=format&fit=crop", title: "Sky Full of Stars", alt: "Aerial fireworks burst" },
  { id: 4, category: "Diwali", src: "https://images.unsplash.com/photo-1509439600980-8b1b22e70e28?q=80&w=800&auto=format&fit=crop", title: "Family Sparklers", alt: "Children playing with sparklers" },
  { id: 5, category: "Events", src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop", title: "New Year Bash", alt: "Crowd watching fireworks" },
  { id: 6, category: "Aerial", src: "https://images.unsplash.com/photo-1516222338250-863216ce01ea?q=80&w=800&auto=format&fit=crop", title: "Golden Rain", alt: "Golden trailing fireworks" },
  { id: 7, category: "Events", src: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=800&auto=format&fit=crop", title: "Stadium Show", alt: "Concert fireworks" },
  { id: 8, category: "Weddings", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop", title: "Bridal Entry", alt: "Cold pyro wedding entry" },
  { id: 9, category: "Diwali", src: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop", title: "Diyas & Crackers", alt: "Traditional diya with sparkler" },
];

const CATEGORIES = ["All", "Diwali", "Weddings", "Aerial", "Events"];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeTab === "All" || item.category === activeTab
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden pt-24 pb-16">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 text-center">
        {/* Glows */}
        <div className="absolute top-0 right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 left-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container-site relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-sm mb-6 border border-orange-200 dark:border-orange-500/20 animate-fade-in">
            <Camera className="w-4 h-4" />
            <span>Moments of Joy</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Our Spectacular <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Gallery</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Browse through some of our most breathtaking displays. From intimate family gatherings to grand wedding events, see how we light up the night.
          </p>
        </div>
      </section>

      {/* ── Filter Tabs ──────────────────────────────────────────────────────── */}
      <section className="container-site mb-12 relative z-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                activeTab === cat
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Image Grid ──────────────────────────────────────────────────────── */}
      <section className="container-site relative z-10">
        {filteredItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-2">
                    <Star className="w-3 h-3 fill-white" />
                    {item.category}
                  </div>
                  <h3 className="text-xl font-black text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No photos found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try selecting a different category.</p>
          </div>
        )}
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="container-site mt-24">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Sparkles className="w-10 h-10 text-orange-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Want to feature your celebration?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Share your spectacular moments with our fireworks and get a chance to be featured in our official gallery! Tag us on social media or send us an email.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-lg shadow-white/10"
            >
              Share Your Photos
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
