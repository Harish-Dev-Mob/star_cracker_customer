"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  stock: number;
  category?: { name: string };
}

interface WishlistStore {
  items: WishlistProduct[];

  addItem: (product: WishlistProduct) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: WishlistProduct) => void;
  clearAll: () => void;
  isInWishlist: (productId: string) => boolean;
  count: () => number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.find((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),

      toggleItem: (product) => {
        const inList = get().isInWishlist(product.id);
        if (inList) get().removeItem(product.id);
        else get().addItem(product);
      },

      clearAll: () => set({ items: [] }),

      isInWishlist: (productId) => get().items.some((i) => i.id === productId),

      count: () => get().items.length,
    }),
    {
      name: "fire-cracker-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
