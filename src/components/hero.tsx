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
          <span>Ranking atualizado semanalmente</span>
        </div>

        {/* Title - Smaller on mobile */}
        <h1 className="hero-title">
          <span className="hero-title-line1">IA Custo</span>
          <span className="hero-title-line2">Benefício</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Descubra os melhores modelos de IA pelo menor preço. 
          Compare GPT, Claude, Gemini e mais.
        </p>

        {/* Buttons - Bigger text */}
        <div className="hero-buttons">
          <a href="#ranking" className="btn btn-primary">
            Ver Ranking
          </a>
          <a 
            href="https://openrouter.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Explorar Modelos
          </a>
        </div>
      </div>
    </section>
  );
}
