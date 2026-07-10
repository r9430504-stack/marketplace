// "Where to buy" block: links to marketplace searches for the model.
// We don't sell anything — these open a search for the phone's name.

import type { Locale } from "@/lib/i18n";

type Market = {
  name: string;
  emoji: string;
  url: (q: string) => string;
};

// The official Samsung store — as a separate primary button.
const OFFICIAL: Market = {
  name: "Samsung",
  emoji: "◆",
  url: (q) => `https://www.samsung.com/us/search/?searchvalue=${q}`,
};

const GLOBAL: Market[] = [
  { name: "Amazon", emoji: "📦", url: (q) => `https://www.amazon.com/s?k=${q}` },
  { name: "eBay", emoji: "🛒", url: (q) => `https://www.ebay.com/sch/i.html?_nkw=${q}` },
  { name: "Best Buy", emoji: "🔵", url: (q) => `https://www.bestbuy.com/site/searchpage.jsp?st=${q}` },
  { name: "Walmart", emoji: "🟡", url: (q) => `https://www.walmart.com/search?q=${q}` },
  { name: "AliExpress", emoji: "🟠", url: (q) => `https://www.aliexpress.com/wholesale?SearchText=${q}` },
  { name: "Flipkart", emoji: "🛍️", url: (q) => `https://www.flipkart.com/search?q=${q}` },
  { name: "Google Shopping", emoji: "🔎", url: (q) => `https://www.google.com/search?tbm=shop&q=${q}` },
];

const CIS: Market[] = [
  { name: "Yandex Market", emoji: "🟡", url: (q) => `https://market.yandex.ru/search?text=${q}` },
  { name: "Ozon", emoji: "🔵", url: (q) => `https://www.ozon.ru/search/?text=${q}` },
  { name: "Wildberries", emoji: "🟣", url: (q) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${q}` },
  { name: "DNS", emoji: "🟠", url: (q) => `https://www.dns-shop.ru/search/?q=${q}` },
  { name: "М.Видео", emoji: "🔴", url: (q) => `https://www.mvideo.ru/product-list-page?q=${q}` },
  { name: "Ситилинк", emoji: "🟢", url: (q) => `https://www.citilink.ru/search/?text=${q}` },
];

const TEXT = {
  en: {
    title: "Where to buy",
    note: "These links open a search for the model on each marketplace — prices and availability are on their side. This site does not sell devices.",
    global: "International",
    cis: "Russia & CIS",
  },
  ru: {
    title: "Где купить",
    note: "Ссылки открывают поиск модели на каждой площадке — цены и наличие на их стороне. Этот сайт не продаёт устройства.",
    global: "Международные",
    cis: "Россия и СНГ",
  },
};

function MarketChip({ m, q }: { m: Market; q: string }) {
  return (
    <a
      href={m.url(q)}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-black transition-colors inline-flex items-center gap-2"
    >
      <span aria-hidden>{m.emoji}</span>
      {m.name}
      <span className="text-gray-400" aria-hidden>↗</span>
    </a>
  );
}

export default function BuyLinks({ name, locale = "en" }: { name: string; locale?: Locale }) {
  const q = encodeURIComponent(`Samsung ${name}`);
  const T = TEXT[locale];
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{T.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{T.note}</p>

      <a
        href={OFFICIAL.url(q)}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="btn-primary px-4 py-2.5 text-sm"
      >
        <span aria-hidden>{OFFICIAL.emoji}</span>
        {OFFICIAL.name}
        <span className="text-white/70" aria-hidden>↗</span>
      </a>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
          {T.global}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {GLOBAL.map((m) => (
            <MarketChip key={m.name} m={m} q={q} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
          {T.cis}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {CIS.map((m) => (
            <MarketChip key={m.name} m={m} q={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
