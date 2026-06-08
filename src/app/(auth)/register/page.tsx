"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "SELLER" }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/create");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl">🏪</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">Создать магазин</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Create your store</p>
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
            Создать магазин 🏪
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Войти / Login
          </Link>
        </p>
      </div>
    </div>
  );
}
