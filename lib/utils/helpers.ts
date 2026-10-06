/**
 * Format a price number to Indian Rupee currency string.
 * Example: formatPrice(1499) → "₹1,499"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate the discount percentage between original and discounted price.
 * Example: getDiscountPercent(1000, 750) → 25
 */
export function getDiscountPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}

/**
 * Slugify a string.
 * Example: slugify("Ground Spinner 500") → "ground-spinner-500"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Parse the raw product images string into an array of valid URLs.
 * Safely handles missing data, plain URL strings, and JSON arrays.
 */
export function parseImages(raw: string | undefined | null): string[] {
  const fallback = ["/icons/logo.png"];
  if (!raw || typeof raw !== "string") return fallback;

  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      if (!Array.isArray(arr)) return fallback;

      const valid = arr.filter(
        (u): u is string =>
          typeof u === "string" &&
          u.trim().length > 0 &&
          (u.startsWith("/") || u.startsWith("http://") || u.startsWith("https://") || u.startsWith("blob:"))
      );
      return valid.length > 0 ? valid : fallback;
    } catch {
      return fallback;
    }
  }

  // Comma separated or single URL fallback
  const split = trimmed.split(",").map(u => u.trim()).filter(Boolean);
  return split.length > 0 ? split : fallback;
}
