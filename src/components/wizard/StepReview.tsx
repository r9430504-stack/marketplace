"use client";
import { THEMES, Theme } from "@/types";
import { ProductDraft } from "./StepProducts";

interface StoreData {
  name: string;
  tagline: string;
  bannerImage: string;
  bannerText: string;
  theme: Theme;
  categories: string[];
  products: ProductDraft[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactWhatsapp: string;
  contactInstagram: string;
}

interface Props {
  data: StoreData;
}

export default function StepReview({ data }: Props) {
  const theme = THEMES.find((t) => t.id === data.theme) ?? THEMES[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Проверьте ваш магазин</h2>
        <p className="text-gray-500 mt-1">Review your store before publishing</p>
      </div>

      {/* Preview card */}
      <div className={`rounded-2xl overflow-hidden border-2 ${theme.border}`}>
        {/* Banner */}
        <div className={`relative bg-gradient-to-br ${theme.preview} h-32 flex items-center justify-center`}>
          {data.bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.bannerImage} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          ) : null}
          <div className="relative z-10 text-center">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{data.name || "Название магазина"}</h3>
            {data.tagline && <p className="text-white/80 text-sm">{data.tagline}</p>}
          </div>
        </div>

        <div className={`p-4 ${theme.bg}`}>
          {/* Summary rows */}
          <div className="space-y-3">
            <Row label="Стиль" value={theme.nameRu + " / " + theme.nameEn} />
            <Row label="Категорий" value={`${data.categories.length} (${data.categories.join(", ")})`} />
            <Row label="Товаров" value={`${data.products.length} шт.`} />
            {data.contactPhone && <Row label="Телефон" value={data.contactPhone} />}
            {data.contactEmail && <Row label="Email" value={data.contactEmail} />}
            {data.contactAddress && <Row label="Адрес" value={data.contactAddress} />}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        ✅ После публикации ваш магазин будет доступен по уникальной ссылке. Вы сможете редактировать его в любое время из личного кабинета.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800 max-w-[60%] text-right">{value}</span>
    </div>
  );
}
