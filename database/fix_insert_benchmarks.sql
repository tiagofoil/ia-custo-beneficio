-- INSERIR PREÇOS CORRETAMENTE (garantindo que llm_id existe)
-- Execute no Neon

-- Primeiro, limpar benchmarks existentes
DELETE FROM value.benchmarks;

-- Inserir todos os preços vinculados aos LLMs corretos
INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 1.25, 10.00, 400000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/gpt-5';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 1.25, 10.00, 400000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/gpt-5.1';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 1.75, 14.00, 400000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/gpt-5.2';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 2.50, 10.00, 128000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/gpt-4o';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 15.00, 60.00, 200000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/o1';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 150.00, 600.00, 200000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/o1-pro';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 1.10, 4.40, 200000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'openai/o3-mini';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 15.00, 75.00, 200000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'anthropic/claude-opus-4';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 5.00, 25.00, 200000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'anthropic/claude-opus-4.5';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 5.00, 25.00, 1000000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'anthropic/claude-opus-4.6';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 3.00, 15.00, 1000000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'anthropic/claude-sonnet-4';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 3.00, 15.00, 1000000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'anthropic/claude-sonnet-4.5';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 1.25, 10.00, 1048576, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'google/gemini-2.5-pro';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.30, 2.50, 1048576, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'google/gemini-2.5-flash';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.26, 0.38, 163840, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'deepseek/deepseek-v3.2';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.70, 2.50, 64000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'deepseek/deepseek-r1';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.08, 0.30, 327680, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'meta-llama/llama-4-scout';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.15, 0.60, 1048576, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'meta-llama/llama-4-maverick';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.50, 2.40, 131072, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'moonshotai/kimi-k2';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.23, 3.00, 262144, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'moonshotai/kimi-k2.5';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 2.00, 6.00, 128000, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'mistralai/mistral-large';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.40, 2.00, 131072, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'mistralai/mistral-medium-3';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.40, 2.00, 131072, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'mistralai/mistral-medium-3.1';

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) 
SELECT id, 0.30, 1.10, 196608, 'openrouter_feb2026' FROM value.llm_master_list WHERE id = 'minimax/minimax-m2.5';

-- Verificar se funcionou
SELECT 
  lm.id, 
  lm.name, 
  b.price_input, 
  b.price_output,
  b.price_input * 1.0 + b.price_output * 0.5 as monthly_cost
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
ORDER BY b.price_input ASC
LIMIT 10;
