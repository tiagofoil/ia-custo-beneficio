export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 lg:px-20 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border border-[var(--neon-cyan)]">
              <span className="font-display text-[var(--neon-cyan)] text-sm font-bold">IA</span>
            </div>
            <div>
              <span className="font-display text-white text-sm font-medium">CUSTO BENEFÍCIO</span>
              <span className="block font-mono text-[10px] text-[var(--text-dim)] uppercase tracking-wider">
                Open Source · Atualizado Semanalmente
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/tiagofoil/ia-custo-beneficio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--neon-cyan)] transition-colors uppercase tracking-wider"
            >
              GitHub
            </a>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className="font-mono text-xs text-[var(--text-dim)]">
              2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
