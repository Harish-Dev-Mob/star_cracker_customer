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
  const delivery = 0; // Delivery is free


  const [addressData, setAddressData] = useState<any>(null);
  const [addressLoaded, setAddressLoaded] = useState(false);

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

    fetch("/api/user/address")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.address) {
          setAddressData(data.address);
        }
        setAddressLoaded(true);
      })
      .catch(() => setAddressLoaded(true));
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (total < 2000) {
      toast.error("Minimum Order", "Order value must be at least ₹2,000 to checkout.");
      setLoading(false);
      return;
    }

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
          notes: parsed.data?.notes || raw.notes,
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
        <Link href="/"><Button variant="primary">Browse Products</Button></Link>
      </div>
    );
  }

  if (ordersClosed) {
    return (
      <div className="py-20 text-center container-site">
        <span className="text-5xl block mb-4">🚫</span>
        <h1 className="font-display text-2xl font-bold mb-3 text-red-600">Orders are Closed</h1>
        <p className="text-[var(--color-text-muted)] mb-6">We are not accepting new orders at this time. Please check back later.</p>
        <Link href="/"><Button variant="primary">Continue Shopping</Button></Link>
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

              {/* Delivery Address */}
              <div key={addressLoaded ? "loaded" : "loading"} className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h2 className="font-display text-lg font-bold mb-4">📍 Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" label="Full Name" defaultValue={addressData?.name ?? user?.name ?? ""} error={errors["address.name"]} required />
                  <Input name="phone" label="Mobile" placeholder="9876543210" defaultValue={addressData?.phone ?? (user as any)?.phone ?? ""} error={errors["address.phone"]} required leftAddon={<span className="text-xs">+91</span>} />
                  <div className="sm:col-span-2">
                    <Input name="street" label="Street Address" placeholder="House/Flat no., Street, Area" defaultValue={addressData?.street ?? ""} error={errors["address.street"]} required />
                  </div>
                  <Input name="city" label="City" defaultValue={addressData?.city ?? ""} error={errors["address.city"]} required />
                  <Select
                    name="state"
                    label="State"
                    placeholder="Select State"
                    defaultValue={addressData?.state ?? ""}
                    options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                    error={errors["address.state"]}
                    required
                  />
                  <Input name="pincode" label="Pincode" placeholder="6-digit pincode" defaultValue={addressData?.pincode ?? ""} error={errors["address.pincode"]} required />
                </div>
              </div>

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
                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold">
                    <span>Total (COD)</span>
                    <span className="text-[var(--color-primary)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>



                {/* Min order value warning */}
                {total < 2000 && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 shadow-sm animate-pop-in">
                    <div className="flex gap-3 items-start">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <p className="text-sm font-bold text-red-800">Minimum Order Required</p>
                        <p className="text-xs mt-1 text-red-600/90 font-medium">
                          Your order must be at least {formatPrice(2000)} to checkout. Please add {formatPrice(2000 - total)} more.
                        </p>
                      </div>
                    </div>
                  </div>
                )}




                <div className="mt-4 p-2.5 rounded-[var(--radius-md)] bg-amber-50 border border-amber-200 text-[10px] text-amber-800 text-center">
                  💰 Cash on Delivery — Pay when your order arrives
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={total < 2000}
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
