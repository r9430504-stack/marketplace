// Lightweight i18n. English lives at the site root (unchanged); Russian is
// added additively under /ru. Locale is derived from the pathname.

export type Locale = "en" | "ru";
export const LOCALES: Locale[] = ["en", "ru"];

export function localeFromPathname(path: string): Locale {
  return path === "/ru" || path.startsWith("/ru/") ? "ru" : "en";
}

/** Map a path to the same page in the given locale (default = unprefixed). */
export function withLocale(path: string, locale: Locale): string {
  const clean = path.replace(/^\/ru(?=\/|$)/, "") || "/";
  if (locale === "en") return clean;
  return clean === "/" ? "/ru" : `/ru${clean}`;
}

type Dict = {
  nav: { catalog: string; compare: string; guides: string; history: string };
  langName: string;
  back: string;
  catalog: {
    title: string;
    subtitle: (n: number) => string;
    searchPh: string;
    allLines: string;
    allYears: string;
    featuresLabel: string;
    found: string;
    foundNone: string;
    resetAll: string;
  };
  features: { spen: string; foldable: string; water: string; bigbat: string };
  home: {
    badge: (a: number, b: number) => string;
    h1: string;
    intro: (total: number, a: number, b: number) => string;
    search: string;
    timelineBtn: string;
    stats: { models: string; lines: string; years: string };
    linesTitle: string;
    linesSub: string;
    allModels: string;
    modelsCount: (n: number) => string;
    guidesTitle: string;
    guidesSub: string;
    allGuides: string;
    explore: string;
    flagshipsTitle: string;
    flagshipsSub: string;
    fullCatalog: string;
    timelineKicker: string;
    timelineTitle: string;
    timelineText: (a: number, b: number) => string;
    openTimeline: string;
  };
  footer: {
    tagline: string;
    contact: string;
    sections: string;
    modelCatalog: string;
    comparePhones: string;
    guides: string;
    timeline: string;
    about: string;
    contactLink: string;
    privacy: string;
    terms: string;
    legal: string;
    aboutTitle: string;
    notOfficial: string;
    aboutText: string;
    rights: string;
  };
};

