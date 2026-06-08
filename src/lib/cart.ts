"use client";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  qty: number;
  storeSlug: string;
  storeName: string;
};

const KEY = "sb_cart";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-change"));
}

export function getCart(): CartItem[] {
  return read();
}

export function cartCount(): number {
  return read().reduce((n, i) => n + i.qty, 0);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = read();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ ...item, qty });
  }
  write(items);
}

export function setQty(id: string, qty: number) {
  let items = read();
  if (qty <= 0) {
    items = items.filter((i) => i.id !== id);
  } else {
    const it = items.find((i) => i.id === id);
    if (it) it.qty = qty;
  }
  write(items);
}

export function removeFromCart(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function clearCart() {
  write([]);
}
