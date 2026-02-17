"""
Cost-Benefit Calculator
Calcula índices de custo-benefício combinando preços e benchmarks.
"""

import json
from typing import Dict, List, Optional
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def calculate_cost_benefit_score(
    price_per_1m: float,
    benchmark_score: Optional[float],
    benchmark_type: str = "coding"
) -> float:
    """
    Calcula score de custo-benefício.
    
    Fórmula: (benchmark_score / price_per_1m) * 100
    
    Quanto maior o score, melhor o custo-benefício.
    """
    if not benchmark_score or price_per_1m <= 0:
        return 0.0
    
    # Normaliza o score baseado no tipo de benchmark
    if benchmark_type == "coding":
        # SWE-bench: 0-100%
        normalized_score = benchmark_score
    elif benchmark_type == "elo":
        # ELO: tipicamente 1200-1500
        normalized_score = (benchmark_score - 1200) / 3  # Normaliza para ~0-100
    elif benchmark_type == "intelligence":
        # Intelligence score: 0-100
        normalized_score = benchmark_score
    else:
        normalized_score = benchmark_score
    
    # Calcula custo-benefício
    cost_benefit = (normalized_score / price_per_1m) * 100
    
    return round(cost_benefit, 2)


def merge_model_data(
    openrouter_models: List[Dict],
    arena_models: List[Dict],
    swebench_models: List[Dict],
    artificial_models: List[Dict]
) -> List[Dict]:
    """
    Combina dados de todas as fontes em um dataset unificado.
    """
    merged = []
    
    for model in openrouter_models:
        model_id = model.get("id", "")
        model_name = model.get("name", "")
        
        # Busca benchmarks correspondentes
        arena_data = find_matching_model(model_id, model_name, arena_models)
        swebench_data = find_matching_model(model_id, model_name, swebench_models)
        artificial_data = find_matching_model(model_id, model_name, artificial_models)
        
        # Calcula scores de custo-benefício
        price_prompt = model.get("pricing", {}).get("prompt", 0)
        price_completion = model.get("pricing", {}).get("completion", 0)
        avg_price = (price_prompt + price_completion) / 2 if price_completion > 0 else price_prompt
        
        merged_model = {
            "id": model_id,
            "name": model_name,
            "provider": model_id.split("/")[0] if "/" in model_id else "unknown",
            "context_length": model.get("context_length", 0),
            "pricing": model.get("pricing", {}),
            "benchmarks": {
                "arena_elo": arena_data.get("elo_rating") if arena_data else None,
                "swe_bench_full": swebench_data.get("swe_bench_full") if swebench_data else None,
                "intelligence_score": artificial_data.get("intelligence_score") if artificial_data else None,
            },
            "cost_benefit_scores": {
                "coding": calculate_cost_benefit_score(
                    avg_price,
                    swebench_data.get("swe_bench_full") if swebench_data else None,
                    "coding"
                ),
                "general": calculate_cost_benefit_score(
                    avg_price,
                    artificial_data.get("intelligence_score") if artificial_data else None,
                    "intelligence"
                ),
            }
        }
        
        merged.append(merged_model)
    
    return merged


def find_matching_model(model_id: str, model_name: str, benchmark_list: List[Dict]) -> Optional[Dict]:
    """
    Encontra o modelo correspondente na lista de benchmarks.
    """
    model_id_lower = model_id.lower()
    model_name_lower = model_name.lower()
    
    for bench_model in benchmark_list:
        bench_name = bench_model.get("model_name", "").lower()
        
        # Tenta match por nome
        if bench_name in model_id_lower or bench_name in model_name_lower:
            return bench_model
        
        # Tenta match parcial
        if any(part in bench_name for part in model_id_lower.split("/")[-1].split("-") if len(part) > 3):
            return bench_model
    
    return None


