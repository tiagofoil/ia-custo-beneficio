"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s' }}>
      <div className="container">
        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>Sistema Online — Dados em Tempo Real</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">
          <span className="hero-title-line1">IA CUSTO</span>
          <span className="hero-title-line2">BENEFÍCIO</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Ranking inteligente de LLMs. Compare preços reais da OpenRouter 
          com benchmarks oficiais de performance.
        </p>

        {/* Buttons */}
        <div className="hero-buttons">
          <a href="#ranking" className="btn btn-primary">
            Ver Ranking →
          </a>
          <a 
            href="https://openrouter.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Explorar Modelos ↗
          </a>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value">300+</div>
            <div className="stat-label">Modelos</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4</div>
            <div className="stat-label">Fontes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">$0</div>
            <div className="stat-label">Custo</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">∞</div>
            <div className="stat-label">Possibilidades</div>
          </div>
        </div>
      </div>
    </section>
  );
}
