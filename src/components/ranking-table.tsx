"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { RecommendationButton } from "./recommendation-button";

interface FreeTier {
  is_free: boolean;
  type: "local" | "api";
  provider: string;
  limitations?: string;
  url?: string;
  requirements?: string;
}

interface Benchmarks {
  swe_bench?: number | null;
  agentic?: number | null;
  intelligence?: number | null;
  bfcl?: number | null;
  arena_elo?: number | null;
  aider?: number | null;
}

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { prompt: number; completion: number };
  cost_benefit_scores: { coding: number; general: number };
  benchmarks: Benchmarks;
  free_tier?: FreeTier;
  rank?: number;
  monthly_cost?: number;
  context_length?: number;
}

type PriceCategory = "free" | "under10" | "10to20" | "under50" | "unlimited";
type ViewMode = "value" | "performance" | "all";

interface PriceFilter {
  key: PriceCategory;
  label: string;
  description: string;
}

export function RankingTable() {
  const { t } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [activeCategory, setActiveCategory] = useState<PriceCategory>("under10");
  const [viewMode, setViewMode] = useState<ViewMode>("value");
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const priceFilters: PriceFilter[] = [
    { key: "free", label: "$0.00", description: "Free" },
    { key: "under10", label: "Under $10", description: "/ month" },
    { key: "10to20", label: "$10 - $20", description: "/ month" },
    { key: "under50", label: "Under $50", description: "/ month" },
    { key: "unlimited", label: "Unlimited", description: "Power First" },
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

  const isUnlimited = activeCategory === 'unlimited';

  // Helper to format benchmark value
  const formatBenchmark = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return "—";
    return val.toFixed(1);
  };

  // Calculate display score based on view mode
  const getDisplayScore = (m: Model): { value: number; label: string; suffix: string } => {
    if (isUnlimited || viewMode === 'performance') {
      // For performance, prioritize: SWE-bench > Intelligence > Arena
      const perf = m.benchmarks.swe_bench || m.benchmarks.intelligence || m.benchmarks.arena_elo || 0;
      return { value: perf, label: 'Perf', suffix: perf > 100 ? '' : '%' };
    }
    // Value mode
    return { 
      value: m.cost_benefit_scores?.coding || 0, 
      label: 'Value', 
      suffix: '' 
    };
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
        <h2 style={{ 
          fontSize: 'clamp(24px, 4vw, 32px)', 
          fontWeight: 700,
          marginBottom: 8 
        }}>
          {viewMode === 'performance' ? 'Performance Rankings' : 'Best Value for Coding'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          {viewMode === 'performance' 
            ? 'Ranked by coding benchmarks (SWE-bench, Intelligence, Arena)' 
            : 'Ranked by price/performance ratio'}
        </p>
      </div>

      {/* View Mode Toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24 
      }}>
        <button
          onClick={() => setViewMode('value')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: viewMode === 'value' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
            color: viewMode === 'value' ? '#000' : 'var(--text)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Value (Price/Perf)
        </button>
        <button
          onClick={() => setViewMode('performance')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: viewMode === 'performance' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
            color: viewMode === 'performance' ? '#000' : 'var(--text)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Performance
        </button>
      </div>

      {/* Price Category Filters */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 12, 
        justifyContent: 'center',
        marginBottom: 32 
      }}>
        {priceFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveCategory(filter.key)}
            style={{
              background: activeCategory === filter.key 
                ? 'var(--accent)' 
                : 'rgba(255, 255, 255, 0.05)',
              color: activeCategory === filter.key ? '#000' : 'var(--text)',
              border: `1px solid ${activeCategory === filter.key ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 12,
              padding: '16px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {filter.label}
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, fontFamily: 'JetBrains Mono, monospace' }}>
              {filter.description}
            </div>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ textAlign: 'center', marginBottom: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
        Showing {models.length} models {viewMode === 'performance' && '(sorted by performance benchmarks)'}
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
              <th style={{ textAlign: 'center', width: 120 }}>SWE-bench</th>
              <th style={{ textAlign: 'center', width: 100 }}>Intelligence</th>
              <th style={{ textAlign: 'center', width: 80 }}>BFCL</th>
              <th style={{ textAlign: 'center', width: 90 }}>Arena</th>
              <th style={{ textAlign: 'center', width: 80 }}>Aider</th>
              <th style={{ textAlign: 'right', width: 100 }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => {
              const isTop3 = i < 3;
              const score = getDisplayScore(m);
              const hasBenchmarks = m.benchmarks.swe_bench || m.benchmarks.intelligence || m.benchmarks.arena_elo;
              
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
                      {!hasBenchmarks && (
                        <span style={{ fontSize: 10, color: '#F59E0B', marginTop: 4, display: 'block' }}>
                          Missing benchmark data
                        </span>
                      )}
                    </td>
                    
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono">${m.pricing.prompt.toFixed(2)}</span>
                    </td>
                    
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono">${m.pricing.completion.toFixed(2)}</span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ 
                        color: m.benchmarks.swe_bench ? '#10B981' : 'var(--text-dim)',
                        fontWeight: m.benchmarks.swe_bench ? 600 : 400
                      }}>
                        {formatBenchmark(m.benchmarks.swe_bench)}%
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ color: m.benchmarks.intelligence ? 'var(--text)' : 'var(--text-dim)' }}>
                        {formatBenchmark(m.benchmarks.intelligence)}
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ color: m.benchmarks.bfcl ? 'var(--text)' : 'var(--text-dim)' }}>
                        {formatBenchmark(m.benchmarks.bfcl)}
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ color: m.benchmarks.arena_elo ? 'var(--text)' : 'var(--text-dim)' }}>
                        {m.benchmarks.arena_elo ? Math.round(m.benchmarks.arena_elo) : '—'}
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <span className="font-mono" style={{ color: m.benchmarks.aider ? 'var(--text)' : 'var(--text-dim)' }}>
                        {formatBenchmark(m.benchmarks.aider)}%
                      </span>
                    </td>
                    
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono" style={{ 
                        color: 'var(--accent)', 
                        fontWeight: 700,
                        fontSize: 15
                      }}>
                        {score.value > 0 ? `${score.value.toFixed(score.value > 100 ? 0 : 1)}${score.suffix}` : '—'}
                      </span>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{score.label}</div>
                    </td>
                  </tr>
                  
                  {/* Expanded row with details */}
                  {expandedRow === m.id && (
                    <tr>
                      <td colSpan={10} style={{ background: 'rgba(0,0,0,0.3)', padding: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--text-dim)' }}>Model Details</h4>
                            <p style={{ margin: 0, fontSize: 13 }}>Context: {(m.context_length || 0).toLocaleString()} tokens</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>Est. monthly: ${m.monthly_cost?.toFixed(2)}</p>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--text-dim)' }}>All Benchmarks</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 13 }}>
                              <span>SWE-bench:</span> <span style={{ color: m.benchmarks.swe_bench ? '#10B981' : 'var(--text-dim)' }}>{formatBenchmark(m.benchmarks.swe_bench)}%</span>
                              <span>Agentic:</span> <span style={{ color: m.benchmarks.agentic ? 'var(--text)' : 'var(--text-dim)' }}>{formatBenchmark(m.benchmarks.agentic)}</span>
                              <span>Intelligence:</span> <span style={{ color: m.benchmarks.intelligence ? 'var(--text)' : 'var(--text-dim)' }}>{formatBenchmark(m.benchmarks.intelligence)}</span>
                              <span>BFCL:</span> <span style={{ color: m.benchmarks.bfcl ? 'var(--text)' : 'var(--text-dim)' }}>{formatBenchmark(m.benchmarks.bfcl)}</span>
                              <span>Arena ELO:</span> <span style={{ color: m.benchmarks.arena_elo ? 'var(--text)' : 'var(--text-dim)' }}>{m.benchmarks.arena_elo ? Math.round(m.benchmarks.arena_elo) : '—'}</span>
                              <span>Aider:</span> <span style={{ color: m.benchmarks.aider ? 'var(--text)' : 'var(--text-dim)' }}>{formatBenchmark(m.benchmarks.aider)}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--text-dim)' }}>Pricing</h4>
                            <p style={{ margin: 0, fontSize: 13 }}>Input: ${m.pricing.prompt}/1M tokens</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>Output: ${m.pricing.completion}/1M tokens</p>
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
        <span><strong>SWE-bench:</strong> % of real GitHub issues resolved</span>
        <span><strong>Intelligence:</strong> Artificial Analysis index (0-100)</span>
        <span><strong>BFCL:</strong> Function calling ability (0-100)</span>
        <span><strong>Arena:</strong> Chatbot Arena ELO rating</span>
        <span><strong>Aider:</strong> Multi-language coding %</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, color: 'var(--text-dim)', fontSize: 14 }}>
        <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        <span>{t.ranking.updatedVia}</span>
      </div>
    </div>
  );
}
