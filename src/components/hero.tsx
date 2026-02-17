"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Live Data Badge */}
        <div 
          className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="data-badge">
            Sistema Online — Dados atualizados em tempo real
          </div>
        </div>

        {/* Main Headline - Asymmetrical Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-end">
          <div className="lg:col-span-8">
            <h1 
              className={`font-display text-5xl sm:text-6xl lg:text-8xl xl:text-9xl leading-[0.85] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <span className="block text-white">IA</span>
              <span className="block text-[var(--text-muted)]">CUSTO</span>
              <span className="block text-[var(--accent-cyan)] glow-cyan">BENEFÍCIO</span>
            </h1>
          </div>

          <div 
            className={`lg:col-span-4 lg:pb-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed border-l-2 border-[var(--accent-cyan)] pl-6">
              Ranking inteligente de modelos de IA. 
              Compare preços reais da OpenRouter com benchmarks 
              oficiais de performance.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-px mt-16 bg-[var(--border-subtle)] terminal-block transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {[
            { value: "300+", label: "Modelos indexados", suffix: "" },
            { value: "4", label: "Fontes de dados", suffix: "" },
            { value: "$0", label: "Custo de uso", suffix: "" },
            { value: "∞", label: "Possibilidades", suffix: "" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-[var(--bg-surface-1)] p-6 sm:p-8 group hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <div className="font-display text-3xl sm:text-4xl text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                {stat.value}
                <span className="text-[var(--accent-cyan)]">{stat.suffix}</span>
              </div>
              <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-wrap gap-4 mt-12 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <a href="#ranking" className="btn btn-primary">
            Ver Ranking Completo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>

          <a 
            href="https://openrouter.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Explorar Modelos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-px h-32 bg-gradient-to-b from-transparent via-[var(--accent-cyan)] to-transparent opacity-30" />
        <div className="absolute bottom-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-[var(--accent-magenta)] to-transparent opacity-30" />
      </div>
    </section>
  );
}
