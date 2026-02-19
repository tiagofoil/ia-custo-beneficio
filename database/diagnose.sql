-- Diagnóstico completo - Execute no Neon

-- 1. Verificar se tabelas existem
SELECT 'Tabelas existentes:' as check_type;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'value';

-- 2. Verificar se views existem  
SELECT 'Views existentes:' as check_type;
SELECT table_name as view_name
FROM information_schema.views 
WHERE table_schema = 'value';

-- 3. Verificar dados na tabela mestre
SELECT 'Total LLMs:' as check_type, COUNT(*) as count FROM value.llm_master_list;

-- 4. Verificar dados na tabela benchmarks
SELECT 'Total Benchmarks:' as check_type, COUNT(*) as count FROM value.benchmarks;

-- 5. Verificar JOIN entre tabelas
SELECT 'JOIN funcionando?' as check_type, COUNT(*) as count 
FROM value.llm_master_list lm
JOIN value.benchmarks b ON b.llm_id = lm.id;

-- 6. Ver dados específicos
SELECT 'Dados dos LLMs:' as check_type;
SELECT 
    lm.id,
    lm.name, 
    lm.provider,
    lm.is_active,
    b.price_input,
    b.price_output
FROM value.llm_master_list lm
LEFT JOIN value.benchmarks b ON b.llm_id = lm.id
LIMIT 5;

-- 7. Testar view simplificada
SELECT 'Testando v_models_basic:' as check_type;
SELECT * FROM value.v_models_basic LIMIT 3;

-- 8. Se a view não funcionar, criar uma versão ultra-simples
DROP VIEW IF EXISTS value.v_test_simple;
CREATE VIEW value.v_test_simple AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    1.0 as price_input,
    1.0 as price_output,
    100 as context_window
FROM value.llm_master_list lm
WHERE lm.is_active = TRUE
LIMIT 10;

-- 9. Testar view ultra-simples
SELECT 'View ultra-simples:' as check_type;
SELECT * FROM value.v_test_simple;
