// Базовый адрес сайта. Меняется через переменную NEXT_PUBLIC_SITE_URL в Railway,
// когда подключишь свой домен. По умолчанию — текущий адрес на Railway.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://samsung-history.up.railway.app"
).replace(/\/$/, "");

export const SITE_NAME = "Galaxy Archive";
export const SITE_TITLE = "Galaxy Archive — история телефонов Samsung Galaxy";
export const SITE_DESCRIPTION =
  "Полная история смартфонов Samsung Galaxy с 2013 года: флагманы S, Note, складные Z Fold и Z Flip. Точные характеристики, даты выхода и поиск по моделям.";

// Google AdSense: клиентский ID вида "ca-pub-XXXXXXXXXXXXXXXX".
// Задаётся переменной окружения NEXT_PUBLIC_ADSENSE_CLIENT в Railway.
// Пока не задан — на страницах показываются аккуратные плейсхолдеры рекламных блоков.
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
