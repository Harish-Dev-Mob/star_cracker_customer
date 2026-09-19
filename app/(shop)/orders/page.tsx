import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(n);
}

function getProductImg(images: string): string {
  try { return (JSON.parse(images) as string[])[0] || "/images/products/placeholder.jpg"; }
  catch { return "/images/products/placeholder.jpg"; }
}

/* ─── Status config ────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
    step: number;
    barColor: string;
  }
> = {
  PLACED:    { label: "Placed",       icon: "📝", bg: "bg-slate-50",    text: "text-slate-700",   border: "border-slate-200",  dot: "bg-slate-400",   step: 0, barColor: "bg-slate-400" },
  CONFIRMED: { label: "Confirmed",    icon: "✅", bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200",   dot: "bg-blue-500",    step: 1, barColor: "bg-blue-500" },
  PACKED:    { label: "Packed",       icon: "📦", bg: "bg-violet-50",   text: "text-violet-700",  border: "border-violet-200", dot: "bg-violet-500",  step: 2, barColor: "bg-violet-500" },
  SHIPPED:   { label: "Shipped",      icon: "🚚", bg: "bg-purple-50",   text: "text-purple-700",  border: "border-purple-200", dot: "bg-purple-500",  step: 3, barColor: "bg-purple-500" },
  DELIVERED: { label: "Delivered",    icon: "🎉", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200",dot: "bg-emerald-500", step: 4, barColor: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled",    icon: "❌", bg: "bg-red-50",      text: "text-red-600",     border: "border-red-200",    dot: "bg-red-500",     step: -1, barColor: "bg-red-500" },
};

const PIPELINE_STEPS = [
  { id: "PLACED",    label: "Placed",    icon: "📝" },
  { id: "CONFIRMED", label: "Confirmed", icon: "✅" },
  { id: "PACKED",    label: "Packed",    icon: "📦" },
  { id: "SHIPPED",   label: "Shipped",   icon: "🚚" },
  { id: "DELIVERED", label: "Delivered", icon: "🎉" },
];

/* ─── Compact Status Stepper ────────────────────────────────────────────────── */

