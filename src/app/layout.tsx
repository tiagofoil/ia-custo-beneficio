import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IA Custo Benefício | Ranking de LLMs",
  description: "Descubra os melhores modelos de IA com o melhor custo-benefício.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
