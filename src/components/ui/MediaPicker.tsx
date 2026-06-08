"use client";
import { useState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { parseVideo } from "@/lib/video";

interface Props {
  image: string;
  videoUrl: string;
  onImageChange: (url: string) => void;
  onVideoChange: (url: string) => void;
  label?: string;
}

export default function MediaPicker({ image, videoUrl, onImageChange, onVideoChange, label }: Props) {
  const [tab, setTab] = useState<"photo" | "video">(videoUrl && !image ? "video" : "photo");
  const video = parseVideo(videoUrl);

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit">
        {([["photo", "📷 Фото"], ["video", "🎬 Видео"]] as const).map(([id, lbl]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {tab === "photo" ? (
        <ImageUpload value={image} onChange={onImageChange} />
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="url"
            placeholder="Ссылка на YouTube или .mp4"
            value={videoUrl}
            onChange={(e) => onVideoChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Вставьте ссылку с YouTube (youtube.com/watch?v=... или youtu.be/...) или прямую ссылку на видеофайл .mp4
          </p>
          {video.type === "youtube" && (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe src={video.embed} className="w-full h-full" allowFullScreen title="preview" />
            </div>
          )}
          {video.type === "file" && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={video.src} controls className="w-full rounded-xl max-h-48" />
          )}
        </div>
      )}
    </div>
  );
}
