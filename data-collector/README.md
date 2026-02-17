# Data Collector - IA Custo Benefício

Sistema de coleta automatizada de dados de LLMs para geração de ranking de custo-benefício.

## 🎯 Objetivo
Coletar dados de múltiplas fontes e gerar um dataset JSON atualizado semanalmente.

## 📊 Fontes de Dados

### 1. OpenRouter API ✅
- **URL**: `https://openrouter.ai/api/v1/models`
- **Dados**: Preços, context window, capabilities
- **Frequência**: Semanal
- **Método**: API REST pública (grátis)

### 2. SWE-bench ⏳
- **URL**: `https://www.swebench.com/`
- **Dados**: Software engineering benchmark scores
- **Método**: Scraping da leaderboard

### 3. Artificial Analysis ⏳
- **URL**: `https://artificialanalysis.ai/leaderboards/models`
- **Dados**: Intelligence vs Price, rankings
- **Método**: Scraping ou vision analysis

### 4. Arena (LMSYS) ⏳
- **URL**: `https://arena.ai/leaderboard/`
- **Dados**: Elo ratings, win rates
- **Método**: API pública ou scraping

## 🚀 Execução

### Semanal (GitHub Actions)
```bash
python scripts/run_weekly.py
```

### Manual (Nova LLM)
```bash
python scripts/run_manual.py -m provider/model-name
```
