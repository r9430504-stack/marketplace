"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type SeriesOpt = { id: string; label: string };
type FullPhone = {
  slug: string;
  name: string;
  series?: string;
  releaseYear?: number;
  releaseDate?: string;
  tagline?: string;
  image?: string;
  keyFeatures?: string[];
  history?: string;
  specs?: Record<string, string>;
};

const SPEC_FIELDS: { key: string; label: string; required?: boolean }[] = [
  { key: "display", label: "Display", required: true },
  { key: "chipset", label: "Chipset", required: true },
  { key: "ram", label: "RAM", required: true },
  { key: "storage", label: "Storage", required: true },
  { key: "mainCamera", label: "Main camera", required: true },
  { key: "frontCamera", label: "Front camera" },
  { key: "battery", label: "Battery", required: true },
  { key: "charging", label: "Charging" },
  { key: "os", label: "OS", required: true },
  { key: "resolution", label: "Resolution" },
  { key: "refreshRate", label: "Refresh rate" },
  { key: "displayType", label: "Panel type" },
  { key: "dimensions", label: "Dimensions" },
  { key: "weight", label: "Weight" },
  { key: "build", label: "Build" },
  { key: "waterResistance", label: "Protection" },
  { key: "colors", label: "Colors" },
  { key: "launchPrice", label: "Launch price" },
];

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-3 py-2 text-base outline-none focus:border-[#1428a0]";

// Read an image file, downscale it and re-encode so we can store it inline as
// a compact data: URL (no external file storage needed).
async function fileToDataUrl(file: File, maxW = 900): Promise<string> {
  const raw: string = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = () => rej(new Error("read"));
    fr.readAsDataURL(file);
  });
  try {
    const img = document.createElement("img");
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("decode"));
      img.src = raw;
    });
    const scale = Math.min(1, maxW / (img.width || maxW));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return raw;
    ctx.drawImage(img, 0, 0, w, h);
    const webp = canvas.toDataURL("image/webp", 0.85);
    return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/png");
  } catch {
    return raw;
  }
}

export default function AdminPhones({ seriesOptions }: { seriesOptions: SeriesOpt[] }) {
  const [f, setF] = useState<Record<string, string>>({ series: seriesOptions[0]?.id ?? "" });
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; slug?: string } | null>(null);
  const [list, setList] = useState<FullPhone[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const setSpec = (k: string, v: string) => setSpecs((s) => ({ ...s, [k]: v }));

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgBusy(true);
    try {
      set("image", await fileToDataUrl(file));
    } catch {
      /* ignore */
    } finally {
      setImgBusy(false);
    }
  };

  const loadList = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/phones");
      const d = await r.json();
      setList(Array.isArray(d.phones) ? (d.phones as FullPhone[]) : []);
    } catch {}
  }, []);
  useEffect(() => {
    loadList();
  }, [loadList]);

  const reset = () => {
    setF({ series: seriesOptions[0]?.id ?? "" });
    setSpecs({});
    setEditingSlug(null);
  };

  const startEdit = (p: FullPhone) => {
    setEditingSlug(p.slug);
    setMsg(null);
    setF({
      name: p.name ?? "",
      series: p.series ?? seriesOptions[0]?.id ?? "",
      releaseDate: p.releaseDate ?? (p.releaseYear != null ? String(p.releaseYear) : ""),
      tagline: p.tagline ?? "",
      image: p.image ?? "",
      keyFeatures: (p.keyFeatures ?? []).join(", "),
      history: p.history ?? "",
    });
    setSpecs({ ...(p.specs ?? {}) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          series: f.series,
          releaseDate: f.releaseDate,
          tagline: f.tagline,
          image: f.image,
          keyFeatures: f.keyFeatures,
          history: f.history,
          specs,
          editSlug: editingSlug ?? undefined,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.slug) {
        setMsg({ ok: true, text: editingSlug ? "Model updated." : "Model created.", slug: d.slug });
        reset();
        loadList();
      } else {
        const err =
          d.error === "exists"
            ? "A model with this name already exists."
            : d.error === "year"
              ? "Add a year to the release date (e.g. “January 2025” or “2025”)."
              : `Couldn't save (${d.error ?? r.status}).`;
        setMsg({ ok: false, text: err });
      }
    } catch {
      setMsg({ ok: false, text: "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (slug: string) => {
    if (!window.confirm(`Delete "${slug}"?`)) return;
    setList((x) => x.filter((p) => p.slug !== slug));
    try {
      await fetch(`/api/admin/phones?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="glass rounded-2xl p-5 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Name *</span>
            <input className={inputCls} value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Galaxy S99 Ultra" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Line *</span>
            <input
              className={inputCls}
              value={f.series ?? ""}
              onChange={(e) => set("series", e.target.value)}
              list="admin-lines"
              placeholder="Pick or type a new line"
              required
            />
            <datalist id="admin-lines">
              {seriesOptions.map((s) => (
                <option key={s.id} value={s.id} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Release date *</span>
            <input
              className={inputCls}
              value={f.releaseDate ?? ""}
              onChange={(e) => set("releaseDate", e.target.value)}
              placeholder="January 2025 — or just 2025"
              required
            />
            <span className="mt-1 block text-xs text-gray-400">The year is picked up from this automatically.</span>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Tagline</span>
          <input className={inputCls} value={f.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="A one-line description." />
        </label>

        <div>
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:rounded-full file:border-0 file:bg-[#1428a0] file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-[#0f1f7a]"
          />
          {imgBusy && <p className="mt-1 text-xs text-gray-400">Processing image…</p>}
          {f.image && (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt="" className="h-32 w-32 rounded-xl object-contain bg-white" />
              <button type="button" onClick={() => set("image", "")} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
                Remove
              </button>
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Key features (comma-separated)</span>
          <input className={inputCls} value={f.keyFeatures ?? ""} onChange={(e) => set("keyFeatures", e.target.value)} placeholder="Titanium frame, 7 years of updates" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">History</span>
          <textarea className={`${inputCls} resize-y`} rows={4} value={f.history ?? ""} onChange={(e) => set("history", e.target.value)} placeholder="A paragraph or two about the model…" />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Specifications</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {SPEC_FIELDS.map((sp) => (
              <label key={sp.key} className="block">
                <span className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  {sp.label}
                  {sp.required ? " *" : ""}
                </span>
                <input className={inputCls} value={specs[sp.key] ?? ""} onChange={(e) => setSpec(sp.key, e.target.value)} />
              </label>
            ))}
          </div>
        </div>

        {msg && (
          <div
            role="alert"
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
              msg.ok
                ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300"
                : "border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
            }`}
          >
            {msg.text}{" "}
            {msg.ok && msg.slug && (
              <Link href={`/phones/${msg.slug}`} className="underline">
                Open the model page →
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={busy} className="btn-primary px-6 py-3 text-base disabled:opacity-40">
            {busy ? "Saving…" : editingSlug ? "Save changes" : "Create model"}
          </button>
          {editingSlug && (
            <button type="button" onClick={reset} className="btn-outline px-5 py-3 text-base">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {list.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Your added models ({list.length})</h2>
          <ul className="space-y-2">
            {list.map((p) => (
              <li key={p.slug} className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                <Link href={`/phones/${p.slug}`} className="min-w-0 truncate font-medium text-[#1428a0] dark:text-blue-300 hover:underline">
                  {p.name}
                </Link>
                <span className="flex shrink-0 items-center gap-3">
                  <button onClick={() => startEdit(p)} className="text-sm font-medium text-gray-600 hover:underline dark:text-gray-300">
                    Edit
                  </button>
                  <button onClick={() => remove(p.slug)} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
