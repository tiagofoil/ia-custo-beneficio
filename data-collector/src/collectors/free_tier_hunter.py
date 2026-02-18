#!/usr/bin/env python3
"""
Free Tier Hunter - Busca LLM free tiers temporários na internet
Usa Perplexity Sonar via OpenRouter para encontrar promoções atuais
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime
from typing import Dict, List, Optional

# Config - Usa OpenRouter para acessar Perplexity
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
PERPLEXITY_MODEL = "perplexity/sonar-deep-research"
OUTPUT_FILE = "data/processed/free_tiers_temp.json"

# Modelos para monitorar
TARGET_MODELS = [
    "GLM-5",
    "GLM-4",
    "Kimi K2.5",
    "DeepSeek V3",
    "DeepSeek Coder",
    "Llama 3.3",
    "Llama 3.2",
    "Qwen 3.5",
    "MiniMax",
    "Gemini 2.5 Pro",
    "Gemini 2.5 Flash",
    "GPT-4o",
    "GPT-4o Mini",
    "Claude 3 Opus",
    "Claude 3 Sonnet",
    "Claude 3 Haiku",
    "Mistral Large",
    "Codestral",
]

# IDs e plataformas conhecidas
PLATFORMS = [
    "OpenCode",
    "Opencode",
    "Zen",
    "GitHub Copilot",
    "Cursor",
    "Windsurf",
    "Continue.dev",
    "Zed",
    "Trae",
    "Sourcegraph Cody",
    "Tabnine",
    "Replit",
    "Bolt.new",
    "Vercel AI SDK",
    "Amazon CodeWhisperer",
    "JetBrains AI",
    "Google AI Studio",
    "OpenRouter",
    "Groq",
    "Together AI",
    "Fireworks AI",
    "Baseten",
]


def search_free_tiers_with_perplexity() -> List[Dict]:
    """
    Usa Perplexity Sonar via OpenRouter para buscar free tiers atuais.
    """
    if not OPENROUTER_API_KEY:
        print("❌ OPENROUTER_API_KEY não configurada")
        print("💡 Configure a variável de ambiente OPENROUTER_API_KEY")
        return []
    
    free_tiers = []
    
    # Query estratégica para encontrar free tiers
    query = f"""Which AI/LLM models are currently offering FREE access or free tiers in February 2026?

Specifically look for:
1. Temporary free access promotions
2. Free tiers through IDEs (Cursor, Windsurf, Zed, Trae, etc.)
3. Free tiers through platforms (GitHub Copilot, OpenCode, etc.)
4. Free API credits for specific models
5. "Powered by" free access (e.g., "GLM-5 free on Opencode Zen")

Models to check: {', '.join(TARGET_MODELS[:10])}

For each free tier found, provide:
- Model name
- Platform/IDE offering free access
- Limitations (if any)
- How to access (URL or steps)
- Is it temporary or permanent free tier
- Last verified date

