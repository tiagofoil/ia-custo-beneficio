-- ============================================
-- POPULATE VALUE DATABASE - SINGLE FILE
-- Execute inteiro no console do Neon (Ctrl+A, Ctrl+C, Ctrl+V, Run)
-- ============================================

-- 1. LIMPAR DADOS ANTIGOS (se houver)
DELETE FROM value.benchmarks;
DELETE FROM value.llm_master_list;

-- 2. INSERIR 24 LLMs
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning, is_active) VALUES
('openai/gpt-5', 'GPT-5', 'OpenAI', 'GPT', 400000, true, true, false, true),
('openai/gpt-5.1', 'GPT-5.1', 'OpenAI', 'GPT', 400000, true, true, false, true),
('openai/gpt-5.2', 'GPT-5.2', 'OpenAI', 'GPT', 400000, true, true, false, true),
('openai/gpt-4o', 'GPT-4o', 'OpenAI', 'GPT', 128000, true, true, false, true),
('openai/o1', 'o1', 'OpenAI', 'o-series', 200000, true, true, true, true),
('openai/o1-pro', 'o1 Pro', 'OpenAI', 'o-series', 200000, true, true, true, true),
('openai/o3-mini', 'o3-mini', 'OpenAI', 'o-series', 200000, true, true, true, true),
('anthropic/claude-opus-4', 'Claude Opus 4', 'Anthropic', 'Claude', 200000, true, true, false, true),
('anthropic/claude-opus-4.5', 'Claude Opus 4.5', 'Anthropic', 'Claude', 200000, true, true, false, true),
('anthropic/claude-opus-4.6', 'Claude Opus 4.6', 'Anthropic', 'Claude', 1000000, true, true, false, true),
('anthropic/claude-sonnet-4', 'Claude Sonnet 4', 'Anthropic', 'Claude', 1000000, true, true, false, true),
('anthropic/claude-sonnet-4.5', 'Claude Sonnet 4.5', 'Anthropic', 'Claude', 1000000, true, true, false, true),
('google/gemini-2.5-pro', 'Gemini 2.5 Pro', 'Google', 'Gemini', 1048576, true, true, false, true),
('google/gemini-2.5-flash', 'Gemini 2.5 Flash', 'Google', 'Gemini', 1048576, true, true, false, true),
('deepseek/deepseek-v3.2', 'DeepSeek V3.2', 'DeepSeek', 'DeepSeek', 163840, true, true, false, true),
('deepseek/deepseek-r1', 'DeepSeek R1', 'DeepSeek', 'DeepSeek', 64000, true, true, true, true),
('meta-llama/llama-4-scout', 'Llama 4 Scout', 'Meta', 'Llama', 327680, true, true, false, true),
('meta-llama/llama-4-maverick', 'Llama 4 Maverick', 'Meta', 'Llama', 1048576, true, true, false, true),
('moonshotai/kimi-k2', 'Kimi K2', 'Moonshot', 'Kimi', 131072, true, true, false, true),
('moonshotai/kimi-k2.5', 'Kimi K2.5', 'Moonshot', 'Kimi', 262144, true, true, false, true),
('mistralai/mistral-large', 'Mistral Large', 'Mistral', 'Mistral', 128000, true, true, false, true),
('mistralai/mistral-medium-3', 'Mistral Medium 3', 'Mistral', 'Mistral', 131072, true, true, false, true),
('mistralai/mistral-medium-3.1', 'Mistral Medium 3.1', 'Mistral', 'Mistral', 131072, true, true, false, true),
('minimax/minimax-m2.5', 'MiniMax M2.5', 'MiniMax', 'MiniMax', 196608, true, true, false, true);

