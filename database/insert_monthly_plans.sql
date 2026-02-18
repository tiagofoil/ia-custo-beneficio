-- Inserir planos mensais (Fev/2026)
-- Baseado em pesquisa Perplexity

INSERT INTO value.monthly_plans (
    provider, plan_name, price_monthly, price_annual, 
    tokens_included, requests_per_day, features, url
) VALUES 
-- OpenAI
('OpenAI', 'ChatGPT Go', 8.00, NULL, NULL, NULL, 
 ARRAY['GPT-5.2 Instant', '10x mensagens do free', 'File uploads', 'Image generation', 'Anúncios (em breve)'], 
 'https://chat.openai.com'),

('OpenAI', 'ChatGPT Plus', 20.00, NULL, NULL, NULL,
 ARRAY['GPT-5.2', 'Modo thinking', 'Prioridade de acesso', 'DALL-E 4', 'Voice conversations', 'Deep research'],
 'https://chat.openai.com'),

('OpenAI', 'ChatGPT Pro', 200.00, NULL, NULL, NULL,
 ARRAY['o1 unlimited', 'o1 pro mode', 'GPT-4o suite', 'Máximo contexto', 'Acesso antecipado'],
 'https://chat.openai.com'),

('OpenAI', 'ChatGPT Business', 25.00, 30.00, NULL, NULL,
 ARRAY['GPT-5.2 unlimited', 'GPT-4o', 'Team management', 'Admin controls'],
 'https://chat.openai.com'),

-- Anthropic
('Anthropic', 'Claude Free', 0.00, NULL, NULL, 100,
 ARRAY['Haiku 4.5', 'Sonnet 4.5', 'Code generation', 'Web search', '30-100 mensagens/dia'],
 'https://claude.ai'),

('Anthropic', 'Claude Pro', 20.00, NULL, NULL, NULL,
 ARRAY['Todos os modelos', 'Mais mensagens', 'Extended thinking', 'Prioridade de acesso'],
 'https://claude.ai'),

-- Google (estimado baseado em pesquisa)
('Google', 'AI Plus', 10.00, NULL, NULL, NULL,
 ARRAY['Gemini 2.5 Pro', '1M tokens', '2TB storage', 'Google Workspace integration'],
 'https://aistudio.google.com'),

('Google', 'AI Pro', 20.00, NULL, NULL, NULL,
 ARRAY['Gemini 3 Pro', '2M tokens', 'API access', 'Prioridade'],
 'https://aistudio.google.com');

-- Verificar inserções
SELECT provider, plan_name, price_monthly, features[1] as main_feature
FROM value.monthly_plans
ORDER BY price_monthly ASC;
