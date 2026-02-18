"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { prompt: number; completion: number };
  cost_benefit_scores: { coding: number; general: number };
}

export function RankingTable() {
  const { t } = useI18n();
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

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 12 
        }}>
          <div style={{
            width: 24,
            height: 24,
            border: '2px solid var(--accent)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{t.ranking.title}...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="filters">
        {[
          { k: "coding", l: t.ranking.filterCoding },
          { k: "general", l: t.ranking.filterGeneral },
          { k: "price", l: t.ranking.filterPrice },
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
              <th style={{ width: 80 }}>{t.ranking.rank}</th>
              <th>{t.ranking.model}</th>
              <th style={{ textAlign: 'right', width: 120 }}>{t.ranking.inputPrice}</th>
              <th style={{ textAlign: 'right', width: 120 }}>{t.ranking.outputPrice}</th>
              <th style={{ textAlign: 'right', width: 200 }}>{t.ranking.score}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => {
              const score = sortBy === "price" 
                ? m.pricing.prompt 
                : sortBy === "coding" 
                  ? m.cost_benefit_scores.coding 
                  : m.cost_benefit_scores.general;
              
              const progressWidth = Math.min((score / 600) * 100, 100);
              
              return (
                <tr key={m.id}>
                  <td>
                    <span className={`rank ${i < 3 ? `rank-${i+1}` : ''}`}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                  </td>
                  
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{m.name}</div>
                    <div className="font-mono" style={{ 
                      fontSize: 13, 
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      marginTop: 4
                    }}>
                      {m.provider}
                    </div>
                  </td>
                  
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono" style={{ fontSize: 15 }}>
                      ${m.pricing.prompt.toFixed(2)}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{t.ranking.per1MTokens}</div>
                  </td>
                  
                  <td style={{ textAlign: 'right' }}>
                    <span className="font-mono" style={{ fontSize: 15 }}>
                      ${m.pricing.completion.toFixed(2)}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{t.ranking.per1MTokens}</div>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div 
                          className="progress-fill"
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                      <span className="font-mono" style={{ 
                        color: 'var(--accent)', 
                        width: 70, 
                        textAlign: 'right',
                        fontSize: 18,
                        fontWeight: 600
                      }}>
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

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 10,
        marginTop: 24,
        color: 'var(--text-dim)',
        fontSize: 14
      }}>
        <span style={{
          width: 8,
          height: 8,
          background: 'var(--accent)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
        
        <span>{t.ranking.updatedVia}</span>
      </div>
    </div>
  );
}
