#!/usr/bin/env python3
"""
Busca informações sobre monthly plans (ChatGPT Plus, Anthropic Pro, etc.)
Usa Perplexity via OpenRouter para encontrar preços atualizados
"""

import json
import os
import urllib.request
from datetime import datetime

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "perplexity/sonar-deep-research"

def search_monthly_plans():
    """Busca monthly plans via Perplexity"""
    if not OPENROUTER_API_KEY:
        print("❌ OPENROUTER_API_KEY não configurada")
        return None
    
    query = """What are the monthly subscription plans for LLM services as of February 2026?

Specifically find:
1. Anthropic Pro - price, tokens included, features
2. ChatGPT Plus - price, tokens included, features  
3. Google AI Pro/Ultra - price, tokens included, features
4. Any other major LLM monthly plans

For each plan provide:
- Monthly price
- Annual price (if discounted)
- Tokens/usage included
- Key features
- URL to sign up

Be specific with current 2026 pricing."""
    
    try:
        payload = {
            "model": MODEL,
            "messages": [
                {"role": "user", "content": query}
            ],
            "max_tokens": 2000,
            "temperature": 0.1
        }
        
        req = urllib.request.Request(
            OPENROUTER_API_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://value.ai-foil.com",
                "X-Title": "Monthly Plans Research"
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=120) as response:
            data = json.loads(response.read().decode('utf-8'))
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            return content
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

def main():
    print("🔍 Buscando monthly plans...\n")
    
    result = search_monthly_plans()
    
    if result:
        print("✅ Resultado encontrado:\n")
        print(result)
        
        # Salvar
        output = {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "source": "perplexity_sonar_deep_research",
            "raw_content": result
        }
        
        os.makedirs("data/processed", exist_ok=True)
        with open("data/processed/monthly_plans_research.json", "w") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Salvo em: data/processed/monthly_plans_research.json")
    else:
        print("❌ Falha na busca")

if __name__ == "__main__":
    main()
