"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { checkoutSchema } from "@/lib/validations/address";
import Link from "next/link";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { items, subtotal, clearCart } = useCart();
  const total = subtotal();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [siteConfig, setSiteConfig] = useState<Record<string, string>>({});
  const [configLoaded, setConfigLoaded] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string>("");

  // Delivery fee settings — pulled from admin SiteConfig after mount
  const [deliveryFeeAmount, setDeliveryFeeAmount] = useState(49);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(999);
  const [ordersClosed, setOrdersClosed] = useState(false);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const delivery = deliveryType === "PICKUP" ? 0 : (total >= freeDeliveryThreshold ? 0 : deliveryFeeAmount);


  useEffect(() => {
    fetch("/api/public/site-config")
      .then(res => res.json())
      .then((data: Record<string, string>) => {
        setSiteConfig(data);
        // Apply admin-configured delivery fee settings
        if (data.deliveryFee) setDeliveryFeeAmount(Number(data.deliveryFee) || 49);
        if (data.freeDeliveryThreshold) setFreeDeliveryThreshold(Number(data.freeDeliveryThreshold) || 999);
        if (data.minOrderValueForDelivery) setMinOrderValue(Number(data.minOrderValueForDelivery) || 0);
        // Check if orders are past cutoff date
        if (data.orderCutoffDate) {
          const cutoff = new Date(data.orderCutoffDate);
          if (new Date() > cutoff) setOrdersClosed(true);
        }
        setConfigLoaded(true);
      })
      .catch(() => setConfigLoaded(true));
      
    fetch("/api/public/pickup-locations")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPickupLocations(data);
          if (data.length > 0) setSelectedPickupLocation(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await fetch(`/api/coupons/validate?code=${coupon.trim().toUpperCase()}&total=${total}`);
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        setCouponApplied(true);
        toast.success("Coupon applied!", `You save ${formatPrice(data.discount)}`);
      } else {
        toast.error("Invalid coupon", data.message);
      }
    } catch {
      toast.error("Error", "Could not validate coupon");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const raw = {
      address: {
        name: fd.get("name") as string,
        phone: fd.get("phone") as string,
        street: fd.get("street") as string,
        city: fd.get("city") as string,
        state: fd.get("state") as string,
        pincode: fd.get("pincode") as string,
        country: "India",
        isDefault: false,
      },
      ageConsent: fd.get("ageConsent") === "on",
      termsAccepted: fd.get("termsAccepted") === "on",
      notes: (fd.get("notes") as string) || undefined,
      pickupLocationId: deliveryType === "PICKUP" ? selectedPickupLocation : undefined,
    };

    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success && deliveryType === "DELIVERY") {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.discountPrice ?? i.product.price,
          })),
          address: deliveryType === "DELIVERY" ? parsed.data?.address : undefined,
          pickupLocationId: deliveryType === "PICKUP" ? selectedPickupLocation : undefined,
          deliveryType,
          ageConsent: parsed.data?.ageConsent || raw.ageConsent,
          termsAccepted: parsed.data?.termsAccepted || raw.termsAccepted,
          notes: parsed.data?.notes || raw.notes,
          couponCode: couponApplied ? coupon.toUpperCase() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error("Order failed", data.message);
        setLoading(false);
        return;
      }

      clearCart();
      toast.success("Order placed!", "Your order has been placed successfully");
      router.push(`/orders/${data.orderId}/confirmation`);
    } catch {
      toast.error("Error", "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center container-site">
        <span className="text-5xl block mb-4">🛒</span>
        <h1 className="font-display text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link href="/products"><Button variant="primary">Browse Products</Button></Link>
      </div>
    );
  }

  if (ordersClosed) {
    return (
      <div className="py-20 text-center container-site">
        <span className="text-5xl block mb-4">🚫</span>
        <h1 className="font-display text-2xl font-bold mb-3 text-red-600">Orders are Closed</h1>
        <p className="text-[var(--color-text-muted)] mb-6">We are not accepting new orders at this time. Please check back later.</p>
        <Link href="/products"><Button variant="primary">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-site">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Address + Consent */}
            <div className="lg:col-span-2 space-y-6">

              {/* Delivery Type Selection */}
              {siteConfig.selfPickupEnabled === "true" && (
                <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                  <h2 className="font-display text-lg font-bold mb-4">📦 Order Method</h2>
                  <div className="flex gap-4">
                    <label className={`flex-1 border p-4 rounded-xl cursor-pointer transition-colors ${deliveryType === "DELIVERY" ? "border-red-600 bg-red-50 text-red-900" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                      <input type="radio" name="deliveryType" value="DELIVERY" checked={deliveryType === "DELIVERY"} onChange={() => setDeliveryType("DELIVERY")} className="sr-only" />
                      <div className="font-bold text-center">Home Delivery</div>
                    </label>
                    <label className={`flex-1 border p-4 rounded-xl cursor-pointer transition-colors ${deliveryType === "PICKUP" ? "border-red-600 bg-red-50 text-red-900" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
                      <input type="radio" name="deliveryType" value="PICKUP" checked={deliveryType === "PICKUP"} onChange={() => setDeliveryType("PICKUP")} className="sr-only" />
                      <div className="font-bold text-center">Self Pickup</div>
                    </label>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {deliveryType === "DELIVERY" && (
              <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h2 className="font-display text-lg font-bold mb-4">📍 Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" label="Full Name" defaultValue={user?.name ?? ""} error={errors["address.name"]} required />
                  <Input name="phone" label="Mobile" placeholder="9876543210" error={errors["address.phone"]} required leftAddon={<span className="text-xs">+91</span>} />
                  <div className="sm:col-span-2">
                    <Input name="street" label="Street Address" placeholder="House/Flat no., Street, Area" error={errors["address.street"]} required />
                  </div>
                  <Input name="city" label="City" error={errors["address.city"]} required />
                  <Select
                    name="state"
                    label="State"
                    placeholder="Select State"
                    options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                    error={errors["address.state"]}
                    required
                  />
                  <Input name="pincode" label="Pincode" placeholder="6-digit pincode" error={errors["address.pincode"]} required />
                </div>
              </div>
              )}
              
              {/* Pickup Location */}
              {deliveryType === "PICKUP" && pickupLocations.length > 0 && (
                <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                  <h2 className="font-display text-lg font-bold mb-4">📍 Select Pickup Location</h2>
                  <div className="space-y-4">
                    {pickupLocations.map(loc => (
                      <label key={loc.id} className={`block border p-4 rounded-xl cursor-pointer transition-colors ${selectedPickupLocation === loc.id ? "border-red-600 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
                        <div className="flex items-start gap-3">
                          <input type="radio" name="pickupLocationId" value={loc.id} checked={selectedPickupLocation === loc.id} onChange={() => setSelectedPickupLocation(loc.id)} className="mt-1 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                          <div>
                            <div className="font-bold text-[var(--color-text)]">{loc.name}</div>
                            <div className="text-sm text-[var(--color-text-muted)] mt-1">{loc.address}, {loc.city}, {loc.state} {loc.pincode}</div>
                            {loc.phone && <div className="text-sm text-[var(--color-text-muted)] mt-1">📞 {loc.phone}</div>}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h2 className="font-display text-lg font-bold mb-4">📝 Order Notes (optional)</h2>
                <textarea
                  name="notes"
                  placeholder="Any special instructions for delivery..."
                  className="w-full h-24 px-3 py-2 rounded-[var(--radius-md)] text-sm bg-white border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
              </div>

              {/* Consent */}
              <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-4">
                <h2 className="font-display text-lg font-bold mb-2">✅ Confirmations</h2>
                <Checkbox
                  name="ageConsent"
                  label={<span>I confirm that I am <strong>18 years or older</strong>, or this order is placed under direct adult supervision.</span>}
                  error={errors.ageConsent}
                  required
                />
                <Checkbox
                  name="termsAccepted"
                  label={<span>I accept the <Link href="/about" className="text-[var(--color-primary)] underline">Terms of Service</Link> and <Link href="/about" className="text-[var(--color-primary)] underline">Safety Disclaimer</Link>.</span>}
                  error={errors.termsAccepted}
                  required
                />
              </div>
            </div>

            {/* Right — Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)] truncate flex-1 mr-2">
                        {item.product.name} ×{item.quantity}
                      </span>
                      <span className="font-medium shrink-0">
                        {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-[var(--color-border)] my-3" />

                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    disabled={couponApplied}
                    className="flex-1 h-9 px-3 rounded-[var(--radius-md)] text-xs bg-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                  >
                    {couponApplied ? "Applied ✓" : "Apply"}
                  </Button>
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Delivery</span>
                    <span className={delivery === 0 ? "text-green-600" : ""}>
                      {deliveryType === "PICKUP"
                        ? "Free (Self Pickup)"
                        : delivery === 0
                        ? `Free (above ${formatPrice(freeDeliveryThreshold)})`
                        : formatPrice(delivery)}
                    </span>
                  </div>
                  <hr className="border-[var(--color-border)]" />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total (COD)</span>
                    <span className="text-[var(--color-primary)]">
                      {formatPrice(total - discount + delivery)}
                    </span>
                  </div>
                </div>

                {/* Min order value warning */}
                {deliveryType === "DELIVERY" && minOrderValue > 0 && total < minOrderValue && (
                  <div className="mt-2 p-2.5 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-[10px] text-red-700 text-center font-medium">
                    ⚠️ Minimum order for delivery is {formatPrice(minOrderValue)}
                  </div>
                )}

                {/* Free delivery progress */}
                {deliveryType === "DELIVERY" && delivery > 0 && freeDeliveryThreshold > 0 && (
                  <div className="mt-1.5 text-[10px] text-[var(--color-text-muted)] text-center">
                    Add {formatPrice(freeDeliveryThreshold - total)} more for free delivery!
                  </div>
                )}

                <div className="mt-4 p-2.5 rounded-[var(--radius-md)] bg-amber-50 border border-amber-200 text-[10px] text-amber-800 text-center">
                  💰 Cash on Delivery — Pay when your order arrives
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  variant="accent"
                  size="lg"
                  className="w-full mt-4"
                >
                  Place Order (COD)
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
