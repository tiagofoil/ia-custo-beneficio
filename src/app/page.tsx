import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RankingTable } from "@/components/ranking-table";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      
      <main>
        <Hero />
        
        <section id="ranking" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ranking de <span className="text-[#00D9FF]">Custo-Benefício</span>
              </h2>
              <p className="text-[#808080] max-w-2xl mx-auto">
                Modelos ordenados pelo melhor desempenho por dólar gasto. 
                Dados atualizados semanalmente de fontes oficiais.
              </p>
            </div>
            
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-[#808080]">Carregando dados...</div>
              </div>
            }>
              <RankingTable />
            </Suspense>
          </div>
        </section>
        
        <section id="metodologia" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#141414]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como calculamos o <span className="text-[#00D9FF]">custo-benefício</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF]/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Preço Real</h3>
                <p className="text-[#808080] text-sm">
                  Coletamos preços atualizados da OpenRouter API em tempo real.
                </p>
              </div>
              
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF]/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Benchmarks Oficiais</h3>
                <p className="text-[#808080] text-sm">
                  SWE-bench, Arena ELO, e Artificial Analysis para medir performance.
                </p>
              </div>
              
              <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF]/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Fórmula Justa</h3>
                <p className="text-[#808080] text-sm">
                  Score = (Performance / Preço) × 100. Quanto maior, melhor.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="fontes" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Fontes de <span className="text-[#00D9FF]">Dados</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-8">
              <a 
                href="https://openrouter.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#808080] hover:text-[#00D9FF] transition-colors"
              >
                <span className="font-mono text-sm">OpenRouter</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://www.swebench.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#808080] hover:text-[#00D9FF] transition-colors"
              >
                <span className="font-mono text-sm">SWE-bench</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://arena.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#808080] hover:text-[#00D9FF] transition-colors"
              >
                <span className="font-mono text-sm">Arena</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <a 
                href="https://artificialanalysis.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#808080] hover:text-[#00D9FF] transition-colors"
              >
                <span className="font-mono text-sm">Artificial Analysis</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
