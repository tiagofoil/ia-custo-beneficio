import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IA Custo Benefício | Ranking de LLMs para Brasileiros",
  description: "Descubra os melhores modelos de IA com o melhor custo-benefício. Ranking atualizado semanalmente com preços e benchmarks reais.",
  keywords: ["LLM", "IA", "inteligência artificial", "custo-benefício", "OpenRouter", "GPT", "Claude"],
  authors: [{ name: "IA Custo Benefício" }],
  openGraph: {
    title: "IA Custo Benefício - Ranking de LLMs",
    description: "Os melhores modelos de IA pelo menor preço. Atualizado semanalmente.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-[#0A0A0A] text-[#EAEAEA]">
        {children}
      </body>
    </html>
  );
}
