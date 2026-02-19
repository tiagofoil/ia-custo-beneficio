"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { RecommendationButton } from "./recommendation-button";

interface Benchmarks {
  swe_bench?: number | null;
  agentic?: number | null;
  intelligence?: number | null;
  bfcl?: number | null;
  arena_elo?: number | null;
  aider?: number | null;
  composite?: number;
}

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { prompt: number; completion: number };
  performance: Benchmarks;
  scores: {
    performance: number;
    value: number;
    intermediate: number;
  };
  rank?: number;
  monthly_cost?: number;
  context_length?: number;
}

type Category = "cost-savings" | "intermediate" | "best-performance";

interface CategoryFilter {
  key: Category;
  label: string;
  description: string;
}

export function RankingTable() {
  const { t } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("intermediate");
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const categories: CategoryFilter[] = [
    { 
      key: "cost-savings", 
      label: "Cost Savings", 
      description: "Best price for your budget" 
    },
    { 
      key: "intermediate", 
      label: "Balanced", 
      description: "70% Performance / 30% Price" 
    },
    { 
      key: "best-performance", 
      label: "Best Performance", 
      description: "Maximum coding power" 
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/models?category=${activeCategory}`)
      .then(r => r.json())
      .then(data => {
        setModels(data.models || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const formatBenchmark = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return "—";
    return val.toFixed(1);
  };

  const getScoreDisplay = (m: Model) => {
    switch (activeCategory) {
      case 'cost-savings':
        return { value: m.monthly_cost || 0, label: '$/mo', isPrice: true };
      case 'best-performance':
        return { value: m.scores?.performance || 0, label: 'Perf', isPrice: false };
      case 'intermediate':
      default:
        return { value: m.scores?.intermediate || 0, label: 'Score', isPrice: false };
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 24, height: 24,
            border: '2px solid var(--accent)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, marginBottom: 8 }}>
          {activeCategory === 'cost-savings' && 'Best Value for Money'}
          {activeCategory === 'intermediate' && 'Balanced Performance & Price'}
          {activeCategory === 'best-performance' && 'Maximum Coding Power'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          {activeCategory === 'cost-savings' && 'Ranked by lowest price per token'}
          {activeCategory === 'intermediate' && '70% Performance weight + 30% Price weight'}
          {activeCategory === 'best-performance' && 'Ranked by coding benchmarks only'}
        </p>
      </div>

      {/* Category Filters */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 12, 
        justifyContent: 'center',
        marginBottom: 32 
      }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              background: activeCategory === cat.key 
                ? 'var(--accent)' 
                : 'rgba(255, 255, 255, 0.05)',
              color: activeCategory === cat.key ? '#000' : 'var(--text)',
              border: `1px solid ${activeCategory === cat.key ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 12,
              padding: '16px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {cat.label}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, fontFamily: 'JetBrains Mono, monospace' }}>
              {cat.description}
            </div>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ textAlign: 'center', marginBottom: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
        Showing {models.length} models
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Rank</th>
              <th>Model</th>
              <th style={{ textAlign: 'right', width: 100 }}>Input</th>
              <th style={{ textAlign: 'right', width: 100 }}>Output</th>
              <th style={{ textAlign: 'center', width: 100 }}>SWE-bench</th>
              <th style={{ textAlign: 'center', width: 100 }}>Intelligence</th>
              <th style={{ textAlign: 'center', width: 80 }}>Arena</th>
              <th style={{ textAlign: 'right', width: 100 }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => {
              const score = getScoreDisplay(m);
              const isTop3 = i < 3;
              
              return (
                <>
                  <tr 
                    key={m.id}
                    onClick={() => setExpandedRow(expandedRow === m.id ? null : m.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span className={`rank ${i < 3 ? `rank-${i+1}` : ''}`}>
                        {String(i+1).padStart(2,'0')}
                      </span>
                    </td>
                    
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{m.name}</div>
                      <div className="font-mono" style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        {m.provider}
                      </div>
                    </td>
                    
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono">${m.pricing.prompt.toFixed(2)}</span>
                    </td>
                    
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono">${m.pricing.completion.toFixed(2)}</span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ 
                        color: m.performance.swe_bench ? '#10B981' : 'var(--text-dim)',
                        fontWeight: m.performance.swe_bench ? 600 : 400
                      }}>
                        {formatBenchmark(m.performance.swe_bench)}%
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ color: m.performance.intelligence ? 'var(--text)' : 'var(--text-dim)' }}>
                        {formatBenchmark(m.performance.intelligence)}
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ color: m.performance.arena_elo ? 'var(--text)' : 'var(--text-dim)' }}>
                        {m.performance.arena_elo ? Math.round(m.performance.arena_elo) : '—'}
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono" style={{ 
                        color: 'var(--accent)', 
                        fontWeight: 700,
                        fontSize: 15
                      }}>
                        {score.isPrice 
                          ? `~$${score.value.toFixed(2)}`
                          : score.value.toFixed(1)
                        }
                      </span>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{score.label}</div>
                    </td>
                  </tr>
                  
                  {/* Expanded row */}
                  {expandedRow === m.id && (
                    <tr>
                      <td colSpan={8} style={{ background: 'rgba(0,0,0,0.3)', padding: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--text-dim)' }}>Model Details</h4>
                            <p style={{ margin: 0, fontSize: 13 }}>Context: {(m.context_length || 0).toLocaleString()} tokens</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>Est. monthly: ${m.monthly_cost?.toFixed(2)}</p>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--text-dim)' }}>All Benchmarks</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 13 }}>
                              <span>SWE-bench:</span> <span>{formatBenchmark(m.performance.swe_bench)}%</span>
                              <span>Intelligence:</span> <span>{formatBenchmark(m.performance.intelligence)}</span>
                              <span>Arena ELO:</span> <span>{m.performance.arena_elo ? Math.round(m.performance.arena_elo) : '—'}</span>
                              <span>Agentic:</span> <span>{formatBenchmark(m.performance.agentic)}</span>
                              <span>BFCL:</span> <span>{formatBenchmark(m.performance.bfcl)}</span>
                              <span>Aider:</span> <span>{formatBenchmark(m.performance.aider)}%</span>
                            </div>
                          </div>
                          
                          {isTop3 && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <RecommendationButton rank={i + 1} modelName={m.name} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-dim)', fontSize: 13 }}>
        Click on any row to see detailed benchmark data
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        marginTop: 32,
        padding: 20,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        fontSize: 13,
        color: 'var(--text-secondary)'
      }}>
        <span><strong>SWE-bench:</strong> % real GitHub issues resolved</span>
        <span><strong>Intelligence:</strong> Artificial Analysis index</span>
        <span><strong>Arena:</strong> Chatbot Arena ELO</span>
        <span><strong>Composite:</strong> Weighted performance score</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, color: 'var(--text-dim)', fontSize: 14 }}>
        <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        <span>{t.ranking.updatedVia}</span>
      </div>
    </div>
  );
}
