"use client";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-transparent" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E1E1E] border border-[#2A2A2A] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-sm text-[#808080]">Dados atualizados semanalmente</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Encontre a melhor IA pelo{" "}
          <span className="text-[#00D9FF]">menor preço</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#808080] max-w-2xl mx-auto mb-10">
          Ranking de custo-benefício de LLMs para desenvolvedores brasileiros. 
          Compare preços reais da OpenRouter com benchmarks oficiais de performance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#ranking"
            className="btn btn-primary w-full sm:w-auto"
          >
            Ver Ranking
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>

          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full sm:w-auto"
          >
            Explorar Modelos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D9FF]">300+</div>
            <div className="text-sm text-[#808080]">Modelos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D9FF]">4</div>
            <div className="text-sm text-[#808080]">Fontes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D9FF]">0$</div>
            <div className="text-sm text-[#808080]">Grátis</div>
          </div>
        </div>
      </div>
    </section>
  );
}
