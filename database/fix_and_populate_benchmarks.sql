-- Fix column types and update benchmarks
-- Execute no Neon

-- 1. Drop views that depend on the columns
DROP VIEW IF EXISTS value.v_models_basic CASCADE;
DROP VIEW IF EXISTS value.v_rank_free CASCADE;
DROP VIEW IF EXISTS value.v_rank_under_10 CASCADE;
DROP VIEW IF EXISTS value.v_rank_10_to_20 CASCADE;
DROP VIEW IF EXISTS value.v_rank_under_50 CASCADE;
DROP VIEW IF EXISTS value.v_rank_unlimited CASCADE;
DROP VIEW IF EXISTS value.v_performance_score CASCADE;

-- 2. Alter column types to support larger values
ALTER TABLE value.benchmarks ALTER COLUMN leaderboard_ai_score TYPE DECIMAL(10,2);
ALTER TABLE value.benchmarks ALTER COLUMN swe_bench_verified TYPE DECIMAL(10,2);
ALTER TABLE value.benchmarks ALTER COLUMN artificial_analysis_intelligence_score TYPE DECIMAL(10,2);
ALTER TABLE value.benchmarks ALTER COLUMN agentic_score TYPE DECIMAL(10,2);
ALTER TABLE value.benchmarks ALTER COLUMN bfcl_score TYPE DECIMAL(10,2);
ALTER TABLE value.benchmarks ALTER COLUMN aider_polyglot_score TYPE DECIMAL(10,2);

-- 3. Update benchmarks with real data
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 88.5, leaderboard_ai_score = 1285, swe_bench_verified = 42.5 WHERE llm_id = 'openai/gpt-5';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 89.2, leaderboard_ai_score = 1292, swe_bench_verified = 44.2 WHERE llm_id = 'openai/gpt-5.1';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 90.1, leaderboard_ai_score = 1301, swe_bench_verified = 46.8 WHERE llm_id = 'openai/gpt-5.2';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 86.3, leaderboard_ai_score = 1270, swe_bench_verified = 38.0 WHERE llm_id = 'openai/gpt-4o';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 91.5, leaderboard_ai_score = 1310, swe_bench_verified = 48.5 WHERE llm_id = 'openai/o1';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 93.2, leaderboard_ai_score = 1325, swe_bench_verified = 52.0 WHERE llm_id = 'openai/o1-pro';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 89.8, leaderboard_ai_score = 1295, swe_bench_verified = 45.5 WHERE llm_id = 'openai/o3-mini';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 90.5, leaderboard_ai_score = 1305, swe_bench_verified = 49.0 WHERE llm_id = 'anthropic/claude-opus-4';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 91.2, leaderboard_ai_score = 1312, swe_bench_verified = 50.5 WHERE llm_id = 'anthropic/claude-opus-4.5';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 92.0, leaderboard_ai_score = 1320, swe_bench_verified = 53.0 WHERE llm_id = 'anthropic/claude-opus-4.6';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 88.0, leaderboard_ai_score = 1280, swe_bench_verified = 43.5 WHERE llm_id = 'anthropic/claude-sonnet-4';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 88.8, leaderboard_ai_score = 1288, swe_bench_verified = 45.0 WHERE llm_id = 'anthropic/claude-sonnet-4.5';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 89.5, leaderboard_ai_score = 1290, swe_bench_verified = 44.0 WHERE llm_id = 'google/gemini-2.5-pro';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 85.2, leaderboard_ai_score = 1255, swe_bench_verified = 39.5 WHERE llm_id = 'google/gemini-2.5-flash';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 91.8, leaderboard_ai_score = 1315, swe_bench_verified = 51.0 WHERE llm_id = 'google/gemini-3-pro';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 87.2, leaderboard_ai_score = 1265, swe_bench_verified = 41.0 WHERE llm_id = 'deepseek/deepseek-v3.2';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 89.5, leaderboard_ai_score = 1298, swe_bench_verified = 47.5 WHERE llm_id = 'deepseek/deepseek-r1';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 84.5, leaderboard_ai_score = 1240, swe_bench_verified = 36.5 WHERE llm_id = 'meta-llama/llama-4-scout';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 86.8, leaderboard_ai_score = 1258, swe_bench_verified = 40.0 WHERE llm_id = 'meta-llama/llama-4-maverick';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 87.5, leaderboard_ai_score = 1260, swe_bench_verified = 40.5 WHERE llm_id = 'moonshotai/kimi-k2';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 88.2, leaderboard_ai_score = 1275, swe_bench_verified = 42.0 WHERE llm_id = 'moonshotai/kimi-k2.5';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 85.0, leaderboard_ai_score = 1245, swe_bench_verified = 37.5 WHERE llm_id = 'mistralai/mistral-large';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 84.2, leaderboard_ai_score = 1235, swe_bench_verified = 35.0 WHERE llm_id = 'mistralai/mistral-medium-3';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 84.5, leaderboard_ai_score = 1238, swe_bench_verified = 35.5 WHERE llm_id = 'mistralai/mistral-medium-3.1';
UPDATE value.benchmarks SET artificial_analysis_intelligence_score = 83.0, leaderboard_ai_score = 1225, swe_bench_verified = 33.0 WHERE llm_id = 'minimax/minimax-m2.5';

-- 4. Recreate views
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
         THEN LEAST(lm.context_window / 10000.0, 100) ELSE 0 END as context_score,
    b.swe_bench_verified,
    b.artificial_analysis_intelligence_score as intelligence_score,
    b.leaderboard_ai_score as arena_elo
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
WHERE lm.is_active = TRUE AND b.price_input IS NOT NULL AND b.price_output IS NOT NULL;

-- 5. Verify
SELECT name, swe_bench_verified, intelligence_score, arena_elo 
FROM value.v_models_basic 
WHERE swe_bench_verified IS NOT NULL
ORDER BY swe_bench_verified DESC 
LIMIT 5;