export const UI: Record<Locale, Dict> = {
  en: {
    nav: { catalog: "Catalog", compare: "Compare", guides: "Guides", history: "History" },
    langName: "English",
    back: "Back",
    catalog: {
      title: "Model catalog",
      subtitle: (n) => `${n} officially released Samsung Galaxy models. Search by name, chipset or year.`,
      searchPh: "Search: model, chipset, year…",
      allLines: "All lines",
      allYears: "All years",
      featuresLabel: "Features:",
      found: "Models found:",
      foundNone: "Nothing found. Try a different query or reset the filters.",
      resetAll: "Reset all",
    },
    features: {
      spen: "S Pen",
      foldable: "Foldable",
      water: "Water-resistant",
      bigbat: "Big battery (5000 mAh+)",
    },
    home: {
      badge: (a, b) => `◆ Unofficial archive · ${a}–${b}`,
      h1: "The complete history of Samsung Galaxy phones",
      intro: (total, a, b) =>
        `${total} models from ${a} to ${b}: the S and Note lines, foldable Z Fold and Z Flip, plus A, M and more. Exact specifications, release dates, the story behind each one and model search.`,
      search: "Search models",
      timelineBtn: "Timeline by year →",
      stats: { models: "models", lines: "lines", years: "years" },
      linesTitle: "Galaxy lines",
      linesSub: "Choose a device family",
      allModels: "All models →",
      modelsCount: (n) => `${n} models →`,
      guidesTitle: "Guides & collections",
      guidesSub: "Explore the range by what matters to you",
      allGuides: "All guides →",
      explore: "Explore →",
      flagshipsTitle: "Flagships",
      flagshipsSub: "Recent and landmark models with photos",
      fullCatalog: "Full catalog →",
      timelineKicker: "Timeline",
      timelineTitle: "From the Galaxy S to the Galaxy S25 — year by year",
      timelineText: (a, b) =>
        `The evolution of Samsung phones from ${a} to ${b}: key models, foldables and the major milestones in one timeline.`,
      openTimeline: "Open the timeline →",
    },
    footer: {
      tagline:
        "An independent, unofficial archive of Samsung Galaxy smartphone history. Specifications are compiled from open sources.",
      contact: "Contact",
      sections: "Sections",
      modelCatalog: "Model catalog",
      comparePhones: "Compare phones",
      guides: "Guides & collections",
      timeline: "Timeline",
      about: "About",
      contactLink: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      legal: "Legal information",
      aboutTitle: "About",
      notOfficial: "This is not the official Samsung site.",
      aboutText:
        "This project is not connected with, affiliated with, or endorsed by Samsung Electronics. “Samsung” and “Galaxy” are trademarks of Samsung Electronics and are used purely for reference purposes. The site is informational in nature.",
      rights: "Unofficial reference resource",
    },
  },
  ru: {
    nav: { catalog: "Каталог", compare: "Сравнение", guides: "Подборки", history: "История" },
    langName: "Русский",
    back: "Назад",
    catalog: {
      title: "Каталог моделей",
      subtitle: (n) => `${n} официально вышедших моделей Samsung Galaxy. Поиск по названию, чипсету или году.`,
      searchPh: "Поиск: модель, чипсет, год…",
      allLines: "Все линейки",
      allYears: "Все годы",
      featuresLabel: "Функции:",
      found: "Найдено моделей:",
      foundNone: "Ничего не найдено. Измените запрос или сбросьте фильтры.",
      resetAll: "Сбросить всё",
    },
    features: {
      spen: "S Pen",
      foldable: "Складные",
      water: "Влагозащита",
      bigbat: "Большая батарея (5000 мА·ч+)",
    },
    home: {
      badge: (a, b) => `◆ Неофициальный архив · ${a}–${b}`,
      h1: "Полная история смартфонов Samsung Galaxy",
      intro: (total, a, b) =>
        `${total} моделей с ${a} по ${b} год: линейки S и Note, складные Z Fold и Z Flip, а также A, M и другие. Точные характеристики, даты выхода, история каждой модели и поиск.`,
      search: "Найти модель",
      timelineBtn: "История по годам →",
      stats: { models: "моделей", lines: "линеек", years: "годы" },
      linesTitle: "Линейки Galaxy",
      linesSub: "Выберите семейство устройств",
      allModels: "Все модели →",
      modelsCount: (n) => `${n} моделей →`,
      guidesTitle: "Подборки и гайды",
      guidesSub: "Исследуйте модельный ряд по тому, что важно вам",
      allGuides: "Все подборки →",
      explore: "Смотреть →",
      flagshipsTitle: "Флагманы",
      flagshipsSub: "Недавние и знаковые модели с фото",
      fullCatalog: "Весь каталог →",
      timelineKicker: "Хронология",
      timelineTitle: "От Galaxy S до Galaxy S25 — год за годом",
      timelineText: (a, b) =>
        `Эволюция телефонов Samsung с ${a} по ${b} год: ключевые модели, складные устройства и главные вехи в одной хронологии.`,
      openTimeline: "Открыть хронологию →",
    },
    footer: {
      tagline:
        "Независимый неофициальный архив истории смартфонов Samsung Galaxy. Характеристики собраны из открытых источников.",
      contact: "Контакты",
      sections: "Разделы",
      modelCatalog: "Каталог моделей",
      comparePhones: "Сравнение телефонов",
      guides: "Подборки и гайды",
      timeline: "Хронология",
      about: "О проекте",
      contactLink: "Контакты",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      legal: "Правовая информация",
      aboutTitle: "О проекте",
      notOfficial: "Это не официальный сайт Samsung.",
      aboutText:
        "Проект не связан с Samsung Electronics, не аффилирован с ней и не одобрен ею. «Samsung» и «Galaxy» — товарные знаки Samsung Electronics и используются исключительно в справочных целях. Сайт носит информационный характер.",
      rights: "Неофициальный справочный ресурс",
    },
  },
};

export function t(locale: Locale): Dict {
  return UI[locale];
}
