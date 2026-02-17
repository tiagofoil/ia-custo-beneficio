import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RankingTable } from "@/components/ranking-table";

export default function Home() {
  return (
    <div>
      <Navbar />
      
      <main>
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
        <section id="metodologia" className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-label">Metodologia</div>
              <h2 className="section-title">Como Calculamos</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {[
                { n: "01", t: "Preço Real", d: "Dados em tempo real da OpenRouter API" },
                { n: "02", t: "Benchmarks", d: "SWE-bench, Arena ELO, Artificial Analysis" },
                { n: "03", t: "Cálculo Justo", d: "Score = (Performance / Preço) × 100" },
              ].map((item) => (
                <div key={item.n} className="card">
                  <div className="font-mono" style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 12 }}>
                    {item.n}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{item.t}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{item.d}</p>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { n: "OpenRouter", d: "Preços em tempo real", u: "https://openrouter.ai" },
                { n: "SWE-bench", d: "Benchmarks de código", u: "https://www.swebench.com" },
                { n: "Arena", d: "Rankings ELO", u: "https://arena.ai" },
                { n: "Artificial Analysis", d: "Métricas de performance", u: "https://artificialanalysis.ai" },
              ].map((s) => (
                <a key={s.n} href={s.u} target="_blank" rel="noopener noreferrer" className="card" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>{s.n}</span>
                    <span>→</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
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
            <div className="footer-logo">IA</div>
            <span className="footer-text">Custo Benefício · 2026</span>
          </div>
          <a href="https://github.com/tiagofoil/ia-custo-beneficio" target="_blank" rel="noopener noreferrer" className="footer-text" style={{ textDecoration: 'none' }}>
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
