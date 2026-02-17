"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="relative w-full px-6 md:px-12 lg:px-20 py-32">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Typography */}
          <div className="relative">
            {/* Label */}
            <div 
              className={`flex items-center gap-3 mb-8 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="w-2 h-2 bg-[var(--neon-cyan)] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--text-dim)]">
                Sistema Online — Dados em Tempo Real
              </span>
            </div>

            {/* Main Title */}
            <div 
              className={`space-y-2 transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="block font-display text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight">
                IA
              </span>
              <span className="block font-display text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--neon-cyan)] text-glow-cyan tracking-tight">
                CUSTO
              </span>
              <span className="block font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
                BENEFÍCIO
              </span>
            </div>

            {/* Description */}
            <p 
              className={`mt-8 text-lg text-[var(--text-secondary)] max-w-md leading-relaxed transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Ranking inteligente de LLMs. Compare preços reais da OpenRouter 
              com benchmarks oficiais de performance.
            </p>

            {/* CTAs */}
            <div 
              className={`flex flex-wrap gap-4 mt-10 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <a href="#ranking" className="btn-cyber btn-cyber-primary">
                Ver Ranking
              </a>
              <a 
                href="https://openrouter.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-cyber"
              >
                Explorar Modelos →
              </a>
            </div>
          </div>

          {/* Right: Stats Panel */}
          <div 
            className={`relative transition-all duration-700 delay-400 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="data-card p-8 box-glow">
              {/* Decorative Corners */}
              <span className="corner-accent corner-tl" />
              <span className="corner-accent corner-tr" />
              <span className="corner-accent corner-bl" />
              <span className="corner-accent corner-br" />

              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-dim)] mb-6">
                Estatísticas do Sistema
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "300+", label: "Modelos Indexados" },
                  { value: "4", label: "Fontes de Dados" },
                  { value: "$0", label: "Custo de Uso" },
                  { value: "∞", label: "Possibilidades" },
                ].map((stat, i) => (
                  <div key={i} className="border-l-2 border-[var(--neon-cyan)]/30 pl-4">
                    <div className="font-display text-3xl font-bold text-white">{stat.value}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)] mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[var(--neon-pink)]/30 opacity-50" />
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/50 to-transparent" />
    </section>
  );
}
