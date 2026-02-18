import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RankingTable } from "@/components/ranking-table";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Hero />
        
        {/* Ranking Section */}
        <section id="ranking" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-label">Ranking</div>
              <h2 className="section-title">Melhor Custo-Benefício</h2>
              <p className="section-subtitle">
                Modelos ordenados pelo melhor desempenho por dólar gasto
              </p>
            </div>
            
            <RankingTable />
          </div>
        </section>
        
        {/* Methodology */}
        <section id="metodologia" className="section" style={{ background: 'rgba(20, 20, 20, 0.5)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-label">Metodologia</div>
              <h2 className="section-title">Como Funciona</h2>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 24 
            }}>
              {[
                { 
                  n: "01", 
                  t: "Coleta de Dados", 
                  d: "Monitoramos preços em tempo real da OpenRouter e benchmarks oficiais como SWE-bench e Arena." 
                },
                { 
                  n: "02", 
                  t: "Cálculo Inteligente", 
                  d: "Usamos a fórmula: Score = (Performance ÷ Preço) × 100. Quanto maior, melhor o custo-benefício." 
                },
                { 
                  n: "03", 
                  t: "Atualização Semanal", 
                  d: "Preços de LLMs mudam constantemente. Nossos dados são atualizados automaticamente toda semana." 
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
              <div className="section-label">Fontes</div>
              <h2 className="section-title">Dados Confiáveis</h2>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
              gap: 16 
            }}>
              {[
                { n: "OpenRouter", d: "Preços em tempo real", u: "https://openrouter.ai" },
                { n: "SWE-bench", d: "Benchmarks de código", u: "https://www.swebench.com" },
                { n: "Arena", d: "Rankings ELO", u: "https://arena.ai" },
                { n: "Artificial Analysis", d: "Métricas de performance", u: "https://artificialanalysis.ai" },
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
            <span className="footer-text">Value · 2026</span>
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
