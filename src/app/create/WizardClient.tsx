"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/wizard/StepLayout";
import StepTheme from "@/components/wizard/StepTheme";
import StepBanner from "@/components/wizard/StepBanner";
import StepCategories from "@/components/wizard/StepCategories";
import StepProducts, { ProductDraft } from "@/components/wizard/StepProducts";
import StepContact from "@/components/wizard/StepContact";
import StepReview from "@/components/wizard/StepReview";
import StorePreview from "@/components/wizard/StorePreview";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Theme, Layout } from "@/types";

const STEPS = [
  { id: 1, title: "Макет", en: "Layout" },
  { id: 2, title: "Стиль", en: "Style" },
  { id: 3, title: "Оформление", en: "Appearance" },
  { id: 4, title: "Категории", en: "Categories" },
  { id: 5, title: "Товары", en: "Products" },
  { id: 6, title: "Контакты", en: "Contacts" },
  { id: 7, title: "Публикация", en: "Publish" },
];

interface StoreState {
  layout: Layout;
  theme: Theme;
  aboutText: string;
  name: string;
  tagline: string;
  bannerImage: string;
  bannerText: string;
  bannerTextColor: string;
  categories: string[];
  products: ProductDraft[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactWhatsapp: string;
  contactInstagram: string;
  deliveryInfo: string;
}

const initial: StoreState = {
  layout: "CATALOG",
  theme: "MODERN",
  aboutText: "",
  name: "",
  tagline: "",
  bannerImage: "",
  bannerText: "",
  bannerTextColor: "#ffffff",
  categories: [],
  products: [],
  contactPhone: "",
  contactEmail: "",
  contactAddress: "",
  contactWhatsapp: "",
  contactInstagram: "",
  deliveryInfo: "",
};

export default function WizardClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StoreState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(patch: Partial<StoreState>) {
    setData((d) => ({ ...d, ...patch }));
  }

  function canNext(): boolean {
    if (step === 3 && !data.name) return false;
    if (step === 4 && data.categories.length === 0) return false;
    return true;
  }

  async function publish() {
    setLoading(true);
    setError("");
    try {
      // 1. Create store
      const storeRes = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          tagline: data.tagline,
          bannerImage: data.bannerImage,
          bannerText: data.bannerText,
          bannerTextColor: data.bannerTextColor,
          theme: data.theme,
          layout: data.layout,
          aboutText: data.aboutText,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          contactAddress: data.contactAddress,
          contactWhatsapp: data.contactWhatsapp,
          contactInstagram: data.contactInstagram,
          deliveryInfo: data.deliveryInfo,
          status: "PUBLISHED",
        }),
      });
      const store = await storeRes.json();
      if (!storeRes.ok) throw new Error(store.error);

      // 2. Create categories
      const catRes = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.categories.map((name, i) => ({ name, order: i }))),
      });
      const cats = await catRes.json();
      if (!catRes.ok) throw new Error("Ошибка создания категорий");

      // 3. Create products
      for (const p of data.products) {
        const cat = cats[p.categoryIndex];
        if (!cat) continue;
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: p.name,
            description: p.description,
            details: p.details,
            price: parseFloat(p.price),
            oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
            currency: p.currency,
            images: p.images,
            videoUrl: p.videoUrl || null,
            categoryId: cat.id,
          }),
        });
      }

      router.push(`/store/${store.slug}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка публикации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900">
      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto flex-1">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    step === s.id
                      ? "bg-blue-600 text-white"
                      : step > s.id
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold
                    border-current">
                    {step > s.id ? "✓" : s.id}
                  </span>
                  {s.title}
                </div>
                {s.id < STEPS.length && (
                  <div className={`w-4 h-0.5 ${step > s.id ? "bg-green-300" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Split layout: preview (left) + form (right) */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Live preview */}
        <div className="lg:sticky lg:top-24 order-2 lg:order-1">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
            👁️ Так выглядит ваш магазин
          </p>
          <StorePreview data={data} />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 md:p-8 order-1 lg:order-2">
          {step === 1 && (
            <StepLayout value={data.layout} onChange={(layout) => update({ layout })} />
          )}
          {step === 2 && (
            <StepTheme value={data.theme} onChange={(theme) => update({ theme })} />
          )}
          {step === 3 && (
            <StepBanner
              value={{ name: data.name, tagline: data.tagline, bannerImage: data.bannerImage, bannerText: data.bannerText, bannerTextColor: data.bannerTextColor }}
              onChange={(patch) => update(patch as Partial<StoreState>)}
            />
          )}
          {step === 4 && (
            <StepCategories value={data.categories} onChange={(categories) => update({ categories })} />
          )}
          {step === 5 && (
            <StepProducts
              categories={data.categories}
              products={data.products}
              onChange={(products) => update({ products })}
            />
          )}
          {step === 6 && (
            <StepContact
              value={{
                contactPhone: data.contactPhone,
                contactEmail: data.contactEmail,
                contactAddress: data.contactAddress,
                contactWhatsapp: data.contactWhatsapp,
                contactInstagram: data.contactInstagram,
                deliveryInfo: data.deliveryInfo,
                aboutText: data.aboutText,
              }}
              onChange={(patch) => update(patch as Partial<StoreState>)}
            />
          )}
          {step === 7 && <StepReview data={data} />}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
            >
              ← Назад
            </Button>

            {step < STEPS.length ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Далее →
              </Button>
            ) : (
              <Button onClick={publish} loading={loading} className="bg-green-600 hover:bg-green-700">
                🚀 Опубликовать магазин
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
