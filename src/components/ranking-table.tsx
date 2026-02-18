"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { RecommendationButton } from "./recommendation-button";

interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: { prompt: number; completion: number };
  cost_benefit_scores: { coding: number; general: number };
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
    const monthlyCost = calculateMonthlyCost(m.pricing);
    switch (activeCategory) {
      case "free":
        return monthlyCost === 0;
      case "under10":
        return monthlyCost > 0 && monthlyCost < 10;
      case "10to20":
        return monthlyCost >= 10 && monthlyCost <= 20;
      case "under50":
        return monthlyCost > 20 && monthlyCost < 50;
      case "unlimited":
        return true; // All models, sorted by power
      default:
        return true;
    }
  }).sort((a, b) => {
    if (activeCategory === "unlimited") {
      // Sort by coding score (power) for unlimited category
      return (b.cost_benefit_scores?.coding || 0) - (a.cost_benefit_scores?.coding || 0);
    }
    // Sort by cost-benefit score for other categories
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
              <th style={{ textAlign: 'right', width: 120 }}>{t.ranking.score}</th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((m, i) => {
              const score = m.cost_benefit_scores?.coding || 0;
              const progressWidth = Math.min((score / 100) * 100, 100);
              const isTop3 = i < 3;
              const monthlyCost = calculateMonthlyCost(m.pricing);
              
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
                    <div style={{
                      fontSize: 12,
                      color: 'var(--accent)',
                      marginTop: 4,
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      ~${monthlyCost.toFixed(2)}/mo est.
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 80 }}>
                        <div 
                          className="progress-fill"
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                      <span className="font-mono" style={{ 
                        color: 'var(--accent)', 
                        width: 50, 
                        textAlign: 'right',
                        fontSize: 16,
                        fontWeight: 600
                      }}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  <td>
                    {isTop3 && (
                      <RecommendationButton rank={i + 1} modelName={m.name} />
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
