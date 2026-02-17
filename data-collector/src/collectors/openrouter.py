"""
OpenRouter API Collector
Busca dados de preços e capabilities de todos os modelos disponíveis.
"""

import json
import requests
from typing import Dict, List, Optional
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/models"


def fetch_openrouter_models() -> List[Dict]:
    """
    Busca todos os modelos da OpenRouter API.
    Retorna lista de modelos com preços e metadata.
    """
    try:
        response = requests.get(OPENROUTER_API_URL, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        models = data.get("data", [])
        logger.info(f"✅ OpenRouter: {len(models)} modelos encontrados")
        
        return models
        
    except requests.RequestException as e:
        logger.error(f"❌ Erro ao buscar OpenRouter: {e}")
        return []


def normalize_model(model: Dict) -> Dict:
    """
    Normaliza os dados de um modelo da OpenRouter.
    """
    pricing = model.get("pricing", {})
    
    return {
        "id": model.get("id", ""),
        "name": model.get("name", ""),
        "description": model.get("description", ""),
        "context_length": model.get("context_length", 0),
        "pricing": {
            "prompt": float(pricing.get("prompt", 0)) * 1_000_000,  # por 1M tokens
            "completion": float(pricing.get("completion", 0)) * 1_000_000,
            "image": float(pricing.get("image", 0)) if pricing.get("image") else None,
            "request": float(pricing.get("request", 0)) if pricing.get("request") else None,
        },
        "top_provider": model.get("top_provider", {}),
        "architecture": model.get("architecture", {}),
        "per_request_limits": model.get("per_request_limits"),
    }


def collect_and_save(output_path: str = "data/raw/openrouter_models.json"):
    """
    Coleta e salva dados da OpenRouter.
    """
    raw_models = fetch_openrouter_models()
    
    if not raw_models:
        logger.error("Nenhum modelo encontrado")
        return None
    
    normalized = [normalize_model(m) for m in raw_models]
    
    result = {
        "source": "openrouter",
        "collected_at": datetime.utcnow().isoformat() + "Z",
        "total_models": len(normalized),
        "models": normalized
    }
    
    # Salva arquivo
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    logger.info(f"💾 Dados salvos em: {output_path}")
    return result


if __name__ == "__main__":
    collect_and_save()
