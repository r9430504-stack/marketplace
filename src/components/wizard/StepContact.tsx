"use client";
import Input from "@/components/ui/Input";

interface ContactData {
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactWhatsapp: string;
  contactInstagram: string;
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
