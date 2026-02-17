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

export function RankingTable() {
  const [models, setModels] = useState<Model[]>([]);
  const [sortBy, setSortBy] = useState<"coding" | "general" | "price">("coding");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/models.json');
        const data = await response.json();
        setModels(data.models || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const sortedModels = [...models].sort((a, b) => {
    if (sortBy === "price") return a.pricing.prompt - b.pricing.prompt;
    if (sortBy === "coding") return b.cost_benefit_scores.coding - a.cost_benefit_scores.coding;
    return b.cost_benefit_scores.general - a.cost_benefit_scores.general;
  });

  const getScorePercentage = (score: number) => Math.min((score / 600) * 100, 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 data-card">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm text-[var(--text-dim)] uppercase tracking-wider">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { key: "coding", label: "Código", icon: "⚡" },
          { key: "general", label: "Geral", icon: "◆" },
          { key: "price", label: "Preço", icon: "◇" },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key as any)}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] border transition-all ${
              sortBy === option.key
                ? "bg-[var(--neon-cyan)] text-[var(--bg-primary)] border-[var(--neon-cyan)]"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
            }`}
          >
            <span className="mr-2 opacity-70">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="data-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="w-24 text-center">#</th>
                <th>Modelo</th>
                <th className="text-right w-32">Input</th>
                <th className="text-right w-32">Output</th>
                <th className="text-right w-56">Custo-Benefício</th>
              </tr>
            </thead>
            <tbody>
              {sortedModels.map((model, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                
                return (
                  <tr key={model.id} className="group">
                    <td className="text-center">
                      <div className={`rank-badge mx-auto ${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''}`}>
                        {String(rank).padStart(2, '0')}
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col">
                        <span className={`font-display text-lg ${isTop3 ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}`}>
                          {model.name}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
                          {model.provider}
                        </span>
                      </div>
                    </td>

                    <td className="text-right">
                      <div className="font-mono text-[var(--text-secondary)]">
                        ${model.pricing.prompt.toFixed(2)}
                        <span className="text-[var(--text-dim)] text-xs"> /1M</span>
                      </div>
                    </td>

                    <td className="text-right">
                      <div className="font-mono text-[var(--text-secondary)]">
                        ${model.pricing.completion.toFixed(2)}
                        <span className="text-[var(--text-dim)] text-xs"> /1M</span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-[var(--border-subtle)] overflow-hidden">
                          <div 
                            className="progress-fill h-full"
                            style={{ 
                              width: `${getScorePercentage(
                                sortBy === "price" 
                                  ? 100 - model.pricing.prompt 
                                  : sortBy === "coding" 
                                    ? model.cost_benefit_scores.coding 
                                    : model.cost_benefit_scores.general
                              )}%` 
                            }}
                          />
                        </div>
                        <span className="font-mono text-lg text-[var(--neon-cyan)] w-20 text-right">
                          {sortBy === "price" 
                            ? `$${model.pricing.prompt.toFixed(2)}`
                            : (sortBy === "coding" 
                              ? model.cost_benefit_scores.coding 
                              : model.cost_benefit_scores.general
                            ).toFixed(1)
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-[var(--text-dim)] font-mono text-xs">
        <span className="w-2 h-2 bg-[var(--neon-cyan)] rounded-full animate-pulse" />
        Dados atualizados automaticamente via OpenRouter API
      </div>
    </div>
  );
}
