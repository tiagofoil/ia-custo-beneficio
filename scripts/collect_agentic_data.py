#!/usr/bin/env python3
"""
Agentic LLM Data Collector
Coleta todos os benchmarks para programadores usando agents
Sources: Artificial Analysis, SWE-bench, BFCL, OpenRouter, etc.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Config
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
PERPLEXITY_MODEL = "perplexity/sonar-deep-research"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Lista mestre de LLMs que fazem coding/agentic (Source of Truth inicial)
AGENTIC_LLM_MASTER_LIST = [
    # OpenAI
    {"id": "openai/gpt-5", "name": "GPT-5", "provider": "OpenAI", "family": "GPT"},
    {"id": "openai/gpt-5.1", "name": "GPT-5.1", "provider": "OpenAI", "family": "GPT"},
    {"id": "openai/gpt-5.2", "name": "GPT-5.2", "provider": "OpenAI", "family": "GPT"},
    {"id": "openai/gpt-4o", "name": "GPT-4o", "provider": "OpenAI", "family": "GPT"},
    {"id": "openai/o1", "name": "o1", "provider": "OpenAI", "family": "o-series", "reasoning": True},
    {"id": "openai/o1-pro", "name": "o1 Pro", "provider": "OpenAI", "family": "o-series", "reasoning": True},
    {"id": "openai/o3-mini", "name": "o3-mini", "provider": "OpenAI", "family": "o-series", "reasoning": True},
    
    # Anthropic
    {"id": "anthropic/claude-opus-4", "name": "Claude Opus 4", "provider": "Anthropic", "family": "Claude"},
    {"id": "anthropic/claude-opus-4.5", "name": "Claude Opus 4.5", "provider": "Anthropic", "family": "Claude"},
    {"id": "anthropic/claude-opus-4.6", "name": "Claude Opus 4.6", "provider": "Anthropic", "family": "Claude"},
    {"id": "anthropic/claude-sonnet-4", "name": "Claude Sonnet 4", "provider": "Anthropic", "family": "Claude"},
    {"id": "anthropic/claude-sonnet-4.5", "name": "Claude Sonnet 4.5", "provider": "Anthropic", "family": "Claude"},
    {"id": "anthropic/claude-haiku-4", "name": "Claude Haiku 4", "provider": "Anthropic", "family": "Claude"},
    
    # Google
    {"id": "google/gemini-2.5-pro", "name": "Gemini 2.5 Pro", "provider": "Google", "family": "Gemini"},
    {"id": "google/gemini-2.5-flash", "name": "Gemini 2.5 Flash", "provider": "Google", "family": "Gemini"},
    {"id": "google/gemini-3-pro", "name": "Gemini 3 Pro", "provider": "Google", "family": "Gemini"},
    {"id": "google/gemini-3-flash", "name": "Gemini 3 Flash", "provider": "Google", "family": "Gemini"},
    
    # DeepSeek
    {"id": "deepseek/deepseek-v3", "name": "DeepSeek V3", "provider": "DeepSeek", "family": "DeepSeek"},
    {"id": "deepseek/deepseek-v3.2", "name": "DeepSeek V3.2", "provider": "DeepSeek", "family": "DeepSeek"},
    {"id": "deepseek/deepseek-r1", "name": "DeepSeek R1", "provider": "DeepSeek", "family": "DeepSeek", "reasoning": True},
    {"id": "deepseek/deepseek-coder", "name": "DeepSeek Coder", "provider": "DeepSeek", "family": "DeepSeek"},
    
    # Meta
    {"id": "meta-llama/llama-3.3-70b", "name": "Llama 3.3 70B", "provider": "Meta", "family": "Llama"},
    {"id": "meta-llama/llama-3.3-405b", "name": "Llama 3.3 405B", "provider": "Meta", "family": "Llama"},
    {"id": "meta-llama/llama-4-scout", "name": "Llama 4 Scout", "provider": "Meta", "family": "Llama"},
    {"id": "meta-llama/llama-4-maverick", "name": "Llama 4 Maverick", "provider": "Meta", "family": "Llama"},
    
    # Zhipu (GLM)
    {"id": "thudm/glm-4", "name": "GLM-4", "provider": "Zhipu", "family": "GLM"},
    {"id": "thudm/glm-4.5", "name": "GLM-4.5", "provider": "Zhipu", "family": "GLM"},
    {"id": "thudm/glm-5", "name": "GLM-5", "provider": "Zhipu", "family": "GLM"},
    
    # Moonshot (Kimi)
    {"id": "moonshotai/kimi-k2", "name": "Kimi K2", "provider": "Moonshot", "family": "Kimi"},
    {"id": "moonshotai/kimi-k2.5", "name": "Kimi K2.5", "provider": "Moonshot", "family": "Kimi"},
    
    # Qwen
    {"id": "qwen/qwen2.5-72b", "name": "Qwen2.5 72B", "provider": "Alibaba", "family": "Qwen"},
    {"id": "qwen/qwen2.5-110b", "name": "Qwen2.5 110B", "provider": "Alibaba", "family": "Qwen"},
    {"id": "qwen/qwen3-235b", "name": "Qwen3-235B", "provider": "Alibaba", "family": "Qwen"},
    
    # Mistral
    {"id": "mistralai/mistral-large", "name": "Mistral Large", "provider": "Mistral", "family": "Mistral"},
    {"id": "mistralai/mistral-medium-3", "name": "Mistral Medium 3", "provider": "Mistral", "family": "Mistral"},
    {"id": "mistralai/mistral-medium-3.1", "name": "Mistral Medium 3.1", "provider": "Mistral", "family": "Mistral"},
    {"id": "mistralai/codestral", "name": "Codestral", "provider": "Mistral", "family": "Mistral"},
    
    # xAI
    {"id": "xai/grok-3", "name": "Grok 3", "provider": "xAI", "family": "Grok"},
    {"id": "xai/grok-4", "name": "Grok 4", "provider": "xAI", "family": "Grok"},
    {"id": "xai/grok-4.1", "name": "Grok 4.1", "provider": "xAI", "family": "Grok"},
    
    # Cohere
    {"id": "cohere/command-r", "name": "Command R", "provider": "Cohere", "family": "Command"},
    {"id": "cohere/command-r-plus", "name": "Command R+", "provider": "Cohere", "family": "Command"},
    
    # MiniMax
    {"id": "minimax/minimax-m2.5", "name": "MiniMax M2.5", "provider": "MiniMax", "family": "MiniMax"},
]

def fetch_openrouter_data():
    """Busca preços e popularity do OpenRouter"""
    try:
        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/models",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://value.ai-foil.com"
            }
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            return {m['id']: m for m in data.get('data', [])}
    except Exception as e:
        print(f"❌ OpenRouter error: {e}")
        return {}

def find_model_data(openrouter_models, search_ids):
    """Busca modelo nos dados do OpenRouter"""
    for model_id in search_ids:
        if model_id in openrouter_models:
            return openrouter_models[model_id]
    return None

def collect_all_data():
    """Coleta todos os benchmarks"""
    print("=" * 60)
    print("🤖 Agentic LLM Data Collector")
    print("=" * 60)
    print()
    
    # 1. Buscar dados do OpenRouter
    print("🔍 Fetching OpenRouter data...")
    or_data = fetch_openrouter_data()
    print(f"✅ Found {len(or_data)} models on OpenRouter\n")
    
    # 2. Para cada modelo na lista mestre, buscar dados
    results = []
    
    for llm in AGENTIC_LLM_MASTER_LIST:
        print(f"Processing: {llm['name']}")
        
        # Buscar no OpenRouter
        or_model = find_model_data(or_data, [llm['id']])
        
        if or_model:
            pricing = or_model.get('pricing', {})
            result = {
                **llm,
                'openrouter_found': True,
                'price_input': float(pricing.get('prompt', 0)) * 1000000,
                'price_output': float(pricing.get('completion', 0)) * 1000000,
                'context_window': or_model.get('context_length', 0),
                'openrouter_popularity': or_model.get('popularity', 0),
            }
        else:
            result = {
                **llm,
                'openrouter_found': False,
                'price_input': None,
                'price_output': None,
                'context_window': None,
            }
        
        results.append(result)
        print(f"  {'✅' if result['openrouter_found'] else '❌'} Price: ${result.get('price_input', 'N/A')}/1M")
    
    # Salvar resultados
    output = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'total_models': len(results),
        'found_on_openrouter': sum(1 for r in results if r['openrouter_found']),
        'models': results
    }
    
    os.makedirs('data/processed', exist_ok=True)
    with open('data/processed/agentic_llm_base_data.json', 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Saved to: data/processed/agentic_llm_base_data.json")
    print(f"📊 Total: {len(results)} models")
    print(f"✅ Found on OpenRouter: {output['found_on_openrouter']}")
    print(f"❌ Missing: {len(results) - output['found_on_openrouter']}")
    
    return results

def main():
    if not OPENROUTER_API_KEY:
        print("❌ OPENROUTER_API_KEY not set")
        sys.exit(1)
    
    collect_all_data()

if __name__ == "__main__":
    main()
