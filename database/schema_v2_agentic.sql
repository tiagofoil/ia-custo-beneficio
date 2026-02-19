-- Schema completo para Value - Agentic Coding Focus
-- Atualizado: 2026-02-19
-- Foco: LLMs para programadores usando agents

CREATE SCHEMA IF NOT EXISTS value;

-- Tabela mestre de LLMs (Source of Truth)
CREATE TABLE IF NOT EXISTS value.llm_master_list (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    model_family VARCHAR(100), -- ex: GPT, Claude, Gemini
    release_date DATE,
    architecture VARCHAR(100), -- ex: MoE, Dense
    total_params VARCHAR(50), -- ex: "1T", "744B"
    active_params VARCHAR(50), -- ex: "32B", "44B" (para MoE)
    context_window INTEGER,
    
    -- Status tracking
    is_active BOOLEAN DEFAULT TRUE,
    is_released BOOLEAN DEFAULT TRUE,
    tracking_status VARCHAR(50) DEFAULT 'active', -- active, new_launch, pending_benchmarks, archived
    first_seen_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata
    description TEXT,
    official_url TEXT,
    paper_url TEXT,
    huggingface_url TEXT,
    
    -- Flags para capacidades
    supports_coding BOOLEAN DEFAULT TRUE,
    supports_agents BOOLEAN DEFAULT TRUE,
    supports_vision BOOLEAN DEFAULT FALSE,
    supports_tools BOOLEAN DEFAULT FALSE,
    supports_reasoning BOOLEAN DEFAULT FALSE,
    
    UNIQUE(provider, name)
);

-- Tabela de benchmarks detalhados (todas as 15 colunas)
CREATE TABLE IF NOT EXISTS value.benchmarks (
    id SERIAL PRIMARY KEY,
    llm_id VARCHAR(100) REFERENCES value.llm_master_list(id) ON DELETE CASCADE,
    
    -- 1. Intelligence Score (Artificial Analysis)
    artificial_analysis_intelligence_score DECIMAL(5, 2),
    artificial_analysis_url TEXT,
    
    -- 2-3. Preços (por 1M tokens)
    price_input DECIMAL(10, 4),
    price_output DECIMAL(10, 4),
    price_currency VARCHAR(3) DEFAULT 'USD',
    price_updated_at TIMESTAMP,
    
    -- 4. Speed (tokens/segundo)
    speed_tokens_per_second INTEGER,
    speed_latency_ms INTEGER, -- time to first token
    
    -- 5. Output tokens from intelligence index
    output_tokens_limit INTEGER,
    
    -- 6. Score Leaderboard AI
    leaderboard_ai_score DECIMAL(5, 2),
    leaderboard_ai_rank INTEGER,
    
    -- 7. SWE-bench (% resolved)
    swe_bench_verified DECIMAL(5, 2),
    swe_bench_lite DECIMAL(5, 2),
    swe_bench_multimodal DECIMAL(5, 2),
    
    -- 8. OpenRouter Rank Popularity
    openrouter_rank INTEGER,
    openrouter_popularity_score DECIMAL(5, 2),
    openrouter_latency_avg_ms INTEGER,
    
    -- 9. Agentic Evaluation Score
    agentic_score DECIMAL(5, 2),
    agentic_benchmark VARCHAR(100), -- qual benchmark usado
    
    -- 10. BFCL Score (Berkeley Function Calling Leaderboard)
    bfcl_score DECIMAL(5, 2),
    bfcl_rank INTEGER,
    
    -- 11. NIAH Score (Needle In A Haystack)
    niah_score DECIMAL(5, 2), -- % retrieved em contexto longo
    niah_context_length INTEGER, -- tamanho do contexto testado
    
    -- 12. Humanity's Last Exam Score
    humanity_last_exam_score DECIMAL(5, 2),
    humanity_last_exam_rank INTEGER,
    
    -- 13. Aider Polyglot Score
    aider_polyglot_score DECIMAL(5, 2),
    aider_polyglot_pass_rate DECIMAL(5, 2),
    
    -- 14-15. Plan Price & Token Limit (se aplicável)
    plan_price_monthly DECIMAL(10, 2),
    plan_price_annual DECIMAL(10, 2),
    plan_tokens_included INTEGER, -- NULL = unlimited
    plan_requests_per_day INTEGER,
    plan_features TEXT[],
    
    -- Metadados
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_source VARCHAR(100), -- ex: 'artificial_analysis', 'openrouter', 'swebench'
    is_verified BOOLEAN DEFAULT FALSE, -- se foi verificado manualmente
    
    UNIQUE(llm_id, collected_at)
);

