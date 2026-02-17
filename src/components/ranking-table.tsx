"use client";

import { useState, useEffect } from "react";

interface Model {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  benchmarks: {
    arena_elo: number | null;
    swe_bench_full: number | null;
    intelligence_score: number | null;
  };
  cost_benefit_scores: {
    coding: number;
    general: number;
  };
}

// Dados de exemplo para desenvolvimento
const SAMPLE_MODELS: Model[] = [
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    context_length: 128000,
    pricing: { prompt: 0.15, completion: 0.6 },
    benchmarks: { arena_elo: 1250, swe_bench_full: 12.5, intelligence_score: 82 },
    cost_benefit_scores: { coding: 83.3, general: 546.7 },
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    context_length: 200000,
    pricing: { prompt: 0.25, completion: 1.25 },
    benchmarks: { arena_elo: 1180, swe_bench_full: 8.5, intelligence_score: 78 },
    cost_benefit_scores: { coding: 34.0, general: 312.0 },
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    context_length: 64000,
    pricing: { prompt: 0.14, completion: 0.28 },
    benchmarks: { arena_elo: 1280, swe_bench_full: 42.0, intelligence_score: 85 },
    cost_benefit_scores: { coding: 300.0, general: 607.1 },
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    context_length: 1000000,
    pricing: { prompt: 1.25, completion: 5.0 },
    benchmarks: { arena_elo: 1320, swe_bench_full: 63.8, intelligence_score: 92 },
    cost_benefit_scores: { coding: 51.0, general: 73.6 },
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    context_length: 200000,
    pricing: { prompt: 3.0, completion: 15.0 },
    benchmarks: { arena_elo: 1280, swe_bench_full: 27.0, intelligence_score: 88 },
    cost_benefit_scores: { coding: 9.0, general: 29.3 },
  },
];

export function RankingTable() {
  const [models, setModels] = useState<Model[]>(SAMPLE_MODELS);
  const [sortBy, setSortBy] = useState<"price" | "coding" | "general">("coding");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const sortedModels = [...models].sort((a, b) => {
    if (sortBy === "price") {
      return a.pricing.prompt - b.pricing.prompt;
    } else if (sortBy === "coding") {
      return b.cost_benefit_scores.coding - a.cost_benefit_scores.coding;
    } else {
      return b.cost_benefit_scores.general - a.cost_benefit_scores.general;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin" />
          <span className="text-[#808080]">Carregando modelos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSortBy("coding")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            sortBy === "coding"
              ? "bg-[#00D9FF] text-[#0A0A0A]"
              : "bg-[#1E1E1E] text-[#808080] hover:text-[#EAEAEA] border border-[#2A2A2A]"
          }`}
        >
          💻 Código (SWE-bench)
        </button>
        <button
          onClick={() => setSortBy("general")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            sortBy === "general"
              ? "bg-[#00D9FF] text-[#0A0A0A]"
              : "bg-[#1E1E1E] text-[#808080] hover:text-[#EAEAEA] border border-[#2A2A2A]"
          }`}
        >
          🧠 Geral (Intelligence)
        </button>
        <button
          onClick={() => setSortBy("price")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            sortBy === "price"
              ? "bg-[#00D9FF] text-[#0A0A0A]"
              : "bg-[#1E1E1E] text-[#808080] hover:text-[#EAEAEA] border border-[#2A2A2A]"
          }`}
        >
          💰 Preço (Input)
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#141414] rounded-xl border border-[#2A2A2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1E1E1E]">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-[#808080] uppercase tracking-wider">
                  Rank
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[#808080] uppercase tracking-wider">
                  Modelo
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[#808080] uppercase tracking-wider">
                  Preço Input
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[#808080] uppercase tracking-wider">
                  Preço Output
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-[#808080] uppercase tracking-wider">
                  {sortBy === "coding" ? "Custo-Benefício 💻" : sortBy === "general" ? "Custo-Benefício 🧠" : "Contexto"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {sortedModels.map((model, index) => (
                <tr
                  key={model.id}
                  className="hover:bg-[#1E1E1E] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index < 3
                            ? "bg-[#00D9FF]/10 text-[#00D9FF]"
                            : "bg-[#1E1E1E] text-[#808080]"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <span className="text-lg">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-[#EAEAEA]">{model.name}</span>
                      <span className="text-sm text-[#666666]">{model.provider}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-[#EAEAEA]">
                      ${model.pricing.prompt.toFixed(2)}
                    </span>
                    <span className="text-sm text-[#666666] ml-1">/1M</span>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-[#EAEAEA]">
                      ${model.pricing.completion.toFixed(2)}
                    </span>
                    <span className="text-sm text-[#666666] ml-1">/1M</span>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    {sortBy === "price" ? (
                      <span className="font-mono text-[#EAEAEA]">
                        {(model.context_length / 1000).toFixed(0)}k
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00D9FF] rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (sortBy === "coding"
                                  ? model.cost_benefit_scores.coding
                                  : model.cost_benefit_scores.general) / 10,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[#00D9FF] w-16 text-right">
                          {sortBy === "coding"
                            ? model.cost_benefit_scores.coding.toFixed(1)
                            : model.cost_benefit_scores.general.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-sm text-[#666666]">
        💡 Clique nos botões acima para ordenar por diferentes critérios
      </p>
    </div>
  );
}
