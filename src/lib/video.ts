export type VideoInfo =
  | { type: "youtube"; id: string; embed: string }
  | { type: "file"; src: string }
  | { type: "none" };

export function parseVideo(url?: string | null): VideoInfo {
  if (!url) return { type: "none" };
  const u = url.trim();
  if (!u) return { type: "none" };

  // YouTube
  const yt =
    u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  if (yt) {
    return { type: "youtube", id: yt[1], embed: `https://www.youtube.com/embed/${yt[1]}` };
  }

  // Direct video file
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(u) || u.startsWith("data:video")) {
    return { type: "file", src: u };
  }

  // Unknown — treat as a generic link we can try as file
  if (/^https?:\/\//i.test(u)) return { type: "file", src: u };

  return { type: "none" };
}
