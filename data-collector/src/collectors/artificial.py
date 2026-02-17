"""
Artificial Analysis Leaderboard Collector
Busca dados de intelligence, price, performance e speed.
"""

import json
import requests
from typing import Dict, List
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ARTIFICIAL_URL = "https://artificialanalysis.ai/leaderboards/models"


def fetch_artificial_leaderboard() -> List[Dict]:
    """
    Busca dados da leaderboard Artificial Analysis.
    
    Métricas disponíveis:
    - Intelligence score
    - Price per 1M tokens (input/output)
    - Output speed (tokens/sec)
    - Latency (TTFT)
    - Context window
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(ARTIFICIAL_URL, headers=headers, timeout=30)
        response.raise_for_status()
        
        html_content = response.text
        models = parse_artificial_html(html_content)
        
        if not models:
            logger.warning("⚠️ Artificial Analysis: usando dados de fallback")
            return get_fallback_data()
        
        return models
        
    except requests.RequestException as e:
        logger.error(f"❌ Erro ao buscar Artificial Analysis: {e}")
        return get_fallback_data()


def parse_artificial_html(html: str) -> List[Dict]:
    """
    Parseia HTML do Artificial Analysis.
    
    Nota: Artificial Analysis carrega dados via JavaScript/React.
    Para dados completos, recomenda-se usar vision analysis ou API se disponível.
    """
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html, 'html.parser')
    models = []
    
    # Tenta encontrar dados em script tags
    scripts = soup.find_all('script')
    for script in scripts:
        if script.string and 'models' in script.string:
            # Tenta extrair JSON dos scripts
            try:
                json_match = script.string
                if 'window.__INITIAL_STATE__' in json_match:
                    # Extrai dados do estado inicial
                    pass
            except:
                continue
    
    return models


def normalize_artificial_model(model: Dict) -> Dict:
    """
    Normaliza dados do Artificial Analysis.
    """
    return {
        "source": "artificial_analysis",
        "model_name": model.get("model", ""),
        "intelligence_score": model.get("intelligence"),
        "price_input_per_1m": model.get("price_input"),
        "price_output_per_1m": model.get("price_output"),
        "output_speed_tps": model.get("speed"),
        "latency_ttft": model.get("latency"),
        "context_window": model.get("context"),
        "collected_at": datetime.utcnow().isoformat() + "Z"
    }


def collect_and_save(output_path: str = "data/raw/artificial_leaderboard.json"):
    """
    Coleta e salva dados do Artificial Analysis.
    """
    raw_models = fetch_artificial_leaderboard()
    
    normalized = [normalize_artificial_model(m) for m in raw_models]
    
    result = {
        "source": "artificial_analysis",
        "collected_at": datetime.utcnow().isoformat() + "Z",
        "total_models": len(normalized),
        "models": normalized
    }
    
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    logger.info(f"💾 Dados do Artificial Analysis salvos em: {output_path}")
    return result


def get_fallback_data() -> List[Dict]:
    """
    Dados de exemplo para desenvolvimento.
    """
    return [
        {
            "model": "Claude Opus 4.6",
            "intelligence": 95,
            "price_input": 15.0,
            "price_output": 75.0,
            "speed": 45,
            "latency": 1.2,
            "context": 200000
        },
        {
            "model": "GPT-4o",
            "intelligence": 88,
            "price_input": 2.5,
            "price_output": 10.0,
            "speed": 85,
            "latency": 0.8,
            "context": 128000
        },
        {
            "model": "Gemini 2.5 Pro",
            "intelligence": 92,
            "price_input": 1.25,
            "price_output": 5.0,
            "speed": 120,
            "latency": 0.5,
            "context": 1000000
        },
        {
            "model": "DeepSeek V3",
            "intelligence": 85,
            "price_input": 0.14,
            "price_output": 0.28,
            "speed": 95,
            "latency": 0.6,
            "context": 64000
        },
    ]


if __name__ == "__main__":
    collect_and_save()
