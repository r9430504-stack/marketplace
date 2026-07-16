"use client";

import { useEffect, useState } from "react";

const FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "home_title_en", label: "Home title (EN)" },
  { key: "home_subtitle_en", label: "Home subtitle (EN)", area: true },
  { key: "home_title_ru", label: "Home title (RU)" },
  { key: "home_subtitle_ru", label: "Home subtitle (RU)", area: true },
];

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-3 py-2 text-base outline-none focus:border-[#1428a0]";

export default function AdminSettings() {
  const [v, setV] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setV(d.settings ?? {}))
      .catch(() => {});
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      setMsg(r.ok ? { ok: true, text: "Saved. The home page updates within a minute." } : { ok: false, text: "Couldn't save." });
    } catch {
      setMsg({ ok: false, text: "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="glass rounded-2xl p-5 space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Edit the home page hero text. Leave a field empty to use the built-in default.
      </p>
      {FIELDS.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">{f.label}</span>
          {f.area ? (
            <textarea
              className={`${inputCls} resize-y`}
              rows={3}
              value={v[f.key] ?? ""}
              onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          ) : (
            <input
              className={inputCls}
              value={v[f.key] ?? ""}
              onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          )}
        </label>
      ))}

      {msg && (
        <div
          role="alert"
          className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
            msg.ok
              ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300"
              : "border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40">
        {busy ? "Saving…" : "Save text"}
      </button>
    </form>
  );
}
