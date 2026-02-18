#!/usr/bin/env python3
"""
Add latest LLMs to database based on February 2026 research
Uses OpenRouter API for pricing data
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/models"

def fetch_openrouter_models():
    """Busca modelos e preços da OpenRouter"""
    if not OPENROUTER_API_KEY:
        print("❌ OPENROUTER_API_KEY não configurada")
        return []
    
    try:
        req = urllib.request.Request(
            OPENROUTER_API_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://value.ai-foil.com",
                "X-Title": "Value LLM Database"
            }
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get("data", [])
            
    except Exception as e:
        print(f"❌ Erro OpenRouter: {e}")
        return []

def find_model_pricing(models, search_terms):
    """Busca preço de modelo por termos"""
    for model in models:
        model_id = model.get("id", "").lower()
        model_name = model.get("name", "").lower()
        
        for term in search_terms:
            if term.lower() in model_id or term.lower() in model_name:
                pricing = model.get("pricing", {})
                return {
                    "prompt": float(pricing.get("prompt", 0)) * 1_000_000,
                    "completion": float(pricing.get("completion", 0)) * 1_000_000,
                    "context": model.get("context_length", 0)
                }
    return None

def main():
    print("🔍 Buscando dados da OpenRouter...")
    or_models = fetch_openrouter_models()
    print(f"✅ {len(or_models)} modelos encontrados\n")
    
    # Modelos para adicionar (da pesquisa do Foil)
    new_models = [
        {
            "id": "google/gemini-3-pro",
            "name": "Gemini 3 Pro",
            "provider": "google",
            "arena_elo": 1490,
            "search_terms": ["gemini-3-pro", "gemini-3.0-pro"]
        },
        {
            "id": "anthropic/claude-opus-4-6",
            "name": "Claude Opus 4.6",
            "provider": "anthropic",
            "arena_elo_coding": 1510,
            "search_terms": ["claude-opus-4.6", "claude-opus-4-6", "opus-4"]
        },
        {
            "id": "openai/gpt-5-1",
            "name": "GPT-5.1",
            "provider": "openai",
            "search_terms": ["gpt-5.1", "gpt-5-2", "gpt-5"]
        },
        {
            "id": "thudm/glm-5",
            "name": "GLM-5",
            "provider": "thudm",
            "params": "744B MoE (44B active)",
            "search_terms": ["glm-5", "glm5"]
        },
        {
            "id": "deepseek/deepseek-v3-2",
            "name": "DeepSeek V3.2",
            "provider": "deepseek",
            "search_terms": ["deepseek-v3.2", "deepseek-v3", "deepseek-r1"]
        },
        {
            "id": "xai/grok-4-1",
            "name": "Grok 4.1",
            "provider": "xai",
            "search_terms": ["grok-4.1", "grok-4"]
        },
        {
            "id": "meta-llama/llama-4-scout",
            "name": "Llama 4 Scout",
            "provider": "meta-llama",
            "context_length": 10000000,  # 10M
            "search_terms": ["llama-4-scout", "llama-4"]
        },
        {
            "id": "qwen/qwen3-235b",
            "name": "Qwen3-235B",
            "provider": "qwen",
            "search_terms": ["qwen3-235b", "qwen3", "qwen-235b"]
        },
        {
            "id": "moonshotai/kimi-k2-5",
            "name": "Kimi K2.5",
            "provider": "moonshotai",
            "params": "1T MoE (32B active)",
            "search_terms": ["kimi-k2.5", "kimi-k2-5", "kimi-k2"]
        },
        {
            "id": "mistralai/mistral-medium-3-1",
            "name": "Mistral Medium 3.1",
            "provider": "mistralai",
            "search_terms": ["mistral-medium-3.1", "mistral-medium", "mistral-3"]
        }
    ]
    
    print("📊 Modelos da pesquisa (Fev/2026):\n")
    
    for model in new_models:
        pricing = find_model_pricing(or_models, model["search_terms"])
        
        if pricing:
            model["pricing"] = pricing
            print(f"✅ {model['name']}")
            print(f"   Input: ${pricing['prompt']:.2f}/1M")
            print(f"   Output: ${pricing['completion']:.2f}/1M")
            print(f"   Context: {pricing['context']:,} tokens\n")
        else:
            print(f"⚠️  {model['name']} - Não encontrado na OpenRouter")
            print(f"   (Pode ser novo ou nome diferente)\n")
    
    # Salvar resultado
    output = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "source": "openrouter_api",
        "models": new_models
    }
    
    with open("data/processed/new_models_pricing.json", "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Dados salvos em: data/processed/new_models_pricing.json")
    print("\n📝 Próximo passo: Inserir no banco via admin ou script SQL")

if __name__ == "__main__":
    main()