def calculate_rankings(merged_models: List[Dict]) -> Dict:
    """
    Calcula rankings por diferentes critérios.
    """
    rankings = {
        "by_price": [],
        "by_coding_cost_benefit": [],
        "by_general_cost_benefit": [],
        "by_context_window": [],
    }
    
    # Ranking por preço (input)
    sorted_by_price = sorted(
        [m for m in merged_models if m.get("pricing", {}).get("prompt", 0) > 0],
        key=lambda x: x["pricing"]["prompt"]
    )
    rankings["by_price"] = [
        {"rank": i+1, "model_id": m["id"], "price": m["pricing"]["prompt"]}
        for i, m in enumerate(sorted_by_price[:50])
    ]
    
    # Ranking por custo-benefício (coding)
    sorted_by_coding_cb = sorted(
        [m for m in merged_models if m.get("cost_benefit_scores", {}).get("coding", 0) > 0],
        key=lambda x: x["cost_benefit_scores"]["coding"],
        reverse=True
    )
    rankings["by_coding_cost_benefit"] = [
        {"rank": i+1, "model_id": m["id"], "score": m["cost_benefit_scores"]["coding"]}
        for i, m in enumerate(sorted_by_coding_cb[:50])
    ]
    
    # Ranking por custo-benefício (general)
    sorted_by_general_cb = sorted(
        [m for m in merged_models if m.get("cost_benefit_scores", {}).get("general", 0) > 0],
        key=lambda x: x["cost_benefit_scores"]["general"],
        reverse=True
    )
    rankings["by_general_cost_benefit"] = [
        {"rank": i+1, "model_id": m["id"], "score": m["cost_benefit_scores"]["general"]}
        for i, m in enumerate(sorted_by_general_cb[:50])
    ]
    
    # Ranking por context window
    sorted_by_context = sorted(
        [m for m in merged_models if m.get("context_length", 0) > 0],
        key=lambda x: x["context_length"],
        reverse=True
    )
    rankings["by_context_window"] = [
        {"rank": i+1, "model_id": m["id"], "context": m["context_length"]}
        for i, m in enumerate(sorted_by_context[:50])
    ]
    
    return rankings


def generate_final_dataset(
    openrouter_path: str = "data/raw/openrouter_models.json",
    arena_path: str = "data/raw/arena_leaderboard.json",
    swebench_path: str = "data/raw/swebench_leaderboard.json",
    artificial_path: str = "data/raw/artificial_leaderboard.json",
    output_path: str = "data/processed/final_dataset.json"
):
    """
    Gera o dataset final consolidado.
    """
    print("🔄 Gerando dataset final...")
    
    # Carrega dados
    with open(openrouter_path, "r") as f:
        openrouter_data = json.load(f)
    
    openrouter_models = openrouter_data.get("models", [])
    
    # Tenta carregar outros dados (podem não existir na primeira execução)
    arena_models = []
    swebench_models = []
    artificial_models = []
    
    try:
        with open(arena_path, "r") as f:
            arena_models = json.load(f).get("models", [])
    except FileNotFoundError:
        logger.warning("Arena data not found, using empty list")
    
    try:
        with open(swebench_path, "r") as f:
            swebench_models = json.load(f).get("models", [])
    except FileNotFoundError:
        logger.warning("SWE-bench data not found, using empty list")
    
    try:
        with open(artificial_path, "r") as f:
            artificial_models = json.load(f).get("models", [])
    except FileNotFoundError:
        logger.warning("Artificial Analysis data not found, using empty list")
    
    # Merge dados
    merged_models = merge_model_data(
        openrouter_models,
        arena_models,
        swebench_models,
        artificial_models
    )
    
    # Calcula rankings
    rankings = calculate_rankings(merged_models)
    
    # Gera dataset final
    final_dataset = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "total_models": len(merged_models),
        "models": merged_models,
        "rankings": rankings
    }
    
    # Salva
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_dataset, f, indent=2, ensure_ascii=False)
    
    logger.info(f"✅ Dataset final salvo em: {output_path}")
    logger.info(f"   Total: {len(merged_models)} modelos")
    logger.info(f"   Rankings calculados: {len(rankings)}")
    
    return final_dataset


if __name__ == "__main__":
    generate_final_dataset()
