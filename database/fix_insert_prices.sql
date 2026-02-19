-- Inserir preços (benchmarks) para os 24 LLMs
-- Execute no Neon

-- Verificar antes
SELECT 'Benchmarks antes:' as status, COUNT(*) as count FROM value.benchmarks;

-- Inserir preços
INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('openai/gpt-5', 1.25, 10.00, 400000, 'openrouter_feb2026'),
('openai/gpt-5.1', 1.25, 10.00, 400000, 'openrouter_feb2026'),
('openai/gpt-5.2', 1.75, 14.00, 400000, 'openrouter_feb2026'),
('openai/gpt-4o', 2.50, 10.00, 128000, 'openrouter_feb2026')
ON CONFLICT DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('openai/o1', 15.00, 60.00, 200000, 'openrouter_feb2026'),
('openai/o1-pro', 150.00, 600.00, 200000, 'openrouter_feb2026'),
('openai/o3-mini', 1.10, 4.40, 200000, 'openrouter_feb2026'),
('anthropic/claude-opus-4', 15.00, 75.00, 200000, 'openrouter_feb2026')
ON CONFLICT DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('anthropic/claude-opus-4.5', 5.00, 25.00, 200000, 'openrouter_feb2026'),
('anthropic/claude-opus-4.6', 5.00, 25.00, 1000000, 'openrouter_feb2026'),
('anthropic/claude-sonnet-4', 3.00, 15.00, 1000000, 'openrouter_feb2026'),
('anthropic/claude-sonnet-4.5', 3.00, 15.00, 1000000, 'openrouter_feb2026')
ON CONFLICT DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('google/gemini-2.5-pro', 1.25, 10.00, 1048576, 'openrouter_feb2026'),
('google/gemini-2.5-flash', 0.30, 2.50, 1048576, 'openrouter_feb2026'),
('deepseek/deepseek-v3.2', 0.26, 0.38, 163840, 'openrouter_feb2026'),
('deepseek/deepseek-r1', 0.70, 2.50, 64000, 'openrouter_feb2026')
ON CONFLICT DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('meta-llama/llama-4-scout', 0.08, 0.30, 327680, 'openrouter_feb2026'),
('meta-llama/llama-4-maverick', 0.15, 0.60, 1048576, 'openrouter_feb2026'),
('moonshotai/kimi-k2', 0.50, 2.40, 131072, 'openrouter_feb2026'),
('moonshotai/kimi-k2.5', 0.23, 3.00, 262144, 'openrouter_feb2026')
ON CONFLICT DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
('mistralai/mistral-large', 2.00, 6.00, 128000, 'openrouter_feb2026'),
('mistralai/mistral-medium-3', 0.40, 2.00, 131072, 'openrouter_feb2026'),
('mistralai/mistral-medium-3.1', 0.40, 2.00, 131072, 'openrouter_feb2026'),
('minimax/minimax-m2.5', 0.30, 1.10, 196608, 'openrouter_feb2026')
ON CONFLICT DO NOTHING;

-- Verificar após
SELECT 'Benchmarks depois:' as status, COUNT(*) as count FROM value.benchmarks;

-- Mostrar preços inseridos
SELECT lm.name, lm.provider, b.price_input, b.price_output
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
ORDER BY b.price_input ASC;
