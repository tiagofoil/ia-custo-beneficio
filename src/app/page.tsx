import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RankingTable } from "@/components/ranking-table";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Ranking Section */}
        <section id="ranking" className="py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-8 h-px bg-[var(--neon-cyan)]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">Ranking</span>
                <span className="w-8 h-px bg-[var(--neon-cyan)]" />
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                Melhor Custo-Benefício
              </h2>
              
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Modelos ordenados pelo melhor desempenho por dólar gasto. 
                Dados atualizados semanalmente.
              </p>
            </div>
            
            <Suspense fallback={
              <div className="flex items-center justify-center h-64 data-card">
                <span className="font-mono text-sm text-[var(--text-dim)]">CARREGANDO...</span>
              </div>
            }>
              <RankingTable />
            </Suspense>
          </div>
        </section>
        
        {/* Methodology Section */}
        <section id="metodologia" className="py-24 px-6 md:px-12 lg:px-20 bg-[var(--bg-surface)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--neon-pink)]">Metodologia</span>
                </div>
                
                <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                  Como Calculamos
                </h2>
                
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                  Nossa fórmula combina dados reais de preços da OpenRouter com 
                  benchmarks oficiais para encontrar o máximo valor por dólar gasto.
                </p>

                <div className="font-mono text-sm bg-[var(--bg-card)] p-6 border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-dim)] mb-2">// Fórmula</div>
                  <div className="text-[var(--neon-cyan)]">score = (performance / preço) × 100</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { 
                    num: "01", 
                    title: "Preço Real", 
                    desc: "Dados em tempo real da OpenRouter API",
                    color: "cyan"
                  },
                  { 
                    num: "02", 
                    title: "Benchmarks", 
                    desc: "SWE-bench, Arena ELO, Artificial Analysis",
                    color: "pink"
                  },
                  { 
                    num: "03", 
                    title: "Cálculo Justo", 
                    desc: "Quanto maior o score, melhor o custo-benefício",
                    color: "purple"
                  },
                ].map((step, i) => (
                  <div key={i} className="data-card p-6 group">
                    <div className="flex items-start gap-6">
                      <div className={`font-display text-4xl font-bold text-[var(--neon-${step.color})] opacity-50 group-hover:opacity-100 transition-opacity`}>
                        {step.num}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-white mb-2">{step.title}</h3>
                        <p className="text-[var(--text-secondary)]">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Sources Section */}
        <section id="fontes" className="py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--neon-purple)]">Fontes</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl text-white mb-12">
              Dados Confiáveis
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "OpenRouter", desc: "Preços em tempo real", url: "https://openrouter.ai" },
                { name: "SWE-bench", desc: "Benchmarks de código", url: "https://www.swebench.com" },
                { name: "Arena", desc: "Rankings ELO", url: "https://arena.ai" },
                { name: "Artificial Analysis", desc: "Métricas de performance", url: "https://artificialanalysis.ai" },
              ].map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="data-card p-6 text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xl text-white group-hover:text-[var(--neon-cyan)] transition-colors">
                      {source.name}
                    </span>
                    <svg 
                      className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--neon-cyan)] transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="font-mono text-xs text-[var(--text-dim)] uppercase tracking-wider">
                    {source.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
