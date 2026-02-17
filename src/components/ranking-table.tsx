"use client";

import { useState, useEffect } from "react";

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { prompt: number; completion: number };
  cost_benefit_scores: { coding: number; general: number };
}

export function RankingTable() {
  const [models, setModels] = useState<Model[]>([]);
  const [sortBy, setSortBy] = useState<"coding" | "general" | "price">("coding");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/models.json')
      .then(r => r.json())
      .then(data => {
        setModels(data.models || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...models].sort((a, b) => {
    if (sortBy === "price") return a.pricing.prompt - b.pricing.prompt;
    if (sortBy === "coding") return b.cost_benefit_scores.coding - a.cost_benefit_scores.coding;
    return b.cost_benefit_scores.general - a.cost_benefit_scores.general;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>Carregando...</div>;

  return (
    <div>
      {/* Filters */}
      <div className="filters">
        {[
          { k: "coding", l: "Código" },
          { k: "general", l: "Geral" },
          { k: "price", l: "Preço" },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setSortBy(f.k as any)}
            className={`filter-btn ${sortBy === f.k ? 'active' : ''}`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>#</th>
              <th>Modelo</th>
              <th style={{ textAlign: 'right' }}>Input</th>
              <th style={{ textAlign: 'right' }}>Output</th>
              <th style={{ textAlign: 'right', width: 180 }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => {
              const score = sortBy === "price" 
                ? m.pricing.prompt 
                : sortBy === "coding" 
                  ? m.cost_benefit_scores.coding 
                  : m.cost_benefit_scores.general;
              
              return (
                <tr key={m.id}>
                  <td>
                    <span className={`rank ${i < 3 ? `rank-${i+1}` : ''}`}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{m.name}</div>
                    <div className="font-mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      {m.provider}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono">${m.pricing.prompt.toFixed(2)}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono">${m.pricing.completion.toFixed(2)}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.min(score/6, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono" style={{ color: 'var(--accent)', width: 60, textAlign: 'right' }}>
                        {sortBy === "price" ? `$${score.toFixed(2)}` : score.toFixed(1)}
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
  );
}
