-- CORRIGIR VIEW - Remover condições que bloqueiam resultados
-- Execute no Neon

DROP VIEW IF EXISTS value.v_models_basic CASCADE;
DROP VIEW IF EXISTS value.v_rank_free CASCADE;
DROP VIEW IF EXISTS value.v_rank_under_10 CASCADE;
DROP VIEW IF EXISTS value.v_rank_10_to_20 CASCADE;
DROP VIEW IF EXISTS value.v_rank_under_50 CASCADE;
DROP VIEW IF EXISTS value.v_rank_unlimited CASCADE;

-- View simplificada SEM condições restritivas
CREATE VIEW value.v_models_basic AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    lm.model_family,
    COALESCE(lm.context_window, 0) as context_window,
    lm.supports_coding,
    lm.supports_agents,
    lm.supports_reasoning,
    COALESCE(b.price_input, 0) as price_input,
    COALESCE(b.price_output, 0) as price_output,
    (COALESCE(b.price_input, 0) + COALESCE(b.price_output, 0)) / 2.0 as avg_price_per_1m,
    COALESCE(b.price_input, 0) * 1.0 + COALESCE(b.price_output, 0) * 0.5 as estimated_monthly_cost,
    CASE 
        WHEN COALESCE(b.price_input, 0) + COALESCE(b.price_output, 0) > 0 
        THEN 1000.0 / (COALESCE(b.price_input, 0) + COALESCE(b.price_output, 0) * 0.5)
        ELSE 0 
    END as basic_value_score,
    CASE 
        WHEN COALESCE(lm.context_window, 0) > 0 
        THEN LEAST(COALESCE(lm.context_window, 0) / 10000.0, 100)
        ELSE 0 
    END as context_score
FROM value.llm_master_list lm
LEFT JOIN value.benchmarks b ON b.llm_id = lm.id
WHERE lm.is_active = TRUE OR lm.is_active IS NULL;

-- Views de categoria
CREATE VIEW value.v_rank_free AS
SELECT *, ROW_NUMBER() OVER (ORDER BY name) as rank
FROM value.v_models_basic 
WHERE estimated_monthly_cost = 0;

CREATE VIEW value.v_rank_under_10 AS
SELECT *, ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic 
WHERE estimated_monthly_cost > 0 AND estimated_monthly_cost < 10;

CREATE VIEW value.v_rank_10_to_20 AS
SELECT *, ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic 
WHERE estimated_monthly_cost >= 10 AND estimated_monthly_cost <= 20;

CREATE VIEW value.v_rank_under_50 AS
SELECT *, ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic 
WHERE estimated_monthly_cost > 20 AND estimated_monthly_cost < 50;

CREATE VIEW value.v_rank_unlimited AS
SELECT *, ROW_NUMBER() OVER (ORDER BY context_window DESC, avg_price_per_1m ASC) as rank
FROM value.v_models_basic;

-- Testar
SELECT COUNT(*) as total_models FROM value.v_models_basic;
SELECT name, price_input, price_output FROM value.v_models_basic ORDER BY basic_value_score DESC LIMIT 5;
