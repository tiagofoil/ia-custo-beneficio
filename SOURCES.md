# LLM Data Sources & Benchmarks

> Last updated: 2026-02-18
> Use these sources for Perplexity deep research and data collection

---

## 🏆 Primary Rankings & Leaderboards

### 1. Artificial Analysis
**URL:** https://artificialanalysis.ai/  
**What:** Comprehensive AI model intelligence index with price/performance ratios  
**Key Metrics:**
- Intelligence Index Score
- Price per 1M tokens
- Context window
- Speed benchmarks

**Direct Link:** https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index

---

### 2. LMSYS Chatbot Arena
**URL:** https://arena.ai/leaderboard/  
**What:** Crowd-sourced ELO rankings based on human preferences  
**Key Metrics:**
- ELO rating
- Win rates
- Style control
- Hard prompts

---

### 3. SWE-bench
**URL:** https://www.swebench.com/  
**What:** Coding ability benchmark (real GitHub issues)  
**Key Metrics:**
- % of issues resolved
- By programming language
- Pass@1, Pass@5 scores

---

### 4. OpenRouter Rankings
**URL:** https://openrouter.ai/rankings  
**What:** Real-world usage rankings + pricing  
**Key Metrics:**
- Popularity by requests
- Average latency
- Cost per request
- Model usage trends

---

## 📊 Model Databases

### 5. Hugging Face Models
**URL:** https://huggingface.co/models  
**What:** Largest open-source model repository  
**Key Data:**
- Downloads
- Likes/trending
- Model cards
- Evaluation results

**Specific Models:**
- GLM-5: https://huggingface.co/zai-org/GLM-5

---

### 6. Models.dev
**URL:** https://models.dev/  
**What:** Curated model directory with specs  
**Key Data:**
- Release dates
- Model versions
- Architecture details
- Provider links

---

## 🎯 Deep Research Queries (for Perplexity)

### Query Template 1: Latest Models
```
What are the latest LLM models released in [MONTH/YEAR] with their:
- Benchmark scores (SWE-bench, Arena ELO)
- Pricing (per token and monthly plans)
- Context window
- Coding capabilities
Focus on: Claude, GPT, Gemini, DeepSeek, GLM
```

### Query Template 2: Free Tiers
```
Which LLM providers offer free tiers or trial plans in [MONTH/YEAR]?
Include:
- Limitations (requests/day, features)
- How to access
- Duration (temporary/permanent)
- Model quality on free tier
```

### Query Template 3: Monthly Plans
```
What are the monthly subscription plans for LLM services in [MONTH/YEAR]?
Include:
- Anthropic Pro
- ChatGPT Plus
- Google AI Pro
- Pricing and tokens included
- Annual discount options
```

### Query Template 4: Coding Benchmarks
```
What are the top coding LLMs based on SWE-bench scores in [MONTH/YEAR]?
Rank by:
- SWE-bench verified score
- HumanEval
- Price for coding tasks
```

---

## 📝 Data Collection Priority

### High Priority (Daily Check)
1. OpenRouter (prices, new models)
2. Artificial Analysis (rankings)
3. Arena Leaderboard (ELO changes)

### Medium Priority (Weekly)
4. SWE-bench (new results)
5. Hugging Face (trending models)
6. Provider blogs (Anthropic, OpenAI, Google)

### Low Priority (Monthly)
7. Academic papers
8. Research evaluations

---

## 🔄 Update Checklist

When updating database, verify:
- [ ] New model releases (last 7 days)
- [ ] Price changes
- [ ] New benchmark results
- [ ] Free tier promotions
- [ ] Monthly plan changes
- [ ] Discontinued models

---

## 🐍 Python Scripts

### Files in this project:
- `data-collector/src/collectors/free_tier_hunter.py` - Finds free tiers
- `data-collector/src/collectors/openrouter.py` - OpenRouter API
- `scripts/migrate-to-db.ts` - Database migration

### To create:
- `artificial_analysis_scraper.py` - Scrape rankings
- `arena_leaderboard_fetcher.py` - Get ELO scores
- `swebench_tracker.py` - Monitor coding benchmarks

---

## 📌 Notes

- **Current gaps in our data:**
  - Missing: Claude Opus 4.6
  - Missing: GPT-4.5/Codex 5.3
  - Missing: Monthly plans (Anthropic Pro, ChatGPT Plus)
  - Outdated: Pricing from some providers

- **Action items:**
  1. Update model list with latest releases
  2. Add monthly plan table
  3. Implement automated daily checks
  4. Verify all benchmark sources

---

*Use this file when running Perplexity deep research queries*
