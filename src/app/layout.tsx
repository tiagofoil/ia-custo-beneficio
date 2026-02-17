import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IA Custo Benefício | Ranking de LLMs",
  description: "Descubra os melhores modelos de IA com o melhor custo-benefício. Ranking atualizado semanalmente.",
  keywords: ["LLM", "IA", "custo-benefício", "OpenRouter"],
  authors: [{ name: "IA Custo Benefício" }],
  openGraph: {
    title: "IA Custo Benefício",
    description: "Os melhores modelos de IA pelo menor preço.",
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
      <body className="antialiased min-h-screen">
        {/* Background Effects */}
        <div className="gradient-mesh" />
        <div className="noise-overlay" />
        <div className="scanlines" />
        
        {children}
      </body>
    </html>
  );
}
