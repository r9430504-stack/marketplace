import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Правовая информация",
  description:
    "Правовая информация и отказ от ответственности. Неофициальный справочный сайт, не связанный с Samsung Electronics.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-8">
        <p className="font-bold text-amber-900 dark:text-amber-200">
          ⚠️ Это не официальный сайт Samsung.
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
          Проект не связан с компанией Samsung Electronics, не аффилирован с ней и не одобрен ею.
        </p>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Правовая информация</h1>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Отсутствие аффилированности
          </h2>
          <p>
            {SITE_NAME} — независимый информационно-справочный ресурс, посвящённый истории
            смартфонов. Сайт создан энтузиастами и <strong>никак не связан</strong> с компанией
            Samsung Electronics Co., Ltd., её дочерними структурами и партнёрами. Компания
            не является автором, спонсором или одобряющей стороной этого проекта.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Товарные знаки
          </h2>
          <p>
            «Samsung», «Galaxy» и связанные названия, логотипы и обозначения являются
            зарегистрированными товарными знаками Samsung Electronics. Они упоминаются на сайте
            исключительно в справочных и описательных целях — чтобы указать, о каких именно
            устройствах идёт речь. Все права на товарные знаки принадлежат их правообладателю.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Информация и точность
          </h2>
          <p>
            Характеристики, даты выхода и описания собраны из открытых источников и приведены
            как есть. Мы стремимся к точности, но не гарантируем полноту и безошибочность данных.
            Актуальную и официальную информацию уточняйте на сайте производителя.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Изображения
          </h2>
          <p>
            Сайт не размещает официальные маркетинговые фотографии Samsung без соответствующих прав.
            Если какой-либо материал, по вашему мнению, нарушает авторские права, сообщите нам на{" "}
            <a href="mailto:r9430504@gmail.com" className="text-blue-700 hover:underline">
              r9430504@gmail.com
            </a>{" "}
            — мы оперативно удалим его.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Отказ от ответственности
          </h2>
          <p>
            Материалы предоставляются «как есть», без каких-либо гарантий. Администрация сайта не
            несёт ответственности за решения, принятые на основе размещённой здесь информации.
          </p>
        </section>
      </div>
    </div>
  );
}
