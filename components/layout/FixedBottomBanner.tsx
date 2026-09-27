export function FixedBottomBanner() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] bg-gradient-to-r from-[var(--color-primary)] via-orange-500 to-amber-500 py-2.5 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t border-[var(--color-primary-dark)]/50">
      <div className="container-site flex items-center justify-center gap-3 text-white">
        <span className="text-xl animate-bounce">📍</span>
        <p className="text-sm sm:text-base font-bold drop-shadow-md text-center">
          Delivery Notice: Collect your order from the nearest delivery hub.
        </p>
      </div>
    </div>
  );
}
