"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

type Address = {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
];

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenForm = (address?: Address) => {
    setEditingAddress(address || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      id: editingAddress?.id,
      name: fd.get("name"),
      phone: fd.get("phone"),
      street: fd.get("street"),
      city: fd.get("city"),
      state: fd.get("state"),
      pincode: fd.get("pincode"),
    };

    try {
      const res = await fetch("/api/user/address", {
        method: editingAddress ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save address");

      toast.success("Success", "Address saved successfully");
      
      if (editingAddress) {
        setAddresses(addresses.map(a => a.id === result.address.id ? result.address : a));
      } else {
        setAddresses([result.address, ...addresses]);
      }
      
      handleCloseForm();
      router.refresh();
    } catch (err: any) {
      toast.error("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all duration-300">
        {/* Decorative subtle blob */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary-light)]/10 blur-[60px] pointer-events-none" />

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {editingAddress ? "Update Address" : "New Address"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editingAddress ? "Keep your delivery details up to date." : "Add a new delivery location."}
            </p>
          </div>
          <button onClick={handleCloseForm} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
          <Input name="name" label="Full Name" defaultValue={editingAddress?.name ?? ""} required className="bg-white/50" />
          <Input name="phone" label="Mobile Number" defaultValue={editingAddress?.phone ?? ""} required className="bg-white/50" leftAddon={<span className="text-xs font-semibold text-gray-500">+91</span>} />
          <div className="sm:col-span-2">
            <Input name="street" label="Street Address" placeholder="House/Flat No., Building, Area" defaultValue={editingAddress?.street ?? ""} required className="bg-white/50" />
          </div>
          <Input name="city" label="City" defaultValue={editingAddress?.city ?? ""} required className="bg-white/50" />
          <Select
            name="state"
            label="State"
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            defaultValue={editingAddress?.state ?? ""}
            required
            className="bg-white/50"
          />
          <Input name="pincode" label="Pincode" placeholder="6 digits" defaultValue={editingAddress?.pincode ?? ""} required className="bg-white/50" />
          
          <div className="sm:col-span-2 mt-6 pt-6 border-t border-gray-100 flex gap-4 justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseForm} className="px-6 rounded-full border-gray-200 hover:bg-gray-50 text-gray-600">
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} variant="primary" className="px-8 rounded-full shadow-md shadow-[var(--color-primary)]/20 hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all">
              {editingAddress ? "Save Changes" : "Add Address"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
      {/* Decorative subtle blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary-light)]/10 blur-[60px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 relative z-10">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Delivery Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage where your orders will be shipped.</p>
        </div>
        {addresses.length === 0 && (
          <Button onClick={() => handleOpenForm()} variant="primary" className="rounded-full shadow-md px-6 py-2 text-sm">
            <span className="mr-2">+</span> Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50/50 to-gray-50/10 rounded-2xl border border-dashed border-gray-200 relative z-10">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mx-auto mb-4 border border-gray-100">
            📍
          </div>
          <p className="font-bold text-gray-900 text-lg mb-1">No Delivery Address</p>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            You haven't set up a delivery address yet. Add one now to speed up your future checkouts.
          </p>
          <Button onClick={() => handleOpenForm()} variant="secondary" className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50">
            Set Up Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 relative z-10">
          {addresses.map(address => (
            <div key={address.id} className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-[var(--color-primary)] flex items-center justify-center text-lg border border-orange-100">
                    🏠
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{address.name}</p>
                    <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Primary Address</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenForm(address)} 
                  className="bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-gray-100 hover:border-orange-200"
                >
                  Edit
                </button>
              </div>
              
              <div className="ml-13 pl-13 space-y-2 mt-2">
                <p className="text-gray-600 leading-relaxed text-sm">
                  {address.street}<br/>
                  {address.city}, {address.state} {address.pincode}
                </p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600 font-medium">
                  <span className="text-gray-400">📱</span> +91 {address.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
