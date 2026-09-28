import { SITE_NAME } from "@/constants";

export default async function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-auto border-t border-[var(--color-primary-dark)]/30">
      <div className="container-site py-6 flex flex-col items-center justify-center gap-2 relative z-10">
        <p className="text-sm font-medium text-gray-400 text-center tracking-wide">
          © 2026 {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
