# Value - Agentic Coding Focus

## 🎯 New Mission

**Value** is now focused on **Agentic Coding for Developers**.

We rank LLMs specifically for programmers building solutions with AI agents.

---

## 📊 The 15 Columns (Complete Benchmark Suite)

### Performance/Power Columns (High Weight)
1. **Intelligence Score** - Artificial Analysis intelligence index
2. **Input Price** - $ per 1M tokens
3. **Output Price** - $ per 1M tokens  
4. **Speed** - Tokens/second generation
5. **Output Tokens Limit** - Max tokens in response
6. **Leaderboard AI Score** - Overall AI ranking
7. **SWE-bench %** - % of real GitHub issues resolved
8. **OpenRouter Popularity** - Usage rank
9. **Agentic Evaluation** - Multi-step task completion
10. **BFCL Score** - Function calling ability
11. **NIAH Score** - Context retrieval accuracy
12. **Humanity's Last Exam** - Expert-level reasoning
13. **Aider Polyglot** - Multi-language coding
14. **Plan Price** - Monthly subscription cost
15. **Plan Token Limit** - Tokens included in plan

---

## ⚖️ Ranking Weights

### Performance Ranking (Agentic Coding Power)
```
Score = 
  Intelligence × 15% +
  SWE-bench × 20% +
  Agentic × 20% +
  BFCL × 10% +
  NIAH × 5% +
  Humanity Exam × 10% +
  Aider Polyglot × 15% +
  Leaderboard × 5%
```

### Value Ranking (Best Price/Performance)
```
Score = Performance / Price

Where Price = 
  Input Price × 25% +
  Output Price × 25% +
  Plan Price × 25% +
  Plan Tokens × 25%
```

---

## 🗂️ Source of Truth

### Master List: `value.llm_master_list`

All LLMs that support coding/agents:
- **40+ models** tracked
- OpenAI (GPT-5, o1, o3)
- Anthropic (Claude Opus/Sonnet)
- Google (Gemini 2.5/3)
- DeepSeek (V3, R1)
- Meta (Llama 3.3/4)
- Zhipu (GLM-4/5)
- Moonshot (Kimi K2)
- Qwen, Mistral, xAI, Cohere, MiniMax

---

## 🔔 Alert System

When a new LLM launches:
1. Auto-add to master list
2. Alert created with status "pending_benchmarks"
3. Check scheduled in 7 days
4. Collect all 15 benchmarks
5. Update rankings

---

## 🔄 Weekly Update Process

### Every Week (Automated):
1. **Check OpenRouter** - New models, price changes
2. **Check Artificial Analysis** - Intelligence scores
3. **Check SWE-bench** - New results
4. **Check BFCL** - Function calling leaderboard
5. **Check Arena** - ELO rankings
6. **Update all 15 columns**
7. **Recalculate rankings**
8. **Send alerts** for significant changes

---

## 🏆 Rankings Available

1. **Performance Rank** - Pure coding/agentic power
2. **Value Rank** - Best price/performance
3. **Agentic Specialist** - Optimized for agents
4. **Monthly Plans** - Subscription comparison
5. **By Category**:
   - Free Tier
   - Under $10/month
   - $10-$20/month
   - Under $50/month
   - Unlimited (power first)

---

## 📁 Files

### Database Schema
- `database/schema_v2_agentic.sql` - Complete schema

### Data Collection
- `scripts/collect_agentic_data.py` - Master collector
- `scripts/fetch_new_models.py` - OpenRouter prices
- `scripts/fetch_monthly_plans.py` - Subscription plans

### Data Sources
- `SOURCES.md` - All benchmark websites
- `RESEARCH-2026-02-18.md` - Latest findings

---

## 🚀 Next Steps

1. **Execute schema_v2_agentic.sql** in Neon
2. **Run collect_agentic_data.py** to populate
3. **Set up weekly cron job** for updates
4. **Deploy frontend** with new rankings

---

## 💡 Why This Matters

For developers using AI agents:
- **Not all LLMs are equal** for coding
- **Price ≠ Performance**
- **Agents need special capabilities** (function calling, tool use, reasoning)
- **Weekly updates** keep you ahead

---

*Built for developers, by developers.* 🚀