Be specific and current. Focus on February 2026 active offers."""
    
    try:
        payload = {
            "model": PERPLEXITY_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a research assistant specialized in finding AI/LLM free tiers and promotions. Be thorough, current, and provide actionable information."
                },
                {
                    "role": "user",
                    "content": query
                }
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
                "X-Title": "Free Tier Hunter"
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=120) as response:
            data = json.loads(response.read().decode('utf-8'))
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            print(f"✅ Perplexity via OpenRouter respondeu ({len(content)} chars)")
            
            free_tiers.append({
                "source": "perplexity_sonar_deep_research",
                "query_date": datetime.utcnow().isoformat() + "Z",
                "raw_content": content,
                "parsed": False
            })
        
    except urllib.error.HTTPError as e:
        print(f"❌ Erro na API OpenRouter: HTTP {e.code}")
        print(f"   Response: {e.read().decode('utf-8')[:200]}")
    except Exception as e:
        print(f"❌ Erro na API OpenRouter: {e}")
    
    return free_tiers


def search_specific_platform_promos() -> List[Dict]:
    """
    Busca promoções específicas por plataforma via OpenRouter.
    """
    if not OPENROUTER_API_KEY:
        return []
    
    promotions = []
    
    # Busca por plataforma específica conhecida
    platforms_to_check = [
        "Opencode",
        "Cursor",
        "Windsurf",
        "Zed IDE",
        "GitHub Copilot free",
        "Amazon CodeWhisperer free"
    ]
    
    for platform in platforms_to_check[:3]:  # Limita para não gastar muitos tokens
        query = f"What free LLM models or free tiers does {platform} offer in February 2026? Any promotions or temporary free access?"
        
        try:
            payload = {
                "model": PERPLEXITY_MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                "max_tokens": 1000,
                "temperature": 0.1
            }
            
            req = urllib.request.Request(
                OPENROUTER_API_URL,
                data=json.dumps(payload).encode('utf-8'),
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://value.ai-foil.com",
                    "X-Title": "Free Tier Hunter"
                },
                method='POST'
            )
            
            with urllib.request.urlopen(req, timeout=120) as response:
                data = json.loads(response.read().decode('utf-8'))
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                promotions.append({
                    "platform": platform,
                    "content": content,
                    "date": datetime.utcnow().isoformat() + "Z"
                })
                
                print(f"✅ {platform}: encontrado info")
                
        except Exception as e:
            print(f"⚠️ Erro buscando {platform}: {e}")
    
    return promotions


def save_results(free_tiers: List[Dict], promotions: List[Dict], output_file: str):
    """
    Salva resultados em JSON.
    """
    result = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "source": "perplexity_sonar_deep_research_via_openrouter",
        "search_summary": {
            "models_checked": len(TARGET_MODELS),
            "platforms_checked": len(PLATFORMS),
            "free_tiers_found": len(free_tiers),
            "platform_promos_found": len(promotions)
        },
        "free_tiers": free_tiers,
        "platform_promotions": promotions,
        "needs_manual_review": True,  # Flag para revisão humana
        "next_search_recommended": (datetime.utcnow().isoformat() + "Z")  # Semanal
    }
    
    # Cria diretório se não existir
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Resultados salvos em: {output_file}")
    print(f"📊 {len(free_tiers)} free tiers gerais")
    print(f"📊 {len(promotions)} promoções por plataforma")


def generate_frontend_json(output_file: str):
    """
    Gera um JSON processado pronto para o frontend consumir.
    """
    output = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "free_tiers": [],
        "temporary_promotions": [],
        "local_models": []
    }
    
    # Carrega dados brutos se existirem
    if os.path.exists(output_file):
        with open(output_file, "r") as f:
            raw_data = json.load(f)
        
        # Aqui faria o parsing inteligente do conteúdo
        # Por enquanto, mantém estrutura simples
        output["raw_research"] = raw_data
    
    frontend_file = "public/data/free_tiers_dynamic.json"
    os.makedirs(os.path.dirname(frontend_file), exist_ok=True)
    
    with open(frontend_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Frontend data em: {frontend_file}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Busca LLM free tiers na internet via OpenRouter")
    parser.add_argument("--api-key", help="OpenRouter API Key")
    parser.add_argument("--quick", action="store_true", help="Busca rápida (só geral)")
    parser.add_argument("--output", default=OUTPUT_FILE, help="Arquivo de saída")
    
    args = parser.parse_args()
    
    # Seta API key
    if args.api_key:
        os.environ["OPENROUTER_API_KEY"] = args.api_key
    
    print("=" * 60)
    print("🔍 Free Tier Hunter - Perplexity Sonar via OpenRouter")
    print("=" * 60)
    print()
    
    # Busca geral
    print("🌐 Buscando free tiers atuais...")
    free_tiers = search_free_tiers_with_perplexity()
    
    promotions = []
    if not args.quick:
        print("\n🔍 Buscando promoções por plataforma...")
        promotions = search_specific_platform_promos()
    
    # Salva resultados
    save_results(free_tiers, promotions, args.output)
    
    # Gera frontend JSON
    generate_frontend_json(args.output)
    
    print("\n✅ Busca completa!")
    print("⚠️  IMPORTANTE: Revise os resultados manualmente antes de publicar")
    print("📝 Edite o arquivo JSON para estruturar os free tiers encontrados")


if __name__ == "__main__":
    main()
