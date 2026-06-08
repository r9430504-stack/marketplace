"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cartCount } from "@/lib/cart";

export default function CartFab() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center text-2xl transition-transform hover:scale-110"
      title="Корзина"
    >
      🛒
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
          {count}
        </span>
      )}
    </Link>
  );
}
