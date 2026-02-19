-- Insert LLM Master List + Benchmarks (from OpenRouter)

-- GPT-5 (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/gpt-5', 'GPT-5', 'OpenAI', 'GPT', 400000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/gpt-5', 1.2500, 10.0000, 400000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- GPT-5.1 (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/gpt-5.1', 'GPT-5.1', 'OpenAI', 'GPT', 400000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/gpt-5.1', 1.2500, 10.0000, 400000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- GPT-5.2 (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/gpt-5.2', 'GPT-5.2', 'OpenAI', 'GPT', 400000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/gpt-5.2', 1.7500, 14.0000, 400000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- GPT-4o (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/gpt-4o', 'GPT-4o', 'OpenAI', 'GPT', 128000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/gpt-4o', 2.5000, 10.0000, 128000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- o1 (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/o1', 'o1', 'OpenAI', 'o-series', 200000, true, true, true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/o1', 15.0000, 60.0000, 200000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- o1 Pro (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/o1-pro', 'o1 Pro', 'OpenAI', 'o-series', 200000, true, true, true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/o1-pro', 150.0000, 600.0000, 200000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- o3-mini (OpenAI)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('openai/o3-mini', 'o3-mini', 'OpenAI', 'o-series', 200000, true, true, true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('openai/o3-mini', 1.1000, 4.4000, 200000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Claude Opus 4 (Anthropic)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('anthropic/claude-opus-4', 'Claude Opus 4', 'Anthropic', 'Claude', 200000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('anthropic/claude-opus-4', 15.0000, 75.0000, 200000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Claude Opus 4.5 (Anthropic)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('anthropic/claude-opus-4.5', 'Claude Opus 4.5', 'Anthropic', 'Claude', 200000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('anthropic/claude-opus-4.5', 5.0000, 25.0000, 200000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Claude Opus 4.6 (Anthropic)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('anthropic/claude-opus-4.6', 'Claude Opus 4.6', 'Anthropic', 'Claude', 1000000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('anthropic/claude-opus-4.6', 5.0000, 25.0000, 1000000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Claude Sonnet 4 (Anthropic)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('anthropic/claude-sonnet-4', 'Claude Sonnet 4', 'Anthropic', 'Claude', 1000000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('anthropic/claude-sonnet-4', 3.0000, 15.0000, 1000000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Claude Sonnet 4.5 (Anthropic)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('anthropic/claude-sonnet-4.5', 'Claude Sonnet 4.5', 'Anthropic', 'Claude', 1000000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('anthropic/claude-sonnet-4.5', 3.0000, 15.0000, 1000000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Gemini 2.5 Pro (Google)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('google/gemini-2.5-pro', 'Gemini 2.5 Pro', 'Google', 'Gemini', 1048576, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('google/gemini-2.5-pro', 1.2500, 10.0000, 1048576, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Gemini 2.5 Flash (Google)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('google/gemini-2.5-flash', 'Gemini 2.5 Flash', 'Google', 'Gemini', 1048576, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('google/gemini-2.5-flash', 0.3000, 2.5000, 1048576, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- DeepSeek V3.2 (DeepSeek)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('deepseek/deepseek-v3.2', 'DeepSeek V3.2', 'DeepSeek', 'DeepSeek', 163840, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('deepseek/deepseek-v3.2', 0.2600, 0.3800, 163840, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- DeepSeek R1 (DeepSeek)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('deepseek/deepseek-r1', 'DeepSeek R1', 'DeepSeek', 'DeepSeek', 64000, true, true, true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('deepseek/deepseek-r1', 0.7000, 2.5000, 64000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Llama 4 Scout (Meta)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('meta-llama/llama-4-scout', 'Llama 4 Scout', 'Meta', 'Llama', 327680, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('meta-llama/llama-4-scout', 0.0800, 0.3000, 327680, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Llama 4 Maverick (Meta)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('meta-llama/llama-4-maverick', 'Llama 4 Maverick', 'Meta', 'Llama', 1048576, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('meta-llama/llama-4-maverick', 0.1500, 0.6000, 1048576, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Kimi K2 (Moonshot)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('moonshotai/kimi-k2', 'Kimi K2', 'Moonshot', 'Kimi', 131072, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('moonshotai/kimi-k2', 0.5000, 2.4000, 131072, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Kimi K2.5 (Moonshot)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('moonshotai/kimi-k2.5', 'Kimi K2.5', 'Moonshot', 'Kimi', 262144, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('moonshotai/kimi-k2.5', 0.2300, 3.0000, 262144, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Mistral Large (Mistral)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('mistralai/mistral-large', 'Mistral Large', 'Mistral', 'Mistral', 128000, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('mistralai/mistral-large', 2.0000, 6.0000, 128000, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Mistral Medium 3 (Mistral)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('mistralai/mistral-medium-3', 'Mistral Medium 3', 'Mistral', 'Mistral', 131072, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('mistralai/mistral-medium-3', 0.4000, 2.0000, 131072, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Mistral Medium 3.1 (Mistral)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('mistralai/mistral-medium-3.1', 'Mistral Medium 3.1', 'Mistral', 'Mistral', 131072, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('mistralai/mistral-medium-3.1', 0.4000, 2.0000, 131072, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- MiniMax M2.5 (MiniMax)
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning) VALUES
  ('minimax/minimax-m2.5', 'MiniMax M2.5', 'MiniMax', 'MiniMax', 196608, true, true, false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source) VALUES
  ('minimax/minimax-m2.5', 0.3000, 1.1000, 196608, 'openrouter_feb2026')
  ON CONFLICT DO NOTHING;

-- Total: 24 models
