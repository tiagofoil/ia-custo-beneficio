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

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { prompt: number; completion: number };
  cost_benefit_scores: { coding: number; general: number };
  benchmarks?: {
    arena_elo?: number;
    swe_bench_full?: number;
    intelligence_score?: number;
  };
  free_tier?: FreeTier;
}

type PriceCategory = "free" | "under10" | "10to20" | "under50" | "unlimited";

interface PriceFilter {
  key: PriceCategory;
  label: string;
  description: string;
}

export function RankingTable() {
  const { t } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [activeCategory, setActiveCategory] = useState<PriceCategory>("under10");
  const [loading, setLoading] = useState(true);

  const priceFilters: PriceFilter[] = [
    { key: "free", label: "$0.00", description: "Free" },
    { key: "under10", label: "Under $10", description: "/ month" },
    { key: "10to20", label: "$10 - $20", description: "/ month" },
    { key: "under50", label: "Under $50", description: "/ month" },
    { key: "unlimited", label: "Unlimited", description: "Power First" },
  ];

  useEffect(() => {
    fetch('/data/models.json')
      .then(r => r.json())
      .then(data => {
        setModels(data.models || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Calculate monthly cost based on pricing (assuming ~1M tokens input + 500K output per month)
  const calculateMonthlyCost = (pricing: { prompt: number; completion: number }): number => {
    const inputCost = pricing.prompt * 1; // 1M input tokens
    const outputCost = pricing.completion * 0.5; // 500K output tokens
    return inputCost + outputCost;
  };

  // Filter and sort models based on active category
  const filteredModels = models.filter((m) => {
    // If has free_tier and is_free, show in "free" category
    if (activeCategory === "free") {
      return m.free_tier?.is_free === true;
    }
    
    const monthlyCost = calculateMonthlyCost(m.pricing);
    switch (activeCategory) {
      case "under10":
        return monthlyCost > 0 && monthlyCost < 10;
      case "10to20":
        return monthlyCost >= 10 && monthlyCost <= 20;
      case "under50":
        return monthlyCost > 20 && monthlyCost < 50;
      case "unlimited":
        return true;
      default:
        return true;
    }
  }).sort((a, b) => {
    if (activeCategory === "free") {
      // Sort free models by intelligence score
      return (b.benchmarks?.intelligence_score || 0) - (a.benchmarks?.intelligence_score || 0);
    }
    if (activeCategory === "unlimited") {
      // Sort by pure coding power (SWE-bench score) - no price consideration
      return (b.benchmarks?.swe_bench_full || 0) - (a.benchmarks?.swe_bench_full || 0);
    }
    // Other categories sort by cost-benefit
    return (b.cost_benefit_scores?.coding || 0) - (a.cost_benefit_scores?.coding || 0);
  });

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
          <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{t.ranking.title}...</span>
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
          Best Price for Coding Power
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Find the perfect LLM for your budget
        </p>
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
            <div style={{ 
              fontSize: 20, 
              fontWeight: 700,
              marginBottom: 4 
            }}>
              {filter.label}
            </div>
            <div style={{ 
              fontSize: 13, 
              opacity: 0.8,
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {filter.description}
            </div>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 24,
        color: 'var(--text-secondary)',
        fontSize: 14 
      }}>
        Showing {filteredModels.length} models
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
              <th style={{ textAlign: 'right', width: 140 }}>
                {activeCategory === 'unlimited' ? 'Coding Power' : t.ranking.score}
              </th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((m, i) => {
              // For unlimited category, show SWE-bench score (pure coding power)
              // For other categories, show cost-benefit score
              const isUnlimited = activeCategory === 'unlimited';
              const score = isUnlimited 
                ? (m.benchmarks?.swe_bench_full || 0) 
                : (m.cost_benefit_scores?.coding || 0);
              const maxScore = isUnlimited ? 100 : 100; // SWE-bench max around 80-90%
              const progressWidth = Math.min((score / maxScore) * 100, 100);
              const isTop3 = i < 3;
              const monthlyCost = calculateMonthlyCost(m.pricing);
              const isFree = m.free_tier?.is_free;
              const isLocal = m.free_tier?.type === "local";
              
              return (
                <tr key={m.id}>
                  <td>
                    <span className={`rank ${i < 3 ? `rank-${i+1}` : ''}`}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 17 }}>{m.name}</span>
                      
                      {isFree && (
                        <span
                          style={{
                            background: isLocal ? '#10B981' : '#00D4FF',
                            color: '#000',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: 'JetBrains Mono, monospace',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {isLocal ? (
                            <>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                              </svg>
                              LOCAL
                            </>
                          ) : (
                            <>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              FREE
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    
                    <div className="font-mono" style={{ 
                      fontSize: 13, 
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      marginTop: 4
                    }}>
                      {m.provider}
                    </div>
                    
                    {isFree && m.free_tier && (
                      <>
                        <div style={{
                          fontSize: 11,
                          color: isLocal ? '#10B981' : 'var(--accent)',
                          marginTop: 4,
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {isLocal ? (
                            <span>Runs locally • {m.free_tier.requirements}</span>
                          ) : (
                            <span>Free tier • {m.free_tier.provider} • {m.free_tier.limitations}</span>
                          )}
                        </div>
                        {m.free_tier.url && (
                          <a 
                            href={m.free_tier.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: 11,
                              color: 'var(--accent)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              marginTop: 4,
                            }}
                          >
                            Get free access 
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 17L17 7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </a>
                        )}
                      </>
                    )}
                    
                    {!isFree && monthlyCost > 0 && (
                      <div style={{
                        fontSize: 12,
                        color: 'var(--accent)',
                        marginTop: 4,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        ~${monthlyCost.toFixed(2)}/mo est.
                      </div>
                    )}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 80 }}>
                        <div 
                          className="progress-fill"
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                      <span className="font-mono" style={{ 
                        color: 'var(--accent)', 
                        width: 60, 
                        textAlign: 'right',
                        fontSize: 16,
                        fontWeight: 600
                      }}>
                        {isFree ? 'N/A' : score.toFixed(isUnlimited ? 0 : 1)}
                        {isUnlimited && !isFree && (
                          <span style={{ fontSize: 11, opacity: 0.7 }}>%</span>
                        )}
                      </span>
                    </div>
                    {isUnlimited && !isFree && m.benchmarks?.swe_bench_full && (
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, textAlign: 'right' }}>
                        SWE-bench
                      </div>
                    )}
                  </td>

                  <td>
                    {isTop3 && !isFree && (
                      <RecommendationButton rank={i + 1} modelName={m.name} />
                    )}
                    {isFree && (
                      <a
                        href={m.free_tier?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '10px 16px',
                          background: isLocal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 212, 255, 0.2)',
                          color: isLocal ? '#10B981' : 'var(--accent)',
                          border: `1px solid ${isLocal ? 'rgba(16, 185, 129, 0.4)' : 'rgba(0, 212, 255, 0.4)'}`,
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        {isLocal ? 'Install' : 'Try Free'}
                      </a>
                    )}
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
          width: 8, height: 8,
          background: 'var(--accent)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        <span>{t.ranking.updatedVia}</span>
      </div>
    </div>
  );
}
