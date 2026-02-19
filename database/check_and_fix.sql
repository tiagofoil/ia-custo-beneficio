-- Verificar se dados foram inseridos corretamente
-- Execute no console do Neon

-- 1. Verificar LLMs na tabela mestre
SELECT COUNT(*) as total_llms FROM value.llm_master_list;

-- 2. Verificar benchmarks (preços)
SELECT COUNT(*) as total_benchmarks FROM value.benchmarks;

-- 3. Ver os LLMs inseridos
SELECT name, provider, context_window, supports_coding, supports_agents 
FROM value.llm_master_list 
ORDER BY provider, name;

-- 4. Ver preços
SELECT lm.name, lm.provider, b.price_input, b.price_output
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
ORDER BY b.price_input ASC;

-- 5. Verificar se as views de ranking existem
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'value';

-- 6. Testar view de performance (vai falhar se não houver dados de benchmarks avançados)
-- SELECT * FROM value.v_performance_score LIMIT 5;

-- 7. Inserir dados mínimos de benchmark para teste (copiar do price_input)
UPDATE value.benchmarks 
SET artificial_analysis_intelligence_score = 50 + (random() * 30),
    swe_bench_verified = 10 + (random() * 50),
    agentic_score = 40 + (random() * 40),
    bfcl_score = 50 + (random() * 30)
WHERE artificial_analysis_intelligence_score IS NULL;

-- 8. Verificar se atualizou
SELECT lm.name, b.artificial_analysis_intelligence_score, b.swe_bench_verified
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id
LIMIT 10;
