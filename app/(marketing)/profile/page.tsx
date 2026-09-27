import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddressManager } from "./AddressManager";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      _count: {
        select: { orders: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="py-8 lg:py-12 bg-gray-50/50 min-h-screen">
      <div className="container-site max-w-5xl mx-auto px-4">
        
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Welcome back, {user.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
          </div>
          {isAdmin && (
            <div>
              <Link href="/admin/dashboard" className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 duration-200">
                Go to Admin Dashboard &rarr;
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Card & Subscription */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center relative overflow-hidden group hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[var(--color-primary)] via-orange-500 to-amber-500 opacity-90 transition-transform duration-500 group-hover:scale-110"></div>
               <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
               
               <div className="relative z-10 h-28 w-28 bg-white text-[var(--color-primary)] border-4 border-white/80 rounded-full flex items-center justify-center text-5xl font-bold mx-auto mb-5 mt-10 shadow-xl backdrop-blur-md">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
               </div>
               <h2 className="text-2xl font-bold mb-1 text-gray-900 drop-shadow-sm">{user.name}</h2>
               <p className="text-sm font-medium text-gray-500 mb-6">{user.email || "No email provided"}</p>
               
               <div className="inline-flex items-center gap-2 justify-center bg-gray-50/80 backdrop-blur-sm text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200/50 shadow-sm">
                 <span className="text-gray-400">📱</span> {user.phone || "No phone added"}
               </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
               {/* Decorative blob */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>
               
               <h3 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                   📊
                 </div>
                 Account Stats
               </h3>
               
               <div className="space-y-5 text-sm relative z-10">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100/50">
                     <span className="text-gray-500 font-medium">Total Orders</span>
                     <span className="font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] px-4 py-1.5 rounded-full border border-[var(--color-primary)]/20 shadow-sm">{user._count.orders}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100/50">
                     <span className="text-gray-500 font-medium">Member Since</span>
                     <span className="font-bold text-gray-900 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200/50">{new Date(user.createdAt).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-gray-500 font-medium">Account Status</span>
                     <span className="font-bold text-green-700 bg-green-50 px-4 py-1.5 rounded-full border border-green-200/50 shadow-sm flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                       Active
                     </span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
             {/* Saved Addresses */}
             <AddressManager initialAddresses={user.addresses} />
             
             {/* Recent Activity */}
             <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 relative z-10">
                   <div>
                     <h2 className="font-display text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                       Recent Orders
                     </h2>
                     <p className="text-sm text-gray-500 mt-1">Track and view your past purchases.</p>
                   </div>
                   {user._count.orders > 0 && (
                     <Link href="/orders" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 px-4 py-2 rounded-full transition-all">
                       View All Orders &rarr;
                     </Link>
                   )}
                </div>
                
                <div className="relative z-10">
                  {user._count.orders === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-b from-gray-50/50 to-gray-50/10 rounded-2xl border border-dashed border-gray-200">
                       <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mx-auto mb-4 border border-gray-100">
                         🛍️
                       </div>
                       <p className="text-gray-900 font-bold text-lg mb-1">No orders yet</p>
                       <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">You haven't placed any orders. Check out our latest collections and start shopping!</p>
                       <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white px-8 py-3 text-sm font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-md shadow-[var(--color-primary)]/20 hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5">
                         Start Shopping &rarr;
                       </Link>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100">
                       <div className="text-4xl mb-4">📦</div>
                       <p className="font-medium text-gray-900 mb-4">You have <span className="font-bold text-[var(--color-primary)]">{user._count.orders}</span> orders in your history.</p>
                       <Link href="/orders" className="inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-8 py-3 text-sm font-bold hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md group">
                         Manage Your Orders
                         <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                       </Link>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
