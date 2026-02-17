export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent-cyan)] flex items-center justify-center transform rotate-45">
              <span className="text-[var(--bg-primary)] font-display text-xs transform -rotate-45">IA</span>
            </div>
            <div>
              <span className="font-display text-white text-sm">CUSTO BENEFÍCIO</span>
              <span className="block font-mono text-[10px] text-[var(--text-muted)]">Open Source · Atualizado semanalmente</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/tiagofoil/ia-custo-beneficio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors uppercase tracking-wider"
            >
              GitHub
            </a>
            <span className="text-[var(--border-subtle)]">·</span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              2026 — Dados via OpenRouter
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
