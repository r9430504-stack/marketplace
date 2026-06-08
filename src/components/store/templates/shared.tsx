import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types";
import { ProductLike } from "@/components/store/ProductCard";

export type CategoryData = {
  id: string;
  name: string;
  order: number;
  products: ProductLike[];
};

export type StoreData = {
  slug: string;
  name: string;
  tagline: string | null;
  bannerImage: string | null;
  bannerText: string | null;
  bannerTextColor: string;
  aboutText: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  contactWhatsapp: string | null;
  contactInstagram: string | null;
  deliveryInfo: string | null;
  categories: CategoryData[];
};

export function Contacts({ store, theme }: { store: StoreData; theme: ThemeConfig }) {
  const has = store.contactPhone || store.contactEmail || store.contactAddress || store.contactWhatsapp || store.contactInstagram;
  if (!has) return null;
  return (
    <section id="contacts" className={cn("border-t scroll-mt-24", theme.border)}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">Контакты</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          {store.contactPhone && <a href={`tel:${store.contactPhone}`} className="flex items-center gap-2 hover:opacity-80">📞 {store.contactPhone}</a>}
          {store.contactEmail && <a href={`mailto:${store.contactEmail}`} className="flex items-center gap-2 hover:opacity-80">✉️ {store.contactEmail}</a>}
          {store.contactAddress && <span className="flex items-center gap-2">📍 {store.contactAddress}</span>}
          {store.contactWhatsapp && (
            <a href={`https://wa.me/${store.contactWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80">💬 WhatsApp</a>
          )}
          {store.contactInstagram && <span className="flex items-center gap-2">📸 {store.contactInstagram}</span>}
        </div>
      </div>
    </section>
  );
}

export function PoweredBy() {
  return (
    <div className="text-center py-4 opacity-40 text-xs">
      Создан на <a href="/" className="hover:underline">StoreBuilder</a>
    </div>
  );
}
