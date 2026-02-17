"""
Script de execução semanal completa.
Roda via GitHub Actions todo domingo.
"""

import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from collectors.openrouter import fetch_openrouter_models, normalize_model
from collectors.arena import fetch_arena_leaderboard, normalize_arena_model
from collectors.swebench import fetch_swebench_leaderboard, normalize_swebench_model
from collectors.artificial import fetch_artificial_leaderboard, normalize_artificial_model


def run_weekly_update():
    """
    Executa a atualização completa semanal de todos os dados.
    """
    print("=" * 60)
    print("🔄 Atualização Semanal - IA Custo Benefício")
    print("=" * 60)
    print()
    
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    # 1. Coleta OpenRouter
    print("📡 1/4 Coletando dados da OpenRouter...")
    openrouter_models = fetch_openrouter_models()
    if openrouter_models:
        normalized_openrouter = [normalize_model(m) for m in openrouter_models]
        print(f"   ✅ {len(normalized_openrouter)} modelos coletados")
    else:
        print("   ❌ Falha ao coletar OpenRouter")
        normalized_openrouter = []
    
    # 2. Coleta Arena
    print("\n📡 2/4 Coletando dados do Arena...")
    arena_models = fetch_arena_leaderboard()
    if arena_models:
        normalized_arena = [normalize_arena_model(m) for m in arena_models]
        print(f"   ✅ {len(normalized_arena)} modelos coletados")
    else:
        print("   ⚠️ Usando dados de fallback")
        normalized_arena = []
    
    # 3. Coleta SWE-bench
    print("\n📡 3/4 Coletando dados do SWE-bench...")
    swebench_models = fetch_swebench_leaderboard()
    if swebench_models:
        normalized_swebench = [normalize_swebench_model(m) for m in swebench_models]
        print(f"   ✅ {len(normalized_swebench)} modelos coletados")
    else:
        print("   ⚠️ Usando dados de fallback")
        normalized_swebench = []
    
    # 4. Coleta Artificial Analysis
    print("\n📡 4/4 Coletando dados do Artificial Analysis...")
    artificial_models = fetch_artificial_leaderboard()
    if artificial_models:
        normalized_artificial = [normalize_artificial_model(m) for m in artificial_models]
        print(f"   ✅ {len(normalized_artificial)} modelos coletados")
    else:
        print("   ⚠️ Usando dados de fallback")
        normalized_artificial = []
    
    # 5. Compila dataset final
    print("\n📊 Compilando dataset final...")
    
    dataset = {
        "updated_at": timestamp,
        "update_type": "weekly",
        "sources": {
            "openrouter": {"models_count": len(normalized_openrouter), "status": "ok"},
            "arena": {"models_count": len(normalized_arena), "status": "ok"},
            "swebench": {"models_count": len(normalized_swebench), "status": "ok"},
            "artificial_analysis": {"models_count": len(normalized_artificial), "status": "ok"}
        },
        "models": normalized_openrouter,
        "benchmarks": {
            "arena": normalized_arena,
            "swebench": normalized_swebench,
            "artificial_analysis": normalized_artificial
        }
    }
    
    # Salva dataset
    output_dir = Path(__file__).parent.parent / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "models.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Dataset salvo em: {output_file}")
    print(f"   Total de modelos: {len(normalized_openrouter)}")
    print(f"   Timestamp: {timestamp}")
    
    # Gera resumo
    print("\n📈 Resumo de Preços (top 5 mais baratos):")
    sorted_by_price = sorted(
        [m for m in normalized_openrouter if m.get("pricing", {}).get("prompt", 0) > 0],
        key=lambda x: x["pricing"]["prompt"]
    )[:5]
    
    for i, m in enumerate(sorted_by_price, 1):
        price = m["pricing"]["prompt"]
        print(f"   {i}. {m['id']}: ${price:.4f}/1M tokens")
    
    return dataset


if __name__ == "__main__":
    run_weekly_update()
