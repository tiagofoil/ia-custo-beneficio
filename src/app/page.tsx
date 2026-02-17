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
        <section id="ranking" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
              <h2 className="font-display text-3xl sm:text-4xl text-white text-center">
                RANKING <span className="text-[var(--accent-cyan)]">/</span> CUSTO-BENEFÍCIO
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
            </div>
            
            <Suspense fallback={
              <div className="flex items-center justify-center h-64 terminal-block">
                <span className="font-mono text-sm text-[var(--text-muted)]">CARREGANDO...</span>
              </div>
            }>
              <RankingTable />
            </Suspense>
          </div>
        </section>
        
        {/* Methodology Section */}
        <section id="metodologia" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-surface-1)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="data-badge mb-6">Metodologia</div>
                <h2 className="font-display text-4xl sm:text-5xl text-white mb-6">
                  Como calculamos o <span className="text-[var(--accent-cyan)] glow-cyan">CUSTO-BENEFÍCIO</span>
                </h2>
                
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                  Nossa fórmula combina dados reais de preços da OpenRouter com 
                  benchmarks oficiais de performance para encontrar os modelos 
                  que entregam o máximo de valor por dólar gasto.
                </p>

                <div className="font-mono text-sm bg-[var(--bg-surface-2)] p-6 border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-muted)] mb-2">// Fórmula de cálculo</div>
                  <div className="text-[var(--accent-cyan)]">score = (performance / preço) × 100</div>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { 
                    num: "01", 
                    title: "Preço Real", 
                    desc: "Coletamos preços atualizados da OpenRouter API em tempo real.",
                    icon: "💰"
                  },
                  { 
                    num: "02", 
                    title: "Benchmarks Oficiais", 
                    desc: "SWE-bench, Arena ELO, e Artificial Analysis para medir performance.",
                    icon: "📊"
                  },
                  { 
                    num: "03", 
                    title: "Fórmula Justa", 
                    desc: "Score = (Performance / Preço) × 100. Quanto maior, melhor.",
                    icon: "🎯"
                  },
                ].map((step, i) => (
                  <div 
                    key={i} 
                    className="terminal-block p-6 group hover:border-[var(--accent-cyan)]/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="font-display text-3xl text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors">
                        {step.num}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{step.icon}</span>
                          <h3 className="font-display text-lg text-white">{step.title}</h3>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Sources Section */}
        <section id="fontes" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="data-badge mb-6 mx-auto">Fontes de Dados</div>
            
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-12">
              DADOS CONFIÁVEIS <span className="text-[var(--accent-magenta)]">/</span> VERIFICADOS
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
                  className="terminal-block p-6 text-left group hover:border-[var(--accent-cyan)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-lg text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                      {source.name}
                    </span>
                    <svg 
                      className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
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
