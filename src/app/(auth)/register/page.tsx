"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Role = "BUYER" | "SELLER";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    if (data.role === "SELLER") {
      router.push("/create");
    } else {
      router.push("/");
    }
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
            Создать аккаунт
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">Create account</p>

          <p className="text-center font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Кем вы хотите быть? / Who are you?
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole("BUYER")}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
            >
              <span className="text-4xl">🛒</span>
              <div className="text-center">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Покупатель</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Buyer</p>
              </div>
            </button>

            <button
              onClick={() => setRole("SELLER")}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
            >
              <span className="text-4xl">🏪</span>
              <div className="text-center">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Продавец</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Seller</p>
              </div>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Войти / Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={() => setRole(null)}
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-4 flex items-center gap-1"
        >
          ← Назад
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl">{role === "SELLER" ? "🏪" : "🛒"}</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {role === "SELLER" ? "Создать магазин" : "Регистрация"}
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {role === "SELLER" ? "Create your store" : "Register as buyer"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Имя / Name"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Пароль / Password"
            type="password"
            placeholder="Минимум 6 символов"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full justify-center">
            {role === "SELLER" ? "Создать магазин 🏪" : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
