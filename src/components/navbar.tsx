"use client";

import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { t } = useI18n();

  return (
    <nav className="nav">
      <div className="container nav-content">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">V</div>
          <span className="nav-logo-text">Value</span>
        </a>

        <div className="nav-links">
          <a href="#ranking" className="nav-link">{t.nav.ranking}</a>
          <a href="#metodologia" className="nav-link">{t.nav.howItWorks}</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LanguageSwitcher />
          <a
            href="https://github.com/tiagofoil/ia-custo-beneficio"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
