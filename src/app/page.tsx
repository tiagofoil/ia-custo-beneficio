"use client";

import { Navbar } from "@/components/navbar";
import { RankingTable } from "@/components/ranking-table";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: 80 }}>
        {/* Direct to Ranking with Value Prop */}
        <section id="ranking" className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            {/* Value Proposition */}
            <div style={{ 
              textAlign: 'center', 
              maxWidth: 700, 
              margin: '0 auto 48px',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: 100,
                padding: '8px 16px',
                marginBottom: 24,
                fontSize: 14,
                color: 'var(--accent)',
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                <style>{`
                  @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                  }
                `}</style>
                {t.hero.badge}
              </div>
              
              <h1 style={{ 
                fontSize: 'clamp(32px, 5vw, 48px)', 
                fontWeight: 800, 
                marginBottom: 16,
                lineHeight: 1.1 
              }}>
                {t.hero.title}
              </h1>
              
              <p style={{ 
                fontSize: 18, 
                color: 'var(--text-secondary)', 
                lineHeight: 1.6 
              }}>
                {t.hero.subtitle}
              </p>
            </div>
            
            <RankingTable />
          </div>
        </section>
        
        {/* Methodology */}
        <section id="metodologia" className="section" style={{ background: 'rgba(20, 20, 20, 0.5)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-label">Methodology</div>
              <h2 className="section-title">{t.methodology.title}</h2>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 24 
            }}>
              {[
                { 
                  n: "01", 
                  t: t.methodology.dataCollection, 
                  d: t.methodology.dataCollectionDesc 
                },
                { 
                  n: "02", 
                  t: t.methodology.smartCalc, 
                  d: t.methodology.smartCalcDesc 
                },
                { 
                  n: "03", 
                  t: t.methodology.weeklyUpdate, 
                  d: t.methodology.weeklyUpdateDesc 
                },
              ].map((item) => (
                <div key={item.n} className="method-card">
                  <div style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 14,
                    color: 'var(--accent)',
                    fontWeight: 700,
                    marginBottom: 16 
                  }}>
                    {item.n}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    {item.t}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Sources */}
        <section id="fontes" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label">Sources</div>
              <h2 className="section-title">{t.sources.title}</h2>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
              gap: 16 
            }}>
              {[
                { n: "OpenRouter", d: t.sources.openrouter, u: "https://openrouter.ai" },
                { n: "SWE-bench", d: t.sources.swebench, u: "https://www.swebench.com" },
                { n: "Arena", d: t.sources.arena, u: "https://arena.ai" },
                { n: "Artificial Analysis", d: t.sources.artificialAnalysis, u: "https://artificialanalysis.ai" },
              ].map((s) => (
                <a
                  key={s.n}
                  href={s.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card"
                  style={{ 
                    padding: 24, 
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 8 
                  }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{s.n}</span>
                    <span style={{ color: 'var(--accent)' }}>→</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                    {s.d}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-left">
            <div className="footer-logo">V</div>
            <span className="footer-text">Value · {t.footer.year}</span>
          </div>
          <a 
            href="https://github.com/tiagofoil/ia-custo-beneficio" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-text"
            style={{ textDecoration: 'none', transition: 'color 0.2s' }}
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
