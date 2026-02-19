-- Inserir os 24 LLMs diretamente (versão garantida)
-- Execute no Neon

-- Verificar o que já existe
SELECT 'Antes da inserção:' as status, COUNT(*) as total_llms FROM value.llm_master_list;

-- Inserir em lotes pequenos
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
('openai/gpt-5', 'GPT-5', 'OpenAI', 'GPT', 400000, true, true, false),
('openai/gpt-5.1', 'GPT-5.1', 'OpenAI', 'GPT', 400000, true, true, false),
('openai/gpt-5.2', 'GPT-5.2', 'OpenAI', 'GPT', 400000, true, true, false),
('openai/gpt-4o', 'GPT-4o', 'OpenAI', 'GPT', 128000, true, true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
('openai/o1', 'o1', 'OpenAI', 'o-series', 200000, true, true, true),
('openai/o1-pro', 'o1 Pro', 'OpenAI', 'o-series', 200000, true, true, true),
('openai/o3-mini', 'o3-mini', 'OpenAI', 'o-series', 200000, true, true, true),
('anthropic/claude-opus-4', 'Claude Opus 4', 'Anthropic', 'Claude', 200000, true, true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
('anthropic/claude-opus-4.5', 'Claude Opus 4.5', 'Anthropic', 'Claude', 200000, true, true, false),
('anthropic/claude-opus-4.6', 'Claude Opus 4.6', 'Anthropic', 'Claude', 1000000, true, true, false),
('anthropic/claude-sonnet-4', 'Claude Sonnet 4', 'Anthropic', 'Claude', 1000000, true, true, false),
('anthropic/claude-sonnet-4.5', 'Claude Sonnet 4.5', 'Anthropic', 'Claude', 1000000, true, true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
('google/gemini-2.5-pro', 'Gemini 2.5 Pro', 'Google', 'Gemini', 1048576, true, true, false),
('google/gemini-2.5-flash', 'Gemini 2.5 Flash', 'Google', 'Gemini', 1048576, true, true, false),
('deepseek/deepseek-v3.2', 'DeepSeek V3.2', 'DeepSeek', 'DeepSeek', 163840, true, true, false),
('deepseek/deepseek-r1', 'DeepSeek R1', 'DeepSeek', 'DeepSeek', 64000, true, true, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
('meta-llama/llama-4-scout', 'Llama 4 Scout', 'Meta', 'Llama', 327680, true, true, false),
('meta-llama/llama-4-maverick', 'Llama 4 Maverick', 'Meta', 'Llama', 1048576, true, true, false),
('moonshotai/kimi-k2', 'Kimi K2', 'Moonshot', 'Kimi', 131072, true, true, false),
('moonshotai/kimi-k2.5', 'Kimi K2.5', 'Moonshot', 'Kimi', 262144, true, true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
('mistralai/mistral-large', 'Mistral Large', 'Mistral', 'Mistral', 128000, true, true, false),
('mistralai/mistral-medium-3', 'Mistral Medium 3', 'Mistral', 'Mistral', 131072, true, true, false),
('mistralai/mistral-medium-3.1', 'Mistral Medium 3.1', 'Mistral', 'Mistral', 131072, true, true, false),
('minimax/minimax-m2.5', 'MiniMax M2.5', 'MiniMax', 'MiniMax', 196608, true, true, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Verificar após inserção
SELECT 'Depois da inserção:' as status, COUNT(*) as total_llms FROM value.llm_master_list;

-- Mostrar os LLMs inseridos
SELECT id, name, provider FROM value.llm_master_list ORDER BY provider, name;
