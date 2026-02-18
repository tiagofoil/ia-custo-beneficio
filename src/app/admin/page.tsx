"use client";

import { useState, useEffect } from "react";

interface ModelForm {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing_prompt: number;
  pricing_completion: number;
  benchmark_arena_elo?: number;
  benchmark_swe_bench_full?: number;
  benchmark_intelligence_score?: number;
  cost_benefit_coding?: number;
  cost_benefit_general?: number;
  free_tier_is_free: boolean;
  free_tier_type: "local" | "api" | "";
  free_tier_provider: string;
  free_tier_limitations: string;
  free_tier_url: string;
  free_tier_requirements: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [form, setForm] = useState<ModelForm>({
    id: "",
    name: "",
    provider: "",
    context_length: 128000,
    pricing_prompt: 0,
    pricing_completion: 0,
    benchmark_arena_elo: undefined,
    benchmark_swe_bench_full: undefined,
    benchmark_intelligence_score: undefined,
    cost_benefit_coding: undefined,
    cost_benefit_general: undefined,
    free_tier_is_free: false,
    free_tier_type: "",
    free_tier_provider: "",
    free_tier_limitations: "",
    free_tier_url: "",
    free_tier_requirements: "",
  });

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchModels();
    } else {
      alert("Wrong password");
    }
  };

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/models");
      const data = await res.json();
      setModels(data.models || []);
    } catch (e) {
      setMessage("Error fetching models");
    }
    setLoading(false);
  };

  const saveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          id: form.id || `${form.provider}/${form.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: form.name,
          provider: form.provider,
          context_length: form.context_length,
          pricing: {
            prompt: form.pricing_prompt,
            completion: form.pricing_completion,
          },
          benchmarks: {
            arena_elo: form.benchmark_arena_elo,
            swe_bench_full: form.benchmark_swe_bench_full,
            intelligence_score: form.benchmark_intelligence_score,
          },
          cost_benefit_scores: {
            coding: form.cost_benefit_coding,
            general: form.cost_benefit_general,
          },
          free_tier: form.free_tier_is_free ? {
            is_free: true,
            type: form.free_tier_type,
            provider: form.free_tier_provider,
            limitations: form.free_tier_limitations,
            url: form.free_tier_url,
            requirements: form.free_tier_requirements,
          } : undefined,
          source: "manual",
        }),
      });
      
      if (res.ok) {
        setMessage("Model saved successfully!");
        setForm({
          id: "",
          name: "",
          provider: "",
          context_length: 128000,
          pricing_prompt: 0,
          pricing_completion: 0,
          free_tier_is_free: false,
          free_tier_type: "",
          free_tier_provider: "",
          free_tier_limitations: "",
          free_tier_url: "",
          free_tier_requirements: "",
        });
        fetchModels();
      } else {
        setMessage("Error saving model");
      }
    } catch (e) {
      setMessage("Error saving model");
    }
    
    setLoading(false);
  };

  const deleteModel = async (id: string) => {
    if (!confirm("Delete this model?")) return;
    
    try {
      await fetch(`/api/models?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${password}` },
      });
      fetchModels();
    } catch (e) {
      setMessage("Error deleting model");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "var(--bg)"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          padding: 40,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: 400,
          width: "100%",
        }}>
          <h1 style={{ marginBottom: 24, fontSize: 24 }}>Admin Login</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              color: "white",
              marginBottom: 16,
            }}
          />
          <button
            onClick={login}
            style={{
              width: "100%",
              padding: 12,
              background: "var(--accent)",
              color: "black",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 32 }}>Value Admin</h1>
      
      {message && (
        <div style={{ 
          padding: 16, 
          background: "rgba(0,212,255,0.1)", 
          borderRadius: 8,
          marginBottom: 24 
        }}
        >
          {message}
        </div>
      )}

      <!-- Add Model Form -->
      <div style={{ 
        background: "rgba(255,255,255,0.05)",
        padding: 24,
        borderRadius: 12,
        marginBottom: 40,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <h2 style={{ marginBottom: 24 }}>Add New Model</h2>
        
        <form onSubmit={saveModel}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <input
              placeholder="Model Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={formInputStyle}
              required
            />
            
            <input
              placeholder="Provider"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              style={formInputStyle}
              required
            />
            
            <input
              type="number"
              placeholder="Context Length"
              value={form.context_length}
              onChange={(e) => setForm({ ...form, context_length: parseInt(e.target.value) })}
              style={formInputStyle}
            />
            
            <input
              type="number"
              step="0.01"
              placeholder="Input Price ($/1M tokens)"
              value={form.pricing_prompt}
              onChange={(e) => setForm({ ...form, pricing_prompt: parseFloat(e.target.value) })}
              style={formInputStyle}
            />
            
            <input
              type="number"
              step="0.01"
              placeholder="Output Price ($/1M tokens)"
              value={form.pricing_completion}
              onChange={(e) => setForm({ ...form, pricing_completion: parseFloat(e.target.value) })}
              style={formInputStyle}
            />
            
            <input
              type="number"
              step="0.1"
              placeholder="SWE-bench Score (%)"
              value={form.benchmark_swe_bench_full || ""}
              onChange={(e) => setForm({ ...form, benchmark_swe_bench_full: parseFloat(e.target.value) })}
              style={formInputStyle}
            />
            
            <input
              type="number"
              placeholder="Intelligence Score"
              value={form.benchmark_intelligence_score || ""}
              onChange={(e) => setForm({ ...form, benchmark_intelligence_score: parseInt(e.target.value) })}
              style={formInputStyle}
            />
          </div>
          
          <!-- Free Tier Section -->
          <div style={{ marginTop: 24, padding: 16, background: "rgba(0,212,255,0.05)", borderRadius: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={form.free_tier_is_free}
                onChange={(e) => setForm({ ...form, free_tier_is_free: e.target.checked })}
              />
              <span>Free Tier</span>
            </label>
            
            {form.free_tier_is_free && (
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, 1fr)" }}>
                <select
                  value={form.free_tier_type}
                  onChange={(e) => setForm({ ...form, free_tier_type: e.target.value as "local" | "api" })}
                  style={formInputStyle}
                >
                  <option value="">Select Type...</option>
                  <option value="api">API</option>
                  <option value="local">Local</option>
                </select>
                
                <input
                  placeholder="Free Provider (e.g., Groq)"
                  value={form.free_tier_provider}
                  onChange={(e) => setForm({ ...form, free_tier_provider: e.target.value })}
                  style={formInputStyle}
                />
                
                <input
                  placeholder="Limitations (e.g., Rate limited)"
                  value={form.free_tier_limitations}
                  onChange={(e) => setForm({ ...form, free_tier_limitations: e.target.value })}
                  style={formInputStyle}
                />
                
                <input
                  placeholder="URL to get free access"
                  value={form.free_tier_url}
                  onChange={(e) => setForm({ ...form, free_tier_url: e.target.value })}
                  style={formInputStyle}
                />
                
                <input
                  placeholder="Requirements (for local models)"
                  value={form.free_tier_requirements}
                  onChange={(e) => setForm({ ...form, free_tier_requirements: e.target.value })}
                  style={formInputStyle}
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              background: "var(--accent)",
              color: "black",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Model"}
          </button>
        </form>
      </div>

      <!-- Models List -->
      <h2 style={{ marginBottom: 16 }}>Existing Models ({models.length})</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {models.map((m: any) => (
            <div
              key={m.id}
              style={{
                padding: 16,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{m.name}</strong>
                <span style={{ color: "var(--text-dim)", marginLeft: 8 }}>
                  ({m.provider})
                </span>
                {m.free_tier?.is_free && (
                  <span style={{ 
                    marginLeft: 8,
                    padding: "2px 8px",
                    background: "var(--accent)",
                    color: "black",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    FREE
                  </span>
                )}
              </div>
              
              <button
                onClick={() => deleteModel(m.id)}
                style={{
                  padding: "8px 16px",
                  background: "rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.4)",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const formInputStyle = {
  padding: 12,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 8,
  color: "white",
};
