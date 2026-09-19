import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(n);
}

interface Props {
  params: Promise<{ id: string }>;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_STEPS = [
  { id: "PLACED",    label: "Order Placed",    icon: "📝", desc: "We've received your order" },
  { id: "CONFIRMED", label: "Confirmed",        icon: "✅", desc: "Order verified & accepted" },
  { id: "PACKED",    label: "Packed",           icon: "📦", desc: "Items packed & ready" },
  { id: "SHIPPED",   label: "Out for Delivery", icon: "🚚", desc: "On the way to you" },
  { id: "DELIVERED", label: "Delivered",        icon: "🎉", desc: "Enjoy your fireworks!" },
];

const STATUS_HERO: Record<
  string,
  { gradient: string; text: string; lightText: string; tag: string; tagText: string }
> = {
  PLACED:    { gradient: "from-slate-800 via-slate-900 to-black",    text: "text-white",        lightText: "text-slate-400",  tag: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",      tagText: "Order Placed" },
  CONFIRMED: { gradient: "from-blue-700 via-indigo-800 to-slate-900",    text: "text-white",        lightText: "text-blue-200",   tag: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",      tagText: "Confirmed" },
  PACKED:    { gradient: "from-violet-700 via-purple-800 to-slate-900",  text: "text-white",        lightText: "text-violet-200", tag: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",      tagText: "Packed" },
  SHIPPED:   { gradient: "from-purple-800 via-fuchsia-900 to-slate-900", text: "text-white",        lightText: "text-purple-200", tag: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",      tagText: "Out for Delivery" },
  DELIVERED: { gradient: "from-emerald-700 via-green-800 to-slate-900",  text: "text-white",        lightText: "text-emerald-200",tag: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",      tagText: "Delivered 🎉" },
  CANCELLED: { gradient: "from-red-700 via-rose-800 to-slate-900",       text: "text-white",        lightText: "text-red-200",    tag: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",      tagText: "Cancelled" },
};

function getProductImg(images: string): string {
  try { return (JSON.parse(images) as string[])[0] || "/images/products/placeholder.jpg"; }
  catch { return "/images/products/placeholder.jpg"; }
}

// ─── Status Stepper ───────────────────────────────────────────────────────────

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const isCancelled = currentStatus === "CANCELLED";
  const currentIdx = STATUS_STEPS.findIndex((s) => s.id === currentStatus);

  if (isCancelled) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-red-50 border border-red-200">
        <div className="w-14 h-14 rounded-2xl bg-red-100 border-2 border-red-300 flex items-center justify-center text-3xl shrink-0">
          ❌
        </div>
        <div>
          <p className="font-black text-red-700 text-lg leading-tight">Order Cancelled</p>
          <p className="text-sm text-red-500 mt-1">
            This order has been cancelled and will not be fulfilled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-x-auto pb-4 pt-2 px-2">
      <div className="min-w-[520px] relative">
        {/* Track Background */}
        <div className="absolute top-7 left-[10%] right-[10%] h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full" />
        
        {/* Active Track */}
        <div 
          className="absolute top-7 left-[10%] h-1.5 bg-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
          style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%`, maxWidth: '80%' }}
        />

        {/* Nodes */}
        <div className="relative z-10 flex justify-between w-full">
          {STATUS_STEPS.map((step, i) => {
            const isComplete = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div key={step.id} className="flex flex-col items-center w-1/5">
                <div
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border-2 transition-all duration-500 ${
                    isComplete
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      : isCurrent
                      ? "bg-white border-[var(--color-primary)] text-[var(--color-primary)] shadow-[0_0_25px_rgba(220,38,38,0.3)] scale-110"
                      : "bg-white/80 border-gray-200 text-gray-300"
                  }`}
                >
                  {isComplete ? (
                    <svg className="w-6 h-6 animate-pop-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={isCurrent ? "animate-pulse-glow" : ""}>{step.icon}</span>
                  )}
                  {isCurrent && (
                    <>
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-primary)] rounded-full border-2 border-white z-20" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-primary)] rounded-full animate-ping z-10 opacity-75" />
                    </>
                  )}
                </div>
                <div className="text-center mt-4">
                  <p className={`text-xs font-black tracking-wide leading-tight transition-colors duration-300 ${
                    isComplete || isCurrent ? "text-gray-900 dark:text-white" : "text-gray-400"
                  }`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-[var(--color-primary)] font-bold mt-1 uppercase tracking-widest animate-pulse">
                      ● Active
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrderDetailsPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: { include: { product: true } },
      address: true,
    },
  });

  if (!order) notFound();
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") notFound();

  const hero = STATUS_HERO[order.status] ?? STATUS_HERO.PLACED;
  const deliveryFee = order.total + order.discount - order.subtotal;
  const stepIdx = STATUS_STEPS.findIndex((s) => s.id === order.status);
  const currentStep = STATUS_STEPS[stepIdx];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-16">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-br ${hero.gradient} relative overflow-hidden animate-fade-in`}>
        {/* Decorative orb */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-primary)]/20 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="container-site max-w-4xl relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-24">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-medium text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-white transition-colors">Orders</Link>
            <span>/</span>
            <span className="text-white font-bold">Details</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div>
              {/* Status tag */}
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${hero.tag} mb-5 hover:scale-105 transition-transform cursor-default`}>
                {order.status !== "CANCELLED" && <span className="text-sm">{currentStep?.icon}</span>} 
                <span>{hero.tagText}</span>
              </span>
              <h1 className={`font-display text-4xl sm:text-5xl font-black ${hero.text} mb-3 tracking-tight drop-shadow-sm`}>
                Order Details
              </h1>
              <p className={`font-mono text-sm font-bold ${hero.lightText} mb-2 flex items-center gap-2`}>
                <span className="opacity-60">ID:</span> #{order.id}
              </p>
              <p className={`text-sm ${hero.lightText} font-medium`}>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0 bg-black/20 p-5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-xl">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Total Amount</p>
              <p className={`text-4xl font-black ${hero.text} drop-shadow-md`}>{fmt(order.total)}</p>
              <p className={`text-sm ${hero.lightText} mt-2 font-medium`}>
                {order.orderItems.reduce((s, i: any) => s + i.quantity, 0)} items · <span className="text-amber-300 font-bold">COD</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="container-site max-w-4xl -mt-6 relative z-10">

        {/* ── Status Tracker Card ──────────────────────────────────────────── */}
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 mb-8 animate-slide-up"
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-base font-black text-gray-900 tracking-wide uppercase">Order Progress</span>
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <span className="text-[10px] text-[var(--color-primary)] font-black uppercase tracking-widest bg-red-50 border border-red-100 px-2.5 py-1 rounded-full animate-pulse">
                Live
              </span>
            )}
          </div>
          <StatusStepper currentStatus={order.status} />

          {/* Current status description */}
          {order.status !== "CANCELLED" && currentStep && (
            <div className="mt-8 flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
              <span className="text-3xl animate-bounce">{currentStep.icon}</span>
              <div>
                <p className="text-base font-black text-gray-900">{currentStep.desc}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  Last updated:{" "}
                  {new Date(order.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  } as Intl.DateTimeFormatOptions)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Two Column Layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Items */}
            <div 
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-slide-up"
              style={{ animationDelay: '300ms', animationFillMode: 'both' }}
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm font-black text-gray-900 tracking-wide uppercase">🛒 Items Ordered</span>
                <span className="text-xs text-gray-500 font-bold bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                  {order.orderItems.length} Product{order.orderItems.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {order.orderItems.map((item: any) => {
                  const img = getProductImg(item.product.images);
                  return (
                    <div key={item.id} className="p-6 flex gap-5 hover:bg-gray-50/80 transition-all duration-300 group">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300"
                      >
                        <Image src={img} alt={item.product.name} fill className="object-cover" />
                      </Link>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-black text-lg text-gray-900 hover:text-[var(--color-primary)] transition-colors truncate"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-bold text-gray-500">
                            {fmt(item.priceAtOrder)}
                          </span>
                          <span className="text-gray-300 text-sm">×</span>
                          <span className="text-xs font-black text-[var(--color-primary)] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-lg">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col justify-center text-right">
                        <span className="font-black text-gray-900 text-xl">
                          {fmt(item.priceAtOrder * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div 
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 animate-slide-up"
                style={{ animationDelay: '350ms', animationFillMode: 'both' }}
              >
                <p className="text-sm font-black text-gray-900 mb-4 tracking-wide uppercase">📝 Order Notes</p>
                <p className="text-sm text-amber-900 leading-relaxed bg-gradient-to-r from-amber-50 to-yellow-50/50 border border-amber-200/60 rounded-2xl p-5 shadow-inner">
                  &ldquo;{order.notes}&rdquo;
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div 
              className="flex flex-col sm:flex-row gap-4 animate-slide-up"
              style={{ animationDelay: '400ms', animationFillMode: 'both' }}
            >
              <Link
                href="/products"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-100 text-gray-900 text-sm font-black rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-sm"
              >
                🎆 Continue Shopping
              </Link>
              <Link
                href="/orders"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-black rounded-2xl hover:shadow-lg hover:shadow-black/20 transition-all hover:-translate-y-1"
              >
                📋 All Orders
              </Link>
            </div>
          </div>

          {/* Right — Summary + Address */}
          <div className="space-y-6">

            {/* Payment Summary */}
            <div 
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-slide-up relative"
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <span className="text-sm font-black text-gray-900 tracking-wide uppercase">💳 Payment Summary</span>
              </div>
              <div className="p-6 space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">{fmt(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold flex items-center gap-2">
                      🎟️ {order.couponCode ? order.couponCode : "Discount"}
                    </span>
                    <span className="font-black">−{fmt(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Delivery</span>
                  <span className={`font-bold ${deliveryFee === 0 ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md" : "text-gray-900"}`}>
                    {deliveryFee === 0 ? "Free 🎉" : fmt(deliveryFee)}
                  </span>
                </div>
                
                {/* Dashed divider */}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-gray-200"></div>
                  </div>
                  <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--color-bg)] rounded-full border-r border-gray-100 shadow-inner"></div>
                  <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--color-bg)] rounded-full border-l border-gray-100 shadow-inner"></div>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <span className="font-black text-gray-900 text-lg">Total</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Incl. of all taxes</p>
                  </div>
                  <span className="font-black text-3xl text-[var(--color-primary)] tracking-tight">
                    {fmt(order.total)}
                  </span>
                </div>
                
                <div className="mt-6 flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl shrink-0">💰</div>
                  <div>
                    <p className="text-sm font-black text-amber-900">Cash on Delivery</p>
                    <p className="text-xs text-amber-700/80 font-medium mt-0.5">Pay safely when you receive</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div 
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-slide-up"
              style={{ animationDelay: '600ms', animationFillMode: 'both' }}
            >
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <span className="text-sm font-black text-gray-900 tracking-wide uppercase">📍 Delivery Address</span>
              </div>
              <div className="p-6">
                {order.address ? (
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-black text-lg text-gray-900">{order.address.name}</p>
                    <p className="text-gray-500 leading-relaxed">{order.address.street}</p>
                    <p className="text-gray-500">
                      {order.address.city}, {order.address.state} — <span className="font-bold text-gray-900">{order.address.pincode}</span>
                    </p>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm border border-gray-100">📞</div>
                      <span className="font-black text-gray-900 tracking-wide">{order.address.phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No address on file.</p>
                )}
              </div>
            </div>

            {/* Order Meta */}
            <div 
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 animate-slide-up"
              style={{ animationDelay: '700ms', animationFillMode: 'both' }}
            >
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">
                Order Info
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500 font-medium shrink-0">Order ID</span>
                  <span className="font-mono font-black text-gray-900 text-right bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    {order.id.slice(-12)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Placed</span>
                  <span className="font-bold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
