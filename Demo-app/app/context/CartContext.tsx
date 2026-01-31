import React, { createContext, useContext, useMemo, useState } from "react";

/* ================= TYPES ================= */

export type CartType =
  | "grocery"
  | "clothing"
  | "jewellery"
  | "electronics";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  type: CartType;
};

type CartState = {
  grocery: CartItem[];
  clothing: CartItem[];
  jewellery: CartItem[];
  electronics: CartItem[];
};

type CartContextType = {
  cart: CartState;

  addToCart: (item: CartItem) => void;
  increaseQty: (id: string, type: CartType) => void;
  decreaseQty: (id: string, type: CartType) => void;
  removeFromCart: (id: string, type: CartType) => void;
  clearCart: (type?: CartType) => void;

  groceryTotal: number;
  clothingTotal: number;
  jewelleryTotal: number;
  electronicsTotal: number;

  groceryCount: number;
  clothingCount: number;
  jewelleryCount: number;
  electronicsCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({
    grocery: [],
    clothing: [],
    jewellery: [],
    electronics: [],
  });

  /* ===== ADD TO CART (UNCHANGED LOGIC) ===== */
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // ✅ SAFETY GUARD (IMPORTANT)
      if (!item.type || !prev[item.type]) {
        console.warn("Invalid cart type:", item.type, item);
        return prev;
      }

      const list = prev[item.type];
      const exists = list.find((x) => x.id === item.id);

      const updated = exists
        ? list.map((x) =>
            x.id === item.id
              ? { ...x, quantity: x.quantity + 1 }
              : x
          )
        : [...list, { ...item, quantity: 1 }];

      return {
        ...prev,
        [item.type]: updated,
      };
    });
  };

  /* ===== QTY CONTROLS ===== */
  const increaseQty = (id: string, type: CartType) => {
    setCart((prev) => ({
      ...prev,
      [type]: prev[type].map((x) =>
        x.id === id ? { ...x, quantity: x.quantity + 1 } : x
      ),
    }));
  };

  const decreaseQty = (id: string, type: CartType) => {
    setCart((prev) => ({
      ...prev,
      [type]: prev[type]
        .map((x) =>
          x.id === id ? { ...x, quantity: x.quantity - 1 } : x
        )
        .filter((x) => x.quantity > 0),
    }));
  };

  const removeFromCart = (id: string, type: CartType) => {
    setCart((prev) => ({
      ...prev,
      [type]: prev[type].filter((x) => x.id !== id),
    }));
  };

  const clearCart = (type?: CartType) => {
    if (!type) {
      setCart({
        grocery: [],
        clothing: [],
        jewellery: [],
        electronics: [],
      });
    } else {
      setCart((prev) => ({ ...prev, [type]: [] }));
    }
  };

  /* ================= TOTALS ================= */

  const groceryTotal = useMemo(
    () => cart.grocery.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart.grocery]
  );

  const clothingTotal = useMemo(
    () => cart.clothing.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart.clothing]
  );

  const jewelleryTotal = useMemo(
    () => cart.jewellery.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart.jewellery]
  );

  const electronicsTotal = useMemo(
    () => cart.electronics.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart.electronics]
  );

  /* ================= COUNTS ================= */

  const groceryCount = useMemo(
    () => cart.grocery.reduce((s, i) => s + i.quantity, 0),
    [cart.grocery]
  );

  const clothingCount = useMemo(
    () => cart.clothing.reduce((s, i) => s + i.quantity, 0),
    [cart.clothing]
  );

  const jewelleryCount = useMemo(
    () => cart.jewellery.reduce((s, i) => s + i.quantity, 0),
    [cart.jewellery]
  );

  const electronicsCount = useMemo(
    () => cart.electronics.reduce((s, i) => s + i.quantity, 0),
    [cart.electronics]
  );

  /* ================= CONTEXT ================= */

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,

        groceryTotal,
        clothingTotal,
        jewelleryTotal,
        electronicsTotal,

        groceryCount,
        clothingCount,
        jewelleryCount,
        electronicsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
