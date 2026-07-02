# Galaxy Archive — история телефонов Samsung Galaxy

Справочный сайт об истории смартфонов Samsung Galaxy: точные характеристики,
даты выхода и история создания флагманов серий **S**, **Note**, складных
**Z Fold** и **Z Flip**, а также знаковых моделей **Galaxy A** — с 2013 года
до наших дней. Есть поиск по моделям, фильтры по линейке и году, хронология и
блоки под рекламу Google AdSense.

Построен на **Next.js 16** (App Router) + **Tailwind CSS 4**. Данные хранятся
статически (без БД), поэтому сайт мгновенно рендерится и деплоится куда угодно.

## Запуск локально

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Структура

| Путь | Назначение |
|------|-----------|
| `src/data/phones.ts` | **Каталог телефонов** — единственный источник данных. Добавить модель = дописать объект. |
| `src/lib/phones.ts` | Типы `Phone`/`Specs`, метаданные линеек, функции поиска и фильтрации. |
| `src/app/page.tsx` | Главная страница. |
| `src/app/phones/` | Каталог `/phones` и страница модели `/phones/[slug]`. |
| `src/app/history/` | Хронология по годам `/history`. |
| `src/components/AdSlot.tsx` | Рекламный блок AdSense (с плейсхолдером, пока не настроен). |

## Как добавить телефон

Откройте `src/data/phones.ts`, скопируйте любой объект и заполните поля.
Обязательны уникальный `slug`, `name`, `series`, `releaseYear`, `releaseDate`,
`tagline`, `history`, `keyFeatures` и `specs`. Поле `image` необязательное —
без него показывается стилизованная заглушка в цвете линейки.

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните (см. комментарии в файле):

- `NEXT_PUBLIC_SITE_URL` — публичный адрес для canonical/sitemap/OpenGraph.
- `NEXT_PUBLIC_ADSENSE_CLIENT` — издательский ID Google AdSense
  (`ca-pub-…`). Пока пуст — реклама заменяется плейсхолдерами.
- `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` — верификация в вебмастере.

## Google AdSense

1. Задайте `NEXT_PUBLIC_ADSENSE_CLIENT` — на всех страницах подключится скрипт AdSense.
2. Отредактируйте `public/ads.txt`, подставив ваш `pub-…` ID.
3. При необходимости добавьте `data-ad-slot` в конкретные `<AdSlot slot="…" />`.

## Деплой

Проект деплоится на **Railway** (конфиг `railway.json`, сборщик Nixpacks).
Команда сборки — `npm run build`, запуск — `next start`. База данных не требуется.
