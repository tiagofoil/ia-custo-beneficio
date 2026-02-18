-- Schema para o projeto Value
CREATE SCHEMA IF NOT EXISTS value;

-- Tabela principal de modelos LLM
CREATE TABLE IF NOT EXISTS value.models (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    context_length INTEGER,
    
    -- Preços (por 1M tokens)
    pricing_prompt DECIMAL(10, 4) NOT NULL DEFAULT 0,
    pricing_completion DECIMAL(10, 4) NOT NULL DEFAULT 0,
    
    -- Benchmarks
    benchmark_arena_elo INTEGER,
    benchmark_swe_bench_full DECIMAL(5, 2),
    benchmark_intelligence_score INTEGER,
    
    -- Scores calculados (opcional, pode ser calculado on-the-fly)
    cost_benefit_coding DECIMAL(10, 2),
    cost_benefit_general DECIMAL(10, 2),
    
    -- Free tier info
    free_tier_is_free BOOLEAN DEFAULT FALSE,
    free_tier_type VARCHAR(20), -- 'local' ou 'api'
    free_tier_provider VARCHAR(100),
    free_tier_limitations TEXT,
    free_tier_url TEXT,
    free_tier_requirements TEXT,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50), -- 'manual', 'perplexity', 'openrouter'
    is_active BOOLEAN DEFAULT TRUE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_models_provider ON value.models(provider);
CREATE INDEX IF NOT EXISTS idx_models_free ON value.models(free_tier_is_free) WHERE free_tier_is_free = TRUE;
CREATE INDEX IF NOT EXISTS idx_models_active ON value.models(is_active);

-- View para ranking "Unlimited Power First" (SWE-bench)
CREATE OR REPLACE VIEW value.rank_unlimited AS
SELECT 
    id, name, provider, context_length,
    pricing_prompt, pricing_completion,
    benchmark_swe_bench_full,
    benchmark_intelligence_score,
    free_tier_is_free, free_tier_type, free_tier_provider, free_tier_url,
    ROW_NUMBER() OVER (ORDER BY benchmark_swe_bench_full DESC NULLS LAST) as rank
FROM value.models
WHERE is_active = TRUE
ORDER BY benchmark_swe_bench_full DESC NULLS LAST;

-- View para estimativa de custo mensal
CREATE OR REPLACE VIEW value.models_with_monthly_cost AS
SELECT 
    *,
    (pricing_prompt * 1 + pricing_completion * 0.5) as estimated_monthly_cost
FROM value.models
WHERE is_active = TRUE;

-- View para ranking "Free" (modelos gratuitos)
CREATE OR REPLACE VIEW value.rank_free AS
SELECT 
    id, name, provider, context_length,
    benchmark_intelligence_score,
    free_tier_type, free_tier_provider, free_tier_limitations, free_tier_url,
    ROW_NUMBER() OVER (ORDER BY benchmark_intelligence_score DESC NULLS LAST) as rank
FROM value.models
WHERE free_tier_is_free = TRUE AND is_active = TRUE
ORDER BY benchmark_intelligence_score DESC NULLS LAST;

-- View para ranking "Under $10/month"
CREATE OR REPLACE VIEW value.rank_under_10 AS
SELECT 
    id, name, provider, context_length,
    pricing_prompt, pricing_completion,
    (pricing_prompt * 1 + pricing_completion * 0.5) as monthly_cost,
    cost_benefit_coding,
    benchmark_swe_bench_full,
    ROW_NUMBER() OVER (ORDER BY cost_benefit_coding DESC NULLS LAST) as rank
FROM value.models
WHERE is_active = TRUE
  AND free_tier_is_free = FALSE
  AND (pricing_prompt * 1 + pricing_completion * 0.5) > 0
  AND (pricing_prompt * 1 + pricing_completion * 0.5) < 10
ORDER BY cost_benefit_coding DESC NULLS LAST;

-- View para ranking "$10-$20/month"
CREATE OR REPLACE VIEW value.rank_10_to_20 AS
SELECT 
    id, name, provider, context_length,
    pricing_prompt, pricing_completion,
    (pricing_prompt * 1 + pricing_completion * 0.5) as monthly_cost,
    cost_benefit_coding,
    ROW_NUMBER() OVER (ORDER BY cost_benefit_coding DESC NULLS LAST) as rank
FROM value.models
WHERE is_active = TRUE
  AND free_tier_is_free = FALSE
  AND (pricing_prompt * 1 + pricing_completion * 0.5) >= 10
  AND (pricing_prompt * 1 + pricing_completion * 0.5) <= 20
ORDER BY cost_benefit_coding DESC NULLS LAST;

-- View para ranking "Under $50/month"
CREATE OR REPLACE VIEW value.rank_under_50 AS
SELECT 
    id, name, provider, context_length,
    pricing_prompt, pricing_completion,
    (pricing_prompt * 1 + pricing_completion * 0.5) as monthly_cost,
    cost_benefit_coding,
    ROW_NUMBER() OVER (ORDER BY cost_benefit_coding DESC NULLS LAST) as rank
FROM value.models
WHERE is_active = TRUE
  AND free_tier_is_free = FALSE
  AND (pricing_prompt * 1 + pricing_completion * 0.5) > 20
  AND (pricing_prompt * 1 + pricing_completion * 0.5) < 50
ORDER BY cost_benefit_coding DESC NULLS LAST;

-- Tabela de planos mensais (ChatGPT Plus, Anthropic Pro, etc.)
CREATE TABLE IF NOT EXISTS value.monthly_plans (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(100) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_annual DECIMAL(10, 2),
    tokens_included INTEGER, -- NULL = unlimited
    requests_per_day INTEGER,
    features TEXT[], -- Array de features
    url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para monthly_plans
CREATE INDEX IF NOT EXISTS idx_monthly_plans_provider ON value.monthly_plans(provider);
CREATE INDEX IF NOT EXISTS idx_monthly_plans_active ON value.monthly_plans(is_active);

-- View para comparar monthly plans
CREATE OR REPLACE VIEW value.monthly_plans_comparison AS
SELECT 
    provider,
    plan_name,
    price_monthly,
    price_annual,
    CASE 
        WHEN price_annual IS NOT NULL THEN ROUND((1 - (price_annual/12)/price_monthly) * 100, 1)
        ELSE NULL 
    END as annual_discount_percent,
    tokens_included,
    requests_per_day,
    features,
    url
FROM value.monthly_plans
WHERE is_active = TRUE
ORDER BY price_monthly ASC;

-- Tabela para histórico de pesquisas do Free Tier Hunter
CREATE TABLE IF NOT EXISTS value.free_tier_research (
    id SERIAL PRIMARY KEY,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50),
    raw_content TEXT,
    parsed_data JSONB,
    models_found INTEGER DEFAULT 0
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION value.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_models_updated_at ON value.models;
CREATE TRIGGER update_models_updated_at
    BEFORE UPDATE ON value.models
    FOR EACH ROW
    EXECUTE FUNCTION value.update_updated_at_column();
