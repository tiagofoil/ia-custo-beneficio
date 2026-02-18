import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Value | Melhor Custo-Benefício em IA",
  description: "Descubra os modelos de IA com melhor performance por dólar. Ranking atualizado de LLMs por custo-benefício.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
