-- Add missing models: GLM-5 and Claude Sonnet 4.6

-- Insert GLM-5
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning, is_active)
VALUES ('thudm/glm-5', 'GLM-5', 'Zhipu', 'GLM', 1000000, true, true, false, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Claude Sonnet 4.6
INSERT INTO value.llm_master_list (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning, is_active)
VALUES ('anthropic/claude-sonnet-4.6', 'Claude Sonnet 4.6', 'Anthropic', 'Claude', 1000000, true, true, false, true)
ON CONFLICT (id) DO NOTHING;

-- Add benchmarks for GLM-5
INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source,
  artificial_analysis_intelligence_score, leaderboard_ai_score, swe_bench_verified, 
  agentic_score, bfcl_score, aider_polyglot_score)
VALUES ('thudm/glm-5', 0.30, 2.55, 1000000, 'openrouter_feb2026', 87.5, 1270, 42.0, 86.5, 84.0, 76.0)
ON CONFLICT DO NOTHING;

-- Add benchmarks for Claude Sonnet 4.6
INSERT INTO value.benchmarks (llm_id, price_input, price_output, context_window, data_source,
  artificial_analysis_intelligence_score, leaderboard_ai_score, swe_bench_verified, 
  agentic_score, bfcl_score, aider_polyglot_score)
VALUES ('anthropic/claude-sonnet-4.6', 3.50, 17.50, 1000000, 'openrouter_feb2026', 89.0, 1295, 47.0, 88.0, 85.5, 78.5)
ON CONFLICT DO NOTHING;

-- Verify
SELECT lm.name, lm.provider, b.price_input, b.swe_bench_verified
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
WHERE lm.id IN ('thudm/glm-5', 'anthropic/claude-sonnet-4.6');
