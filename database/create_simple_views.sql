-- Views Simplificadas para funcionar com dados básicos (OpenRouter apenas)
-- Execute este arquivo no Neon para criar rankings que funcionam AGORA

-- View: Modelos Básicos com Preços (funciona imediatamente)
CREATE OR REPLACE VIEW value.v_models_basic AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    lm.model_family,
    lm.context_window,
    lm.supports_coding,
    lm.supports_agents,
    lm.supports_reasoning,
    b.price_input,
    b.price_output,
    b.context_window as benchmark_context,
    -- Preço médio por token
    (b.price_input + b.price_output) / 2.0 as avg_price_per_1m,
    -- Custo estimado mensal (1M input + 500K output)
    b.price_input * 1.0 + b.price_output * 0.5 as estimated_monthly_cost,
    -- Score básico de value (inverso do preço, normalizado)
    CASE 
        WHEN (b.price_input + b.price_output * 0.5) > 0 
        THEN 1000.0 / (b.price_input + b.price_output * 0.5)
        ELSE 0 
    END as basic_value_score,
    -- Score por contexto (maior contexto = melhor)
    CASE 
        WHEN lm.context_window > 0 
        THEN LEAST(lm.context_window / 10000.0, 100)
        ELSE 0 
    END as context_score,
    b.data_source,
    b.collected_at
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
WHERE lm.is_active = TRUE
  AND b.price_input IS NOT NULL
  AND b.price_output IS NOT NULL;

-- View: Ranking por Preço (mais barato primeiro)
CREATE OR REPLACE VIEW value.v_rank_by_price AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY avg_price_per_1m ASC) as price_rank
FROM value.v_models_basic
ORDER BY avg_price_per_1m ASC;

-- View: Ranking por Value (melhor custo-benefício básico)
CREATE OR REPLACE VIEW value.v_rank_by_value AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as value_rank
FROM value.v_models_basic
ORDER BY basic_value_score DESC;

-- View: Ranking por Contexto (maior contexto primeiro)
CREATE OR REPLACE VIEW value.v_rank_by_context AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY context_window DESC) as context_rank
FROM value.v_models_basic
ORDER BY context_window DESC;

-- View: Categorias de Preço (para o frontend)
CREATE OR REPLACE VIEW value.v_rank_free AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY name) as rank
FROM value.v_models_basic
WHERE estimated_monthly_cost = 0
ORDER BY name;

CREATE OR REPLACE VIEW value.v_rank_under_10 AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic
WHERE estimated_monthly_cost > 0 AND estimated_monthly_cost < 10
ORDER BY basic_value_score DESC;

CREATE OR REPLACE VIEW value.v_rank_10_to_20 AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic
WHERE estimated_monthly_cost >= 10 AND estimated_monthly_cost <= 20
ORDER BY basic_value_score DESC;

CREATE OR REPLACE VIEW value.v_rank_under_50 AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic
WHERE estimated_monthly_cost > 20 AND estimated_monthly_cost < 50
ORDER BY basic_value_score DESC;

-- View: "Unlimited" - ordenado por contexto (proxy para "power")
CREATE OR REPLACE VIEW value.v_rank_unlimited AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY context_window DESC, avg_price_per_1m ASC) as rank
FROM value.v_models_basic
ORDER BY context_window DESC, avg_price_per_1m ASC;

-- Verificar se as views funcionam
SELECT 'Views criadas com sucesso!' as status;

-- Teste rápido
SELECT 
    name, 
    provider, 
    price_input, 
    price_output,
    estimated_monthly_cost,
    basic_value_score
FROM value.v_models_basic 
ORDER BY basic_value_score DESC 
LIMIT 10;
