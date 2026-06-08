"use client";
import { useState } from "react";
import { addToCart, CartItem } from "@/lib/cart";

interface Props {
  item: Omit<CartItem, "qty">;
  inStock: boolean;
  className?: string;
  big?: boolean;
}

export default function AddToCart({ item, inStock, className = "", big }: Props) {
  const [added, setAdded] = useState(false);

  function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (!inStock) {
    return (
      <button
        disabled
        className={`rounded-full font-semibold bg-gray-300 text-gray-500 cursor-not-allowed ${
          big ? "px-6 py-3 text-base" : "px-3 py-1.5 text-xs"
        } ${className}`}
      >
        Нет в наличии
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      className={`rounded-full font-semibold transition-colors ${
        added ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
      } ${big ? "px-6 py-3 text-base" : "px-3 py-1.5 text-xs"} ${className}`}
    >
      {added ? "✓ Добавлено" : "🛒 В корзину"}
    </button>
  );
}
