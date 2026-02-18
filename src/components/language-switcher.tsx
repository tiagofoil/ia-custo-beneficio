"use client";

import { useI18n, locales } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          style={{
            background: locale === l.code ? "var(--accent)" : "transparent",
            color: locale === l.code ? "#000" : "var(--text-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{l.flag}</span>
          <span className="font-mono">{l.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
