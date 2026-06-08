"use client";
import Input from "@/components/ui/Input";

interface ContactData {
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactWhatsapp: string;
  contactInstagram: string;
  deliveryInfo: string;
  aboutText: string;
}

interface Props {
  value: ContactData;
  onChange: (data: Partial<ContactData>) => void;
}

export default function StepContact({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Контактные данные</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Contact information</p>
      </div>

      <Input
        label="Телефон / Phone"
        placeholder="+7 (999) 123-45-67"
        value={value.contactPhone}
        onChange={(e) => onChange({ contactPhone: e.target.value })}
      />

      <Input
        label="Email"
        type="email"
        placeholder="shop@example.com"
        value={value.contactEmail}
        onChange={(e) => onChange({ contactEmail: e.target.value })}
      />

      <Input
        label="Адрес / Address"
        placeholder="г. Москва, ул. Примерная, 1"
        value={value.contactAddress}
        onChange={(e) => onChange({ contactAddress: e.target.value })}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">📖 О нас / About (текст «О магазине»)</label>
        <textarea
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
          rows={3}
          placeholder="Расскажите о вашем магазине: кто вы, чем гордитесь, почему вам доверяют..."
          value={value.aboutText}
          onChange={(e) => onChange({ aboutText: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">🚚 Условия доставки / Delivery</label>
        <textarea
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
          rows={3}
          placeholder="Например: Доставка по городу 300₽, бесплатно от 5000₽. По России — СДЭК 1-5 дней."
          value={value.deliveryInfo}
          onChange={(e) => onChange({ deliveryInfo: e.target.value })}
        />
      </div>

      <div className="border-t dark:border-gray-700 pt-4 space-y-4">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Социальные сети (необязательно)</p>
        <Input
          label="WhatsApp"
          placeholder="+7 (999) 123-45-67"
          value={value.contactWhatsapp}
          onChange={(e) => onChange({ contactWhatsapp: e.target.value })}
        />
        <Input
          label="Instagram"
          placeholder="@myshop"
          value={value.contactInstagram}
          onChange={(e) => onChange({ contactInstagram: e.target.value })}
        />
      </div>
    </div>
  );
}