-- Tabela de configuração de pesos para rankings
CREATE TABLE IF NOT EXISTS value.ranking_weights (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- ex: 'performance', 'value', 'balanced'
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Pesos para Performance/Power (0-100)
    weight_intelligence_score INTEGER DEFAULT 15,
    weight_swe_bench INTEGER DEFAULT 20,
    weight_agentic_score INTEGER DEFAULT 20,
    weight_bfcl INTEGER DEFAULT 10,
    weight_niah INTEGER DEFAULT 5,
    weight_humanity_exam INTEGER DEFAULT 10,
    weight_aider_polyglot INTEGER DEFAULT 15,
    weight_leaderboard_ai INTEGER DEFAULT 5,
    
    -- Pesos para Price/Value (0-100)
    weight_price_input INTEGER DEFAULT 25,
    weight_price_output INTEGER DEFAULT 25,
    weight_plan_price INTEGER DEFAULT 25,
    weight_plan_tokens INTEGER DEFAULT 25,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alertas para novos LLMs
CREATE TABLE IF NOT EXISTS value.new_llm_alerts (
    id SERIAL PRIMARY KEY,
    llm_id VARCHAR(100) REFERENCES value.llm_master_list(id),
    alert_type VARCHAR(50), -- 'new_launch', 'price_change', 'benchmark_available'
    status VARCHAR(50) DEFAULT 'pending', -- pending, checking, resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_check_at TIMESTAMP, -- quando verificar (ex: 1 semana depois)
    resolved_at TIMESTAMP,
    notes TEXT
);

-- Tabela de atualizações semanais (log)
CREATE TABLE IF NOT EXISTS value.weekly_updates (
    id SERIAL PRIMARY KEY,
    update_date DATE DEFAULT CURRENT_DATE,
    models_checked INTEGER DEFAULT 0,
    models_updated INTEGER DEFAULT 0,
    new_models_found INTEGER DEFAULT 0,
    errors TEXT[],
    duration_seconds INTEGER,
    status VARCHAR(50) DEFAULT 'running' -- running, completed, failed
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_llm_master_provider ON value.llm_master_list(provider);
CREATE INDEX IF NOT EXISTS idx_llm_master_status ON value.llm_master_list(tracking_status);
CREATE INDEX IF NOT EXISTS idx_llm_master_coding ON value.llm_master_list(supports_coding) WHERE supports_coding = TRUE;
CREATE INDEX IF NOT EXISTS idx_llm_master_agents ON value.llm_master_list(supports_agents) WHERE supports_agents = TRUE;

CREATE INDEX IF NOT EXISTS idx_benchmarks_llm ON value.benchmarks(llm_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_collected ON value.benchmarks(collected_at);
CREATE INDEX IF NOT EXISTS idx_benchmarks_swe ON value.benchmarks(swe_bench_verified);
CREATE INDEX IF NOT EXISTS idx_benchmarks_intelligence ON value.benchmarks(artificial_analysis_intelligence_score);

-- View: Performance Score (Power para Coding/Agents)
-- Usa pesos da tabela ranking_weights
CREATE OR REPLACE VIEW value.v_performance_score AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    b.artificial_analysis_intelligence_score,
    b.swe_bench_verified,
    b.agentic_score,
    b.bfcl_score,
    b.niah_score,
    b.humanity_last_exam_score,
    b.aider_polyglot_score,
    b.leaderboard_ai_score,
    -- Cálculo de performance score (pesos da configuração 'performance')
    COALESCE(b.artificial_analysis_intelligence_score * 0.15, 0) +
    COALESCE(b.swe_bench_verified * 0.20, 0) +
    COALESCE(b.agentic_score * 0.20, 0) +
    COALESCE(b.bfcl_score * 0.10, 0) +
    COALESCE(b.niah_score * 0.05, 0) +
    COALESCE(b.humanity_last_exam_score * 0.10, 0) +
    COALESCE(b.aider_polyglot_score * 0.15, 0) +
    COALESCE(b.leaderboard_ai_score * 0.05, 0) as performance_score,
    ROW_NUMBER() OVER (ORDER BY 
        COALESCE(b.artificial_analysis_intelligence_score * 0.15, 0) +
        COALESCE(b.swe_bench_verified * 0.20, 0) +
        COALESCE(b.agentic_score * 0.20, 0) +
        COALESCE(b.bfcl_score * 0.10, 0) +
        COALESCE(b.niah_score * 0.05, 0) +
        COALESCE(b.humanity_last_exam_score * 0.10, 0) +
        COALESCE(b.aider_polyglot_score * 0.15, 0) +
        COALESCE(b.leaderboard_ai_score * 0.05, 0) DESC
    ) as performance_rank
FROM value.llm_master_list lm
LEFT JOIN LATERAL (
    SELECT * FROM value.benchmarks b2 
    WHERE b2.llm_id = lm.id 
    ORDER BY b2.collected_at DESC 
    LIMIT 1
) b ON true
WHERE lm.is_active = TRUE 
  AND lm.supports_coding = TRUE 
  AND lm.supports_agents = TRUE;

-- View: Value Score (Best Price/Performance)
CREATE OR REPLACE VIEW value.v_value_score AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    b.price_input,
    b.price_output,
    b.plan_price_monthly,
    b.plan_tokens_included,
    b.performance_score,
    -- Cálculo de value score: Performance / Price
    CASE 
        WHEN (COALESCE(b.price_input, 0) + COALESCE(b.price_output, 0) * 0.5) > 0 
        THEN b.performance_score / (b.price_input + b.price_output * 0.5)
        ELSE 0 
    END as value_score,
    ROW_NUMBER() OVER (ORDER BY 
        CASE 
            WHEN (COALESCE(b.price_input, 0) + COALESCE(b.price_output, 0) * 0.5) > 0 
            THEN b.performance_score / (b.price_input + b.price_output * 0.5)
            ELSE 0 
        END DESC
    ) as value_rank
FROM value.v_performance_score b
JOIN value.llm_master_list lm ON lm.id = b.id
WHERE lm.is_active = TRUE;

-- View: Agentic Coding Specialists
CREATE OR REPLACE VIEW value.v_agentic_specialists AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    b.agentic_score,
    b.bfcl_score,
    b.aider_polyglot_score,
    b.swe_bench_verified,
    -- Score combinado para agentic coding
    (COALESCE(b.agentic_score, 0) * 0.40 +
     COALESCE(b.bfcl_score, 0) * 0.25 +
     COALESCE(b.aider_polyglot_score, 0) * 0.25 +
     COALESCE(b.swe_bench_verified, 0) * 0.10) as agentic_specialist_score,
    ROW_NUMBER() OVER (ORDER BY 
        (COALESCE(b.agentic_score, 0) * 0.40 +
         COALESCE(b.bfcl_score, 0) * 0.25 +
         COALESCE(b.aider_polyglot_score, 0) * 0.25 +
         COALESCE(b.swe_bench_verified, 0) * 0.10) DESC
    ) as agentic_rank
FROM value.llm_master_list lm
LEFT JOIN LATERAL (
    SELECT * FROM value.benchmarks b2 
    WHERE b2.llm_id = lm.id 
    ORDER BY b2.collected_at DESC 
    LIMIT 1
) b ON true
WHERE lm.is_active = TRUE 
  AND lm.supports_agents = TRUE;

-- View: Monthly Plans Comparison
CREATE OR REPLACE VIEW value.v_monthly_plans_comparison AS
SELECT 
    lm.id,
    lm.name,
    lm.provider,
    b.plan_price_monthly,
    b.plan_price_annual,
    b.plan_tokens_included,
    b.plan_requests_per_day,
    b.performance_score,
    -- Custo por 1M tokens no plano
    CASE 
        WHEN b.plan_tokens_included IS NOT NULL AND b.plan_tokens_included > 0
        THEN b.plan_price_monthly / (b.plan_tokens_included / 1000000.0)
        ELSE NULL
    END as cost_per_1m_tokens_in_plan,
    -- Value score específico para planos
    CASE 
        WHEN b.plan_price_monthly > 0 
        THEN b.performance_score / b.plan_price_monthly
        ELSE 0
    END as plan_value_score
FROM value.llm_master_list lm
LEFT JOIN LATERAL (
    SELECT * FROM value.benchmarks b2 
    WHERE b2.llm_id = lm.id 
    ORDER BY b2.collected_at DESC 
    LIMIT 1
) b ON true
WHERE b.plan_price_monthly IS NOT NULL 
  AND b.plan_price_monthly > 0
ORDER BY plan_value_score DESC;

-- Inserir pesos padrão
INSERT INTO value.ranking_weights (
    name, description, is_default,
    weight_intelligence_score, weight_swe_bench, weight_agentic_score,
    weight_bfcl, weight_niah, weight_humanity_exam, weight_aider_polyglot, weight_leaderboard_ai,
    weight_price_input, weight_price_output, weight_plan_price, weight_plan_tokens
) VALUES 
('performance', 'Maximum performance for coding and agents', TRUE, 15, 20, 20, 10, 5, 10, 15, 5, 0, 0, 0, 0),
('value', 'Best price/performance ratio', FALSE, 10, 15, 15, 8, 3, 7, 10, 3, 25, 25, 25, 25),
('balanced', 'Balanced performance and price', FALSE, 12, 18, 18, 9, 4, 8, 12, 4, 12, 12, 12, 12),
('agentic', 'Optimized for agentic coding', FALSE, 10, 10, 40, 25, 3, 5, 20, 3, 0, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Função para alertar novo LLM
CREATE OR REPLACE FUNCTION value.alert_new_llm()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO value.new_llm_alerts (llm_id, alert_type, scheduled_check_at)
    VALUES (NEW.id, 'new_launch', NEW.first_seen_date + INTERVAL '7 days');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para novo LLM
DROP TRIGGER IF EXISTS trg_new_llm_alert ON value.llm_master_list;
CREATE TRIGGER trg_new_llm_alert
    AFTER INSERT ON value.llm_master_list
    FOR EACH ROW
    EXECUTE FUNCTION value.alert_new_llm();
