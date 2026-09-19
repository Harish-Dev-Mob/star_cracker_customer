import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

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
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[var(--color-primary)] to-orange-500 opacity-90 transition-transform duration-500 group-hover:scale-105"></div>
               <div className="relative z-10 h-24 w-24 bg-white text-[var(--color-primary)] border-4 border-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 mt-8 shadow-md">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
               </div>
               <h2 className="text-xl font-bold mb-1 text-gray-900">{user.name}</h2>
               <p className="text-sm text-gray-500 mb-4">{user.email || "No email provided"}</p>
               <div className="inline-flex items-center justify-center bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200">
                 📱 {user.phone || "No phone added"}
               </div>
            </div>

            {/* Subscription / Membership Card */}
            <div className={`border rounded-2xl p-6 shadow-md relative overflow-hidden text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              isAdmin 
                ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
                : 'bg-gradient-to-br from-amber-400 to-orange-500 border-orange-300'
            }`}>
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
               <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
               
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                      {isAdmin ? 'System Role' : 'Membership'}
                    </span>
                    <span className="text-2xl drop-shadow-sm">{isAdmin ? '🛡️' : '✨'}</span>
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold mb-1 drop-shadow-sm">
                    {isAdmin ? "Admin Access" : "Premium Member"}
                  </h3>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed">
                    {isAdmin 
                      ? "You have full privileges to manage the store, view customers, and update products." 
                      : "Enjoy free shipping, exclusive festival discounts, and early access to sales."}
                  </p>
                  
                  {isAdmin ? (
                    <div className="w-full bg-white/10 rounded-lg p-3 text-center text-sm font-medium backdrop-blur-sm border border-white/10">
                      Privileges Active
                    </div>
                  ) : (
                    <button className="w-full bg-white text-orange-600 rounded-lg py-2.5 text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors active:scale-95 duration-200">
                      Manage Subscription
                    </button>
                  )}
               </div>
            </div>
            
            {/* Account Stats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <span className="text-[var(--color-primary)]">📊</span> Account Stats
               </h3>
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                     <span className="text-gray-500">Total Orders</span>
                     <span className="font-bold bg-gray-50 text-gray-800 px-3 py-1 rounded-full border border-gray-100">{user._count.orders}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                     <span className="text-gray-500">Member Since</span>
                     <span className="font-medium text-gray-900">{new Date(user.createdAt).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-gray-500">Status</span>
                     <span className="font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs border border-green-100">
                       Active
                     </span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
             {/* Saved Addresses */}
             <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="font-display text-xl font-bold text-gray-900">Saved Addresses</h2>
                   <button className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors px-3 py-1.5 rounded-md hover:bg-orange-50">
                     + Add New
                   </button>
                </div>

                {user.addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                     <div className="text-4xl mb-3 opacity-80">📍</div>
                     <p className="font-medium text-gray-900 mb-1">No saved addresses</p>
                     <p className="text-gray-500 text-sm max-w-xs mx-auto">Addresses are automatically saved when you place an order during checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     {user.addresses.map(address => (
                       <div key={address.id} className="border border-gray-200 rounded-xl p-5 relative bg-white hover:border-[var(--color-primary)] hover:shadow-sm transition-all group cursor-pointer">
                          {address.isDefault && (
                             <span className="absolute top-4 right-4 bg-orange-50 text-[var(--color-primary)] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-orange-100">
                               Default
                             </span>
                          )}
                          <p className="font-bold text-gray-900 mb-2 pr-16">{address.name}</p>
                          <div className="text-sm text-gray-500 space-y-1 mb-4">
                             <p className="line-clamp-1">{address.street}</p>
                             <p>{address.city}, {address.state} {address.pincode}</p>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                            <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                               <span>📞</span> {address.phone}
                            </p>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-[var(--color-primary)] font-semibold hover:underline">Edit</span>
                            </div>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>
             
             {/* Recent Activity */}
             <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="font-display text-xl font-bold text-gray-900">Recent Orders</h2>
                   {user._count.orders > 0 && (
                     <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                       View All
                     </Link>
                   )}
                </div>
                
                {user._count.orders === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="text-4xl mb-3 opacity-80">🛍️</div>
                     <p className="text-gray-900 font-medium mb-1">No orders yet</p>
                     <p className="text-gray-500 text-sm mb-5">You haven't placed any orders.</p>
                     <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm hover:shadow-md">
                       Start Shopping &rarr;
                     </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                     <Link href="/orders" className="inline-flex items-center justify-center rounded-full bg-gray-50 text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-gray-100 transition-all border border-gray-200 shadow-sm hover:shadow-md group">
                       View your {user._count.orders} orders
                       <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                     </Link>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
