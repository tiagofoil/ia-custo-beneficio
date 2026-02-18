-- Inserir modelos de Fevereiro 2026 (dados da OpenRouter)
-- Gerado em: 2026-02-18

INSERT INTO value.models (
    id, name, provider, context_length,
    pricing_prompt, pricing_completion,
    benchmark_arena_elo, cost_benefit_coding, cost_benefit_general,
    free_tier_is_free, source
) VALUES 
-- Gemini 3 Pro (Líder geral 1490 ELO)
('google/gemini-3-pro', 'Gemini 3 Pro', 'google', 65536, 2.00, 12.00, 1490, 745.0, 124.2, false, 'openrouter_feb2026'),

-- Claude Opus 4.6 (Líder coding 1510 ELO)
('anthropic/claude-opus-4-6', 'Claude Opus 4.6', 'anthropic', 1000000, 5.00, 25.00, 1510, 302.0, 60.4, false, 'openrouter_feb2026'),

-- GPT-5.1
('openai/gpt-5-1', 'GPT-5.1', 'openai', 400000, 1.75, 14.00, 1475, 843.0, 105.4, false, 'openrouter_feb2026'),

-- GLM-5 (744B MoE)
('thudm/glm-5', 'GLM-5', 'thudm', 204800, 0.30, 2.55, 1450, 4833.0, 483.3, false, 'openrouter_feb2026'),

-- DeepSeek V3.2 (custo-benefício)
('deepseek/deepseek-v3-2', 'DeepSeek V3.2', 'deepseek', 131072, 0.27, 1.00, 1380, 5111.0, 511.1, false, 'openrouter_feb2026'),

-- Grok 4.1 (xAI)
('xai/grok-4-1', 'Grok 4.1', 'xai', 2000000, 0.20, 0.50, 1420, 7100.0, 710.0, false, 'openrouter_feb2026'),

-- Llama 4 Scout (10M contexto)
('meta-llama/llama-4-scout', 'Llama 4 Scout', 'meta-llama', 1048576, 0.15, 0.60, 1400, 9333.0, 933.3, false, 'openrouter_feb2026'),

-- Qwen3-235B
('qwen/qwen3-235b', 'Qwen3-235B', 'qwen', 1000000, 0.40, 2.40, 1395, 3487.0, 348.7, false, 'openrouter_feb2026'),

-- Kimi K2.5 (1T MoE)
('moonshotai/kimi-k2-5', 'Kimi K2.5', 'moonshotai', 262144, 0.23, 3.00, 1430, 6217.0, 476.7, false, 'openrouter_feb2026'),

-- Mistral Medium 3.1 (econômico)
('mistralai/mistral-medium-3-1', 'Mistral Medium 3.1', 'mistralai', 131072, 0.40, 2.00, 1380, 3450.0, 345.0, false, 'openrouter_feb2026');

-- Atualizar scores de cost-benefit (Performance / Price * 100)
UPDATE value.models 
SET cost_benefit_coding = (benchmark_arena_elo / NULLIF(pricing_prompt + pricing_completion * 0.5, 0)) * 100
WHERE source = 'openrouter_feb2026';

-- Verificar inserções
SELECT name, provider, pricing_prompt, pricing_completion, benchmark_arena_elo, cost_benefit_coding
FROM value.models 
WHERE source = 'openrouter_feb2026'
ORDER BY cost_benefit_coding DESC;