function ListStatusStepper({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/40 shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-black text-red-600 uppercase tracking-widest">Order Cancelled</p>
          <p className="text-[10px] text-red-400 font-medium mt-0.5">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_CONFIG[status]?.step ?? 0;
  const STEP_COLORS = [
    { from: "#6366f1", to: "#8b5cf6" },  // PLACED
    { from: "#3b82f6", to: "#06b6d4" },  // CONFIRMED
    { from: "#8b5cf6", to: "#a855f7" },  // PACKED
    { from: "#f59e0b", to: "#f97316" },  // SHIPPED
    { from: "#10b981", to: "#059669" },  // DELIVERED
  ];

  return (
    <div className="w-full pt-3 pb-1 select-none">

      {/* ── Row 1: Nodes + inline flex connectors ───────────────────────
          Connectors are flex-1 siblings of the nodes — they stretch to
          fill the gap. Height/badge changes in the label row (below)
          cannot affect this row's alignment at all.
      ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-center w-full">
        {PIPELINE_STEPS.map((step, i) => {
          const isComplete = i < currentIdx;
          const isCurrent  = i === currentIdx;
          const col        = STEP_COLORS[i];
          const nextCol    = STEP_COLORS[i + 1];
          const isLast     = i === PIPELINE_STEPS.length - 1;

          return (
            <div
              key={step.id}
              className="flex items-center"
              style={{ flex: isLast ? "0 0 auto" : "1 1 0%" }}
            >
              {/* Node */}
              <div className="flex-shrink-0">
                {isComplete ? (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${col.from}, ${col.to})`,
                      boxShadow: `0 4px 12px 0 ${col.to}55`,
                    }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="relative">
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ background: col.from }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-full flex items-center justify-center border-[3px] bg-white text-base shadow-md"
                      style={{
                        borderColor: col.from,
                        boxShadow: `0 0 0 4px ${col.from}22, 0 4px 14px 0 ${col.from}44`,
                      }}
                    >
                      {step.icon}
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border-2 border-gray-200 text-base grayscale opacity-40">
                    {step.icon}
                  </div>
                )}
              </div>

              {/* Inline connector — only between steps, not after the last */}
              {!isLast && (
                <div
                  className="flex-1 h-[3px] rounded-full mx-1.5 transition-all duration-500"
                  style={{
                    background: isComplete
                      ? `linear-gradient(90deg, ${col.to}, ${nextCol.from})`
                      : "#e5e7eb",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Labels — completely independent from the node row ── */}
      <div className="flex w-full mt-2.5">
        {PIPELINE_STEPS.map((step, i) => {
          const isComplete = i < currentIdx;
          const isCurrent  = i === currentIdx;
          const col        = STEP_COLORS[i];
          const isLast     = i === PIPELINE_STEPS.length - 1;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center text-center"
              style={{ flex: isLast ? "0 0 auto" : "1 1 0%" }}
            >
              <p className={`text-[9px] font-black tracking-widest uppercase ${
                isComplete ? "text-gray-700" : isCurrent ? "text-gray-900" : "text-gray-400"
              }`}>
                {step.label}
              </p>
              {isCurrent && (
                <span
                  className="inline-block mt-0.5 px-1.5 py-px text-[8px] font-black uppercase tracking-widest rounded-full text-white animate-pulse"
                  style={{ background: `linear-gradient(90deg, ${col.from}, ${col.to})` }}
                >
                  Live
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: { select: { name: true, images: true, slug: true, category: { select: { name: true } } } } },
      },
    },
  });

  const totalSpend = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Rich Header Banner ─────────────────────────────────────────────── */}
      <div className="relative pt-8 pb-12 lg:pt-10 lg:pb-16 overflow-hidden bg-gray-900 border-b border-white/10 shadow-xl">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--color-primary)]/30 to-purple-600/10 rounded-full blur-[100px] mix-blend-screen transform translate-x-1/4 -translate-y-1/4 animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/20 to-rose-500/10 rounded-full blur-[80px] mix-blend-screen transform -translate-x-1/4 translate-y-1/4" />
          {/* Subtle noise/grid overlay */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
        </div>

        <div className="container-site max-w-4xl relative z-10 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_6px_var(--color-primary)]" />
                Your Account
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md leading-tight">
                Order History
              </h1>
              <p className="text-gray-300/80 text-sm sm:text-base font-medium max-w-md leading-relaxed">
                Track your fireworks, view order details, and get ready for a spectacular celebration.
              </p>
            </div>
            
            {/* Quick Stats Cards */}
            {orders.length > 0 && (
              <div className="flex flex-row gap-3 shrink-0 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <div className="flex flex-col justify-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg min-w-[120px] shadow-md shadow-black/20">
                   <span className="text-2xl font-black text-white">{orders.length}</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Total Orders</span>
                </div>
                <div className="flex flex-col justify-center px-4 py-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 border border-[var(--color-primary)]/30 backdrop-blur-lg min-w-[120px] shadow-md shadow-black/20">
                   <span className="text-2xl font-black text-white">{fmt(totalSpend)}</span>
                   <span className="text-[10px] font-bold text-[var(--color-primary-light)] uppercase tracking-widest mt-0.5">Total Value</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <div className="container-site max-w-4xl px-4 sm:px-6 py-10 relative z-20">

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {orders.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white p-8 sm:p-12 text-center shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-amber-400 rounded-full blur-xl opacity-20 animate-pulse-glow" />
              <div className="relative w-full h-full bg-white rounded-full border-4 border-gray-50 flex items-center justify-center text-5xl shadow-lg shadow-[var(--color-primary)]/10">
                🛒
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Your cart is feeling light</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Looks like you haven&apos;t placed any orders yet. Discover our premium fireworks collection!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 text-sm w-full sm:w-auto"
            >
              Start Shopping
              <span className="text-lg">✨</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            {orders.map((order, orderIdx) => {
              const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PLACED;
              const totalItems = order.orderItems.reduce((s, i: any) => s + i.quantity, 0);
              const previewItems = order.orderItems.slice(0, 4);
              const isDelivered = order.status === "DELIVERED";
              const isCancelled = order.status === "CANCELLED";

              return (
                <div
                  key={order.id}
                  className="group relative bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${orderIdx * 40}ms` }}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500 ${sc.barColor}`} />

                  <div className="py-10 px-5 sm:px-8 lg:px-10 pl-7 sm:pl-9 lg:pl-11 flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Left Column: Order Meta & Progress */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${sc.bg} ${sc.text} ${sc.border} shadow-sm`}>
                            {sc.icon} {sc.label}
                          </span>
                          {order.couponCode && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                              🎟️ {order.couponCode}
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-5">
                           <h3 className="font-mono text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Order #{order.id.slice(-8)}</h3>
                           <p className="text-gray-900 font-medium text-xs flex items-center gap-1.5">
                             <span className="w-3.5 h-3.5 flex items-center justify-center bg-gray-100 rounded text-[9px]">🗓️</span>
                             {new Date(order.createdAt).toLocaleDateString("en-IN", {
                               day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                             })}
                           </p>
                        </div>
                        {/* Pipeline Tracker */}
                        <div className="mt-auto pt-4 border-t border-gray-50 w-full overflow-hidden">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Order Status</p>
                           <ListStatusStepper status={order.status} />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Products & Total */}
                    <div className="w-full lg:w-[42%] flex flex-col justify-between bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Summary</p>
                           <p className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">{totalItems} Items</p>
                        </div>
                        
                        {/* Products List Preview */}
                        <div className="space-y-2.5 mb-5">
                           {previewItems.map((item: any) => (
                             <div key={item.id} className="flex items-center gap-2.5">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 shadow-sm">
                                   <Image src={getProductImg(item.product.images)} alt="" fill className="object-cover" unoptimized />
                                </div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                                   <p className="text-[10px] text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-xs font-bold text-gray-900 shrink-0">{fmt(item.priceAtOrder * item.quantity)}</p>
                             </div>
                           ))}
                           {order.orderItems.length > 4 && (
                             <p className="text-[10px] text-center font-bold text-gray-400 py-1">
                               + {order.orderItems.length - 4} more items
                             </p>
                           )}
                        </div>
                      </div>

                      {/* Total & Action */}
                      <div className="mt-auto pt-4 border-t border-gray-200/60 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                          <p className="text-2xl font-black text-[var(--color-primary)] tracking-tight leading-none">
                            {fmt(order.total)}
                          </p>
                          <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Paid via COD</p>
                        </div>
                        <Link 
                          href={`/orders/${order.id}`}
                          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-900 font-black text-xs rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-md hover:shadow-[var(--color-primary)]/10 transition-all duration-300"
                        >
                          View Details
                          <span className="text-sm leading-none">→</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
