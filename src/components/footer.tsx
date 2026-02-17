export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] border-t border-[#2A2A2A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-sm">IA</span>
            </div>
            <span className="font-semibold">Custo Benefício</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#808080]">
            <a
              href="https://github.com/tiagofoil/ia-custo-beneficio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00D9FF] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[#2A2A2A]">|</span>
            <span>Atualizado: {currentYear}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#2A2A2A] text-center text-sm text-[#666666]">
          <p>
            Dados coletados automaticamente de{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#808080] hover:text-[#00D9FF]"
            >
              OpenRouter
            </a>
            ,{" "}
            <a
              href="https://www.swebench.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#808080] hover:text-[#00D9FF]"
            >
              SWE-bench
            </a>
            ,{" "}
            <a
              href="https://arena.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#808080] hover:text-[#00D9FF]"
            >
              Arena
            </a>
            , e{" "}
            <a
              href="https://artificialanalysis.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#808080] hover:text-[#00D9FF]"
            >
              Artificial Analysis
            </a>
            .
          </p>
          <p className="mt-2">
            Este site não é afiliado aos provedores de IA listados.
          </p>
        </div>
      </div>
    </footer>
  );
}
