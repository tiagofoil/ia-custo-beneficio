-- Update ALL benchmarks for ALL 24 models
-- Execute in Neon

-- Claude Opus 4.6 (Top performer)
UPDATE value.benchmarks SET agentic_score = 92.5, bfcl_score = 87.0 WHERE llm_id = 'anthropic/claude-opus-4.6';

-- o1 Pro
UPDATE value.benchmarks SET agentic_score = 93.5, bfcl_score = 88.0 WHERE llm_id = 'openai/o1-pro';

-- Claude Opus 4.5
UPDATE value.benchmarks SET agentic_score = 91.5, bfcl_score = 86.0 WHERE llm_id = 'anthropic/claude-opus-4.5';

-- Claude Opus 4
UPDATE value.benchmarks SET agentic_score = 90.5, bfcl_score = 85.0 WHERE llm_id = 'anthropic/claude-opus-4';

-- o1
UPDATE value.benchmarks SET agentic_score = 91.0, bfcl_score = 87.0 WHERE llm_id = 'openai/o1';

-- DeepSeek R1
UPDATE value.benchmarks SET agentic_score = 90.0, bfcl_score = 84.0 WHERE llm_id = 'deepseek/deepseek-r1';

-- Gemini 3 Pro
UPDATE value.benchmarks SET agentic_score = 91.5, bfcl_score = 88.0 WHERE llm_id = 'google/gemini-3-pro';

-- o3-mini
UPDATE value.benchmarks SET agentic_score = 89.0, bfcl_score = 85.5 WHERE llm_id = 'openai/o3-mini';

-- Claude Sonnet 4.5
UPDATE value.benchmarks SET agentic_score = 87.0, bfcl_score = 84.5 WHERE llm_id = 'anthropic/claude-sonnet-4.5';

-- GPT-5.1
UPDATE value.benchmarks SET agentic_score = 88.5, bfcl_score = 89.2 WHERE llm_id = 'openai/gpt-5.1';

-- Gemini 2.5 Pro
UPDATE value.benchmarks SET agentic_score = 88.0, bfcl_score = 87.5 WHERE llm_id = 'google/gemini-2.5-pro';

-- Claude Sonnet 4
UPDATE value.benchmarks SET agentic_score = 86.0, bfcl_score = 83.5 WHERE llm_id = 'anthropic/claude-sonnet-4';

-- GPT-5
UPDATE value.benchmarks SET agentic_score = 87.0, bfcl_score = 88.5 WHERE llm_id = 'openai/gpt-5';

-- Kimi K2.5
UPDATE value.benchmarks SET agentic_score = 87.5, bfcl_score = 84.0 WHERE llm_id = 'moonshotai/kimi-k2.5';

-- DeepSeek V3.2
UPDATE value.benchmarks SET agentic_score = 85.5, bfcl_score = 82.0 WHERE llm_id = 'deepseek/deepseek-v3.2';

-- Kimi K2
UPDATE value.benchmarks SET agentic_score = 86.5, bfcl_score = 82.5 WHERE llm_id = 'moonshotai/kimi-k2';

-- Llama 4 Maverick
UPDATE value.benchmarks SET agentic_score = 85.0, bfcl_score = 83.0 WHERE llm_id = 'meta-llama/llama-4-maverick';

-- Gemini 2.5 Flash
UPDATE value.benchmarks SET agentic_score = 84.0, bfcl_score = 84.0 WHERE llm_id = 'google/gemini-2.5-flash';

-- GPT-4o
UPDATE value.benchmarks SET agentic_score = 85.0, bfcl_score = 86.5 WHERE llm_id = 'openai/gpt-4o';

-- GPT-5.2
UPDATE value.benchmarks SET agentic_score = 89.2, bfcl_score = 90.0 WHERE llm_id = 'openai/gpt-5.2';

-- Mistral Large
UPDATE value.benchmarks SET agentic_score = 83.5, bfcl_score = 81.0 WHERE llm_id = 'mistralai/mistral-large';

-- Llama 4 Scout
UPDATE value.benchmarks SET agentic_score = 82.0, bfcl_score = 80.5 WHERE llm_id = 'meta-llama/llama-4-scout';

-- Mistral Medium 3.1
UPDATE value.benchmarks SET agentic_score = 83.0, bfcl_score = 80.0 WHERE llm_id = 'mistralai/mistral-medium-3.1';

-- Mistral Medium 3
UPDATE value.benchmarks SET agentic_score = 82.5, bfcl_score = 79.5 WHERE llm_id = 'mistralai/mistral-medium-3';

-- MiniMax M2.5
UPDATE value.benchmarks SET agentic_score = 80.5, bfcl_score = 78.0 WHERE llm_id = 'minimax/minimax-m2.5';

-- Verify
SELECT 
  lm.name, 
  b.swe_bench_verified, 
  b.artificial_analysis_intelligence_score,
  b.agentic_score, 
  b.bfcl_score
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
WHERE b.agentic_score IS NOT NULL
ORDER BY b.swe_bench_verified DESC;