-- 3. INSERIR PREÇOS
INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('openai/gpt-5', 1.25, 10.00, 400000, 'openrouter_feb2026'),
('openai/gpt-5.1', 1.25, 10.00, 400000, 'openrouter_feb2026'),
('openai/gpt-5.2', 1.75, 14.00, 400000, 'openrouter_feb2026'),
('openai/gpt-4o', 2.50, 10.00, 128000, 'openrouter_feb2026'),
('openai/o1', 15.00, 60.00, 200000, 'openrouter_feb2026'),
('openai/o1-pro', 150.00, 600.00, 200000, 'openrouter_feb2026'),
('openai/o3-mini', 1.10, 4.40, 200000, 'openrouter_feb2026'),
('anthropic/claude-opus-4', 15.00, 75.00, 200000, 'openrouter_feb2026'),
('anthropic/claude-opus-4.5', 5.00, 25.00, 200000, 'openrouter_feb2026'),
('anthropic/claude-opus-4.6', 5.00, 25.00, 1000000, 'openrouter_feb2026'),
('anthropic/claude-sonnet-4', 3.00, 15.00, 1000000, 'openrouter_feb2026'),
('anthropic/claude-sonnet-4.5', 3.00, 15.00, 1000000, 'openrouter_feb2026'),
('google/gemini-2.5-pro', 1.25, 10.00, 1048576, 'openrouter_feb2026'),
('google/gemini-2.5-flash', 0.30, 2.50, 1048576, 'openrouter_feb2026'),
('deepseek/deepseek-v3.2', 0.26, 0.38, 163840, 'openrouter_feb2026'),
('deepseek/deepseek-r1', 0.70, 2.50, 64000, 'openrouter_feb2026'),
('meta-llama/llama-4-scout', 0.08, 0.30, 327680, 'openrouter_feb2026'),
('meta-llama/llama-4-maverick', 0.15, 0.60, 1048576, 'openrouter_feb2026'),
('moonshotai/kimi-k2', 0.50, 2.40, 131072, 'openrouter_feb2026'),
('moonshotai/kimi-k2.5', 0.23, 3.00, 262144, 'openrouter_feb2026'),
('mistralai/mistral-large', 2.00, 6.00, 128000, 'openrouter_feb2026'),
('mistralai/mistral-medium-3', 0.40, 2.00, 131072, 'openrouter_feb2026'),
('mistralai/mistral-medium-3.1', 0.40, 2.00, 131072, 'openrouter_feb2026'),
('minimax/minimax-m2.5', 0.30, 1.10, 196608, 'openrouter_feb2026');

-- 4. CRIAR VIEW SIMPLIFICADA
DROP VIEW IF EXISTS value.v_models_basic CASCADE;
DROP VIEW IF EXISTS value.v_rank_free CASCADE;
DROP VIEW IF EXISTS value.v_rank_under_10 CASCADE;
DROP VIEW IF EXISTS value.v_rank_10_to_20 CASCADE;
DROP VIEW IF EXISTS value.v_rank_under_50 CASCADE;
DROP VIEW IF EXISTS value.v_rank_unlimited CASCADE;

CREATE VIEW value.v_models_basic AS
SELECT 
    lm.id, lm.name, lm.provider, lm.model_family, lm.context_window,
    lm.supports_coding, lm.supports_agents, lm.supports_reasoning,
    b.price_input, b.price_output,
    (b.price_input + b.price_output) / 2.0 as avg_price_per_1m,
    b.price_input * 1.0 + b.price_output * 0.5 as estimated_monthly_cost,
    CASE WHEN (b.price_input + b.price_output * 0.5) > 0 
         THEN 1000.0 / (b.price_input + b.price_output * 0.5) ELSE 0 END as basic_value_score,
    CASE WHEN lm.context_window > 0 
         THEN LEAST(lm.context_window / 10000.0, 100) ELSE 0 END as context_score
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
WHERE lm.is_active = TRUE AND b.price_input IS NOT NULL AND b.price_output IS NOT NULL;

CREATE VIEW value.v_rank_free AS
SELECT *, ROW_NUMBER() OVER (ORDER BY name) as rank
FROM value.v_models_basic WHERE estimated_monthly_cost = 0;

CREATE VIEW value.v_rank_under_10 AS
SELECT *, ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic WHERE estimated_monthly_cost > 0 AND estimated_monthly_cost < 10;

CREATE VIEW value.v_rank_10_to_20 AS
SELECT *, ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic WHERE estimated_monthly_cost >= 10 AND estimated_monthly_cost <= 20;

CREATE VIEW value.v_rank_under_50 AS
SELECT *, ROW_NUMBER() OVER (ORDER BY basic_value_score DESC) as rank
FROM value.v_models_basic WHERE estimated_monthly_cost > 20 AND estimated_monthly_cost < 50;

CREATE VIEW value.v_rank_unlimited AS
SELECT *, ROW_NUMBER() OVER (ORDER BY context_window DESC, avg_price_per_1m ASC) as rank
FROM value.v_models_basic;

-- 5. VERIFICAR RESULTADO
SELECT '✅ INSERTED:' as status, COUNT(*) as count FROM value.llm_master_list
UNION ALL
SELECT '✅ PRICES:' as status, COUNT(*) as count FROM value.benchmarks;
