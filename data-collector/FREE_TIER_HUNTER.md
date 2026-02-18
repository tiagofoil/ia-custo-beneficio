# Free Tier Hunter

Script Python para buscar LLM free tiers temporários e promoções na internet usando Perplexity Sonar Pro.

## Como Usar

### 1. Configurar API Key

```bash
export PERPLEXITY_API_KEY="pplx-..."
```

Ou passe via argumento:
```bash
python3 src/collectors/free_tier_hunter.py --api-key "pplx-..."
```

### 2. Executar Busca

Busca completa:
```bash
cd /home/node/.openclaw/workspace/projects/ia-custo-beneficio/data-collector
python3 src/collectors/free_tier_hunter.py
```

Busca rápida (só free tiers gerais):
```bash
python3 src/collectors/free_tier_hunter.py --quick
```

### 3. Revisar Resultados

Os resultados são salvos em:
- `data/processed/free_tiers_temp.json` — Dados brutos da pesquisa
- `public/data/free_tiers_dynamic.json` — Dados para o frontend

⚠️ **IMPORTANTE**: Sempre revise manualmente os resultados antes de publicar!

## O Que é Buscado

1. **Free tiers temporários** — Promoções atuais
2. **Free access via IDEs** — Cursor, Windsurf, Zed, Trae, etc.
3. **Free access via plataformas** — OpenCode, GitHub Copilot, etc.
4. **Free API credits** — Créditos gratuitos

## Modelos Monitorados

- GLM-5, GLM-4
- Kimi K2.5
- DeepSeek V3 / Coder
- Llama 3.3 / 3.2
- Qwen 3.5
- MiniMax
- Gemini 2.5 Pro / Flash
- GPT-4o / GPT-4o Mini
- Claude 3 Opus / Sonnet / Haiku
- Mistral Large / Codestral

## Automação

Para rodar automaticamente (cron semanal):

```bash
# Adicionar ao crontab (roda toda segunda às 9h)
0 9 * * 1 cd /path/to/data-collector && python3 src/collectors/free_tier_hunter.py >> logs/free_tier.log 2>&1
```
