// "Where to buy" block: links to marketplace searches for the model.
// We don't sell anything — these open a search for the phone's name.

type Market = {
  name: string;
  emoji: string;
  url: (q: string) => string;
};

// The official Samsung store — as a separate button.
const OFFICIAL: Market = {
  name: "Samsung (official)",
  emoji: "◆",
  url: (q) => `https://www.samsung.com/us/search/?searchvalue=${q}`,
};

const MARKETS: Market[] = [
  { name: "eBay", emoji: "🛒", url: (q) => `https://www.ebay.com/sch/i.html?_nkw=${q}` },
  { name: "Amazon", emoji: "📦", url: (q) => `https://www.amazon.com/s?k=${q}` },
  { name: "Yandex Market", emoji: "🟡", url: (q) => `https://market.yandex.ru/search?text=${q}` },
  { name: "Ozon", emoji: "🔵", url: (q) => `https://www.ozon.ru/search/?text=${q}` },
  { name: "Wildberries", emoji: "🟣", url: (q) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${q}` },
];

export default function BuyLinks({ name }: { name: string }) {
  const q = encodeURIComponent(`Samsung ${name}`);
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Where to buy</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        These links open a search for the model on each marketplace — prices and availability are on their side. This site does not sell devices.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={OFFICIAL.url(q)}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors inline-flex items-center gap-2 shadow-sm shadow-blue-200"
        >
          <span aria-hidden>{OFFICIAL.emoji}</span>
          {OFFICIAL.name}
          <span className="text-blue-200" aria-hidden>↗</span>
        </a>
        {MARKETS.map((m) => (
          <a
            key={m.name}
            href={m.url(q)}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="glass rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-white/70 transition-colors inline-flex items-center gap-2"
          >
            <span aria-hidden>{m.emoji}</span>
            {m.name}
            <span className="text-gray-400" aria-hidden>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
