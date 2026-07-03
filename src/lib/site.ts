// Базовый адрес сайта. Меняется через переменную NEXT_PUBLIC_SITE_URL в Railway,
// когда подключишь свой домен. По умолчанию — текущий адрес на Railway.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://marketplace-production-c8d6.up.railway.app"
).replace(/\/$/, "");

export const SITE_NAME = "Galaxy Archive";
export const SITE_TITLE = "Galaxy Archive — история телефонов Samsung Galaxy";
export const SITE_DESCRIPTION =
  "Неофициальный архив истории смартфонов Samsung Galaxy: флагманы S, Note, складные Z Fold и Z Flip, а также A, M и другие линейки. Характеристики, даты выхода и поиск по моделям. Сайт не связан с Samsung.";

// Google AdSense: клиентский ID вида "ca-pub-XXXXXXXXXXXXXXXX" (публичный, не секрет).
// По умолчанию — ID этого проекта; можно переопределить переменной NEXT_PUBLIC_ADSENSE_CLIENT.
// Пусто — на страницах показываются плейсхолдеры рекламных блоков.
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5985897167482706";
