"use client";

// Client-side persistence for favorites and recent AI picks (localStorage).
// Later, signing in with Google will sync these to the cloud; the UI already
// reads from here, so the sync layer can populate the same store.
import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "favorites";
const PICKS_KEY = "ai-picks";
const EVT = "saved-changed";

function read(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function write(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
  window.dispatchEvent(new Event(EVT));
}

function useStore(key: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(read(key));
    const sync = () => setList(read(key));
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);
  return [list, setList] as const;
}

export function useFavorites() {
  const [list, setList] = useStore(FAV_KEY);
  const toggle = useCallback((slug: string) => {
    const cur = read(FAV_KEY);
    const adding = !cur.includes(slug);
    const next = adding ? [slug, ...cur] : cur.filter((s) => s !== slug);
    write(FAV_KEY, next);
    setList(next);
    // Best-effort cloud sync (ignored/401 when signed out).
    fetch("/api/favorites", {
      method: adding ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [setList]);
  const has = useCallback((slug: string) => list.includes(slug), [list]);
  return { favorites: list, toggle, has };
}

/** Merge cloud favorites with device favorites (union) once signed in. */
export async function mergeCloudFavorites(): Promise<void> {
  try {
    const r = await fetch("/api/favorites");
    if (!r.ok) return;
    const cloud: string[] = (await r.json())?.favorites ?? [];
    const local = read(FAV_KEY);
    const union = Array.from(new Set([...cloud, ...local]));
    write(FAV_KEY, union);
    const localOnly = local.filter((s) => !cloud.includes(s));
    if (localOnly.length) {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: localOnly }),
      }).catch(() => {});
    }
  } catch {}
}

/** Record a phone the AI recommended (most-recent first, unique, capped). */
export function recordPick(slug: string) {
  const cur = read(PICKS_KEY).filter((s) => s !== slug);
  write(PICKS_KEY, [slug, ...cur].slice(0, 12));
}

export function useRecentPicks() {
  const [list] = useStore(PICKS_KEY);
  return list;
}
