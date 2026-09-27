import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, CONTACT_INFO, SOCIAL_LINKS, SITE_NAME } from "@/constants";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  const configs = await prisma.siteConfig.findMany({
    where: { key: { in: ["licenseNumber", "disclaimerText"] } }
  });
  const configMap = configs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#1A0505] to-[#050101] text-gray-300 mt-auto border-t border-[var(--color-primary-dark)]/30">
      {/* Decorative Night Sky / Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-accent)]/5 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-white/40 blur-[2px] animate-sparkle" />
      <div className="absolute bottom-[30%] left-[30%] w-3 h-3 rounded-full bg-[var(--color-accent)]/40 blur-[2px] animate-sparkle" style={{ animationDelay: '1s' }} />

      {/* ── Main Footer ─────────────────────────────────────────── */}
      <div className="container-site py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 group-hover:animate-sparkle">
                <Image src="/icons/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Premium quality firecrackers &amp; sparklers for every celebration.
              Directly sourced from Sivakasi with guaranteed safety standards.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 overflow-hidden"
                aria-label="Facebook"
              >
                <Image src="/icons/facebook.jpg" alt="Facebook" width={30} height={30} className="w-full h-full object-cover" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 overflow-hidden"
                aria-label="Instagram"
              >
                <Image src="/icons/instagram.jpg" alt="Instagram" width={36} height={36} className="w-full h-full object-cover" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-200 overflow-hidden"
                aria-label="WhatsApp"
              >
                <Image src="/icons/whatsapp.jpg" alt="WhatsApp" width={36} height={36} className="w-full h-full object-cover" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-200 overflow-hidden"
                aria-label="YouTube"
              >
                <Image src="/icons/youtube.png" alt="YouTube" width={36} height={36} className="w-full h-full object-cover" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 inline-block border-b-2 border-[var(--color-primary)] pb-1">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-gray-400 hover:text-[var(--color-accent)] transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 inline-block border-b-2 border-[var(--color-primary)] pb-1">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                "Sparklers",
                "Rockets",
                "Fountains",
                "Ground Spinners",
                "Aerial Shells",
                "Combo Packs",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-gray-400 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 inline-block border-b-2 border-[var(--color-primary)] pb-1">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm">
                <span className="shrink-0 mt-0.5">📍</span>
                <span className="text-gray-400">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <span className="shrink-0">📞</span>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="text-gray-400 hover:text-[var(--color-accent)] transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <span className="shrink-0">✉️</span>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-400 hover:text-[var(--color-accent)] transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <span className="shrink-0">🕐</span>
                <span className="text-gray-400">{CONTACT_INFO.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* ── Bottom Bar ──────────────────────────────────────────── */}
      <div className="border-t border-white/5 bg-black/40 relative z-10">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {currentYear} {SITE_NAME}. All rights reserved. <br className="sm:hidden" />
            {configMap.licenseNumber ? `Licensed under applicable PESO guidelines (License No: ${configMap.licenseNumber}).` : `Licensed under applicable PESO guidelines.`}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              Terms of Use
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
