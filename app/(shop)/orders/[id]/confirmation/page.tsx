import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ReviewPrompt from "@/components/ReviewPrompt";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: { include: { product: true } },
      address: true,
    }
  });

  if (!order) notFound();

  // Pre-fill review form from order address
  const reviewName = order.address?.name ?? "";
  const reviewLocation = order.address
    ? `${order.address.city}, ${order.address.state}`
    : "";

  return (
    <div className="py-12 lg:py-20 flex justify-center">
      <div className="container-site max-w-2xl text-center">
        <div className="mb-8">
          <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            Thank you for your order. We&apos;ve received it and are getting it ready.
          </p>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-8 text-left mb-8 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-6 border-b border-[var(--color-border)]">
             <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-1">Order Number</p>
                <p className="font-mono text-sm font-bold text-[var(--color-text)]">{order.id}</p>
             </div>
             <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                <p className="text-lg font-bold text-[var(--color-primary)]">{formatPrice(order.total)} <span className="text-sm text-[var(--color-text-muted)] font-normal">(COD)</span></p>
             </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-3">Items Ordered</p>
            <div className="space-y-3">
               {order.orderItems.map((item: any) => (
                 <div key={item.id} className="flex justify-between text-sm">
                   <span className="text-[var(--color-text)]">{item.product.name} <span className="text-[var(--color-text-muted)]">× {item.quantity}</span></span>
                   <span className="font-medium">{formatPrice(item.priceAtOrder * item.quantity)}</span>
                 </div>
               ))}
            </div>
          </div>

          <div>
             <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-2">Delivery Address</p>
             <div className="text-sm text-[var(--color-text)] bg-[var(--color-bg-muted)] p-4 rounded-[var(--radius-md)]">
                <p className="font-bold mb-1">{order.address?.name}</p>
                <p>{order.address?.street}</p>
                <p>{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
                <p className="mt-2 text-[var(--color-text-muted)]">Phone: {order.address?.phone}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href={`/orders/${order.id}`}>
             <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Track Order
             </Button>
           </Link>
           <Link href="/products">
             <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Continue Shopping
             </Button>
           </Link>
        </div>

        {/* ── Review Prompt ─────────────────────────────────────────────── */}
        <ReviewPrompt userName={reviewName} userCity={reviewLocation} />
      </div>
    </div>
  );
}
