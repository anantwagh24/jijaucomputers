"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, ProductItem } from "@/lib/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("jijau_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem("jijau_coupon");
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setCouponCode(parsed.code || "");
        setDiscountPercent(parsed.percent || 0);
      }
    } catch (e) {
      console.error("Cart localStorage load failed", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("jijau_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (product: ProductItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode("");
    setDiscountPercent(0);
    localStorage.removeItem("jijau_cart");
    localStorage.removeItem("jijau_coupon");
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "JIJAUFIRST" || clean === "JIJAUFEST") {
      setCouponCode(clean);
      setDiscountPercent(10);
      localStorage.setItem("jijau_coupon", JSON.stringify({ code: clean, percent: 10 }));
      return { success: true, message: `Coupon ${clean} applied! You get 10% discount.` };
    }
    if (clean === "STUDENTPRO") {
      setCouponCode(clean);
      setDiscountPercent(8);
      localStorage.setItem("jijau_coupon", JSON.stringify({ code: clean, percent: 8 }));
      return { success: true, message: "Student discount applied (8% OFF)!" };
    }
    if (clean === "SPEEDUP") {
      setCouponCode(clean);
      setDiscountPercent(12);
      localStorage.setItem("jijau_coupon", JSON.stringify({ code: clean, percent: 12 }));
      return { success: true, message: "Hardware Combo discount applied (12% OFF)!" };
    }
    return { success: false, message: "Invalid or expired coupon code." };
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountPercent(0);
    localStorage.removeItem("jijau_coupon");
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.salePrice ?? item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const discount = Math.round((subtotal * discountPercent) / 100);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
