"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type SeriesOpt = { id: string; label: string };
type Custom = { slug: string; name: string };

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

export default function AdminPhones({ seriesOptions }: { seriesOptions: SeriesOpt[] }) {
  const [f, setF] = useState<Record<string, string>>({ series: seriesOptions[0]?.id ?? "" });
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; slug?: string } | null>(null);
  const [list, setList] = useState<Custom[]>([]);

  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const setSpec = (k: string, v: string) => setSpecs((s) => ({ ...s, [k]: v }));

  const loadList = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/phones");
      const d = await r.json();
      setList(Array.isArray(d.phones) ? d.phones.map((p: Custom) => ({ slug: p.slug, name: p.name })) : []);
    } catch {}
  }, []);
  useEffect(() => {
    loadList();
  }, [loadList]);

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
          releaseYear: f.releaseYear,
          releaseDate: f.releaseDate,
          tagline: f.tagline,
          image: f.image,
          keyFeatures: f.keyFeatures,
          history: f.history,
          specs,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.slug) {
        setMsg({ ok: true, text: "Model created.", slug: d.slug });
        setF({ series: seriesOptions[0]?.id ?? "" });
        setSpecs({});
        loadList();
      } else {
        const err = d.error === "exists" ? "A model with this name already exists." : `Couldn't save (${d.error ?? r.status}).`;
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
            <select className={inputCls} value={f.series ?? ""} onChange={(e) => set("series", e.target.value)}>
              {seriesOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Release year *</span>
            <input className={inputCls} type="number" value={f.releaseYear ?? ""} onChange={(e) => set("releaseYear", e.target.value)} placeholder="2025" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Release date</span>
            <input className={inputCls} value={f.releaseDate ?? ""} onChange={(e) => set("releaseDate", e.target.value)} placeholder="January 2025" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Tagline</span>
          <input className={inputCls} value={f.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="A one-line description." />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">Image URL</span>
          <input className={inputCls} value={f.image ?? ""} onChange={(e) => set("image", e.target.value)} placeholder="https://…/photo.png" />
        </label>

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

        <button type="submit" disabled={busy} className="btn-primary px-6 py-3 text-base disabled:opacity-40">
          {busy ? "Saving…" : "Create model"}
        </button>
      </form>

      {list.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Your added models ({list.length})</h2>
          <ul className="space-y-2">
            {list.map((p) => (
              <li key={p.slug} className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                <Link href={`/phones/${p.slug}`} className="font-medium text-[#1428a0] dark:text-blue-300 hover:underline">
                  {p.name}
                </Link>
                <button onClick={() => remove(p.slug)} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
