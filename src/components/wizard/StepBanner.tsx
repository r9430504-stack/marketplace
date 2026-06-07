"use client";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";

interface BannerData {
  name: string;
  tagline: string;
  bannerImage: string;
  bannerText: string;
}

interface Props {
  value: BannerData;
  onChange: (data: Partial<BannerData>) => void;
}

export default function StepBanner({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Оформление магазина</h2>
        <p className="text-gray-500 mt-1">Store appearance</p>
      </div>

      <Input
        label="Название магазина / Store name"
        placeholder="Например: SmartHome Pro"
        value={value.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />

      <Input
        label="Слоган / Tagline"
        placeholder="Например: Умный дом для умных людей"
        value={value.tagline}
        onChange={(e) => onChange({ tagline: e.target.value })}
      />

      <ImageUpload
        label="Главный баннер (обложка) / Hero banner"
        value={value.bannerImage}
        onChange={(url) => onChange({ bannerImage: url })}
      />

      <Input
        label="Текст на баннере / Banner text"
        placeholder="Например: Добро пожаловать в SmartHome Pro!"
        value={value.bannerText}
        onChange={(e) => onChange({ bannerText: e.target.value })}
      />
    </div>
  );
}
