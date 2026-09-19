import React from "react";

const SAFETY_RULES = [
  {
    icon: "🚸",
    title: "Adult Supervision",
    description: "Always ensure children are supervised by adults while handling and lighting firecrackers.",
  },
  {
    icon: "👕",
    title: "Wear Cotton Clothes",
    description: "Avoid synthetic materials. Wear well-fitting cotton garments to minimize fire risks.",
  },
  {
    icon: "🪣",
    title: "Keep Water Ready",
    description: "Always keep a bucket of water or sand nearby for emergencies and safe disposal of used sparklers.",
  },
  {
    icon: "🏞️",
    title: "Open Spaces Only",
    description: "Light fireworks outdoors in clear, open areas away from buildings, vehicles, and dry grass.",
  },
  {
    icon: "🚫",
    title: "Never Hold & Light",
    description: "Never hold a firecracker in your hand while lighting. Always place it on the ground first.",
  },
  {
    icon: "👟",
    title: "Wear Footwear",
    description: "Always wear closed shoes to protect your feet from accidental sparks or hot ground.",
  },
];

export default function SafetyGuidelines() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 dark:bg-red-900/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/40 dark:bg-orange-900/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="container-site relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span>🛡️</span> Safety First
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Celebrate Safely
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            Your safety is our top priority. Please follow these essential guidelines to ensure a joyous and accident-free celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFETY_RULES.map((rule, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-red-500/5 dark:hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100/50 dark:border-red-900/30">
                {rule.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {rule.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
