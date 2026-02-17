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

  const getRankClass = (rank: number) => {
    if (rank === 0) return "rank-1";
    if (rank === 1) return "rank-2";
    if (rank === 2) return "rank-3";
    return "";
  };

  const getScorePercentage = (score: number) => {
    return Math.min((score / 600) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 terminal-block">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-[var(--accent-cyan)] animate-pulse" />
          <span className="font-mono text-sm text-[var(--text-muted)]">CARREGANDO DADOS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "coding", label: "Código", icon: "💻" },
          { key: "general", label: "Geral", icon: "🧠" },
          { key: "price", label: "Preço", icon: "💰" },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key as any)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all ${
              sortBy === option.key
                ? "bg-[var(--accent-cyan)] text-[var(--bg-primary)] border-[var(--accent-cyan)]"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] hover:text-white"
            }`}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="terminal-block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-24">#Rank</th>
                <th className="w-full">Modelo</th>
                <th className="text-right w-32">Input</th>
                <th className="text-right w-32">Output</th>
                <th className="text-right w-64">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedModels.map((model, index) => (
                <tr key={model.id} className="group">
                  <td>
                    <div className={`rank-number ${getRankClass(index)}`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </td>

                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-lg">{model.name}</span>
                      <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        {model.provider}
                      </span>
                    </div>
                  </td>

                  <td className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-white">
                        ${model.pricing.prompt.toFixed(2)}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">/1M tokens</span>
                    </div>
                  </td>

                  <td className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-white">
                        ${model.pricing.completion.toFixed(2)}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">/1M tokens</span>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 progress-bar">
                        <div 
                          className="progress-bar-fill"
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
                      <span className="font-mono text-lg text-[var(--accent-cyan)] w-16 text-right">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-xs">
        <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-pulse" />
        Dados atualizados automaticamente via OpenRouter API
      </div>
    </div>
  );
}
