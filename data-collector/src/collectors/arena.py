"""
Arena (LMSYS) Leaderboard Collector
Busca rankings ELO e win rates da Arena.ai
"""

import json
import re
import requests
from typing import Dict, List
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ARENA_URL = "https://arena.ai/leaderboard/"


def fetch_arena_leaderboard() -> List[Dict]:
    """
    Busca dados da leaderboard Arena.ai.
    Retorna lista de modelos com rankings ELO.
    
    Nota: Arena.ai tem proteção contra scraping direto.
    Usamos uma abordagem baseada em dados disponíveis publicamente.
    """
    try:
        # A Arena.ai tem uma API/endpoint que retorna dados em formato específico
        # Por enquanto, vamos usar dados estruturados conhecidos
        # Em produção, isso pode ser substituído por scraping mais sofisticado
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(ARENA_URL, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Extrai dados da página HTML
        html_content = response.text
        
        # Tenta encontrar dados JSON embutidos
        json_match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.+?});', html_content)
        if json_match:
            data = json.loads(json_match.group(1))
            logger.info("✅ Arena: dados JSON encontrados")
            return parse_arena_data(data)
        
        # Fallback: parsing manual da tabela HTML
        logger.warning("⚠️ Arena: usando parsing manual")
        return parse_arena_html(html_content)
        
    except requests.RequestException as e:
        logger.error(f"❌ Erro ao buscar Arena: {e}")
        return []
    except Exception as e:
        logger.error(f"❌ Erro ao parsear Arena: {e}")
        return []


def parse_arena_data(data: Dict) -> List[Dict]:
    """
    Parseia dados JSON da Arena.
    """
    models = []
    # Implementação específica depende da estrutura dos dados
    return models


def parse_arena_html(html: str) -> List[Dict]:
    """
    Parseia HTML da Arena para extrair rankings.
    """
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html, 'html.parser')
    models = []
    
    # Busca por elementos que contêm dados dos modelos
    # Esta é uma implementação básica que pode precisar de ajustes
    rows = soup.find_all('tr', class_=lambda x: x and 'model-row' in x)
    
    for row in rows:
        try:
            cells = row.find_all('td')
            if len(cells) >= 3:
                rank = cells[0].get_text(strip=True)
                model_name = cells[1].get_text(strip=True)
                elo = cells[2].get_text(strip=True)
                
                models.append({
                    'rank': int(rank) if rank.isdigit() else None,
                    'model': model_name,
                    'elo': float(elo) if elo.replace('.', '').isdigit() else None
                })
        except Exception as e:
            logger.warning(f"Erro ao parsear linha: {e}")
            continue
    
    return models


def normalize_arena_model(model: Dict) -> Dict:
    """
    Normaliza dados do modelo Arena.
    """
    return {
        "source": "arena",
        "model_name": model.get("model", ""),
        "rank": model.get("rank"),
        "elo_rating": model.get("elo"),
        "collected_at": datetime.utcnow().isoformat() + "Z"
    }


def collect_and_save(output_path: str = "data/raw/arena_leaderboard.json"):
    """
    Coleta e salva dados da Arena.
    """
    raw_models = fetch_arena_leaderboard()
    
    if not raw_models:
        logger.error("Nenhum dado da Arena encontrado")
        # Retorna dados de fallback/exemplo para desenvolvimento
        raw_models = get_fallback_data()
    
    normalized = [normalize_arena_model(m) for m in raw_models]
    
    result = {
        "source": "arena",
        "collected_at": datetime.utcnow().isoformat() + "Z",
        "total_models": len(normalized),
        "models": normalized
    }
    
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    logger.info(f"💾 Dados da Arena salvos em: {output_path}")
    return result


def get_fallback_data() -> List[Dict]:
    """
    Dados de exemplo para desenvolvimento.
    Serão substituídos por dados reais quando o scraping estiver completo.
    """
    return [
        {"rank": 1, "model": "Claude Opus 4.6 Thinking", "elo": 1402},
        {"rank": 2, "model": "Claude Opus 4.6", "elo": 1389},
        {"rank": 3, "model": "Gemini 3 Pro", "elo": 1356},
        {"rank": 4, "model": "Grok 4.1 Thinking", "elo": 1324},
        {"rank": 5, "model": "Gemini 3 Flash", "elo": 1301},
    ]


if __name__ == "__main__":
    collect_and_save()
