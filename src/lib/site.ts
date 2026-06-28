// Базовый адрес сайта. Меняется через переменную NEXT_PUBLIC_SITE_URL в Railway,
// когда подключишь свой домен. По умолчанию — текущий адрес на Railway.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://storebuilder-app-production.up.railway.app"
).replace(/\/$/, "");
