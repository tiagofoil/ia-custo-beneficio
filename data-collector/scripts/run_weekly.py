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
        normalized = [normalize_model(m) for m in openrouter_models]
        print(f"   ✅ {len(normalized)} modelos coletados")
    else:
        print("   ❌ Falha ao coletar OpenRouter")
        normalized = []
    
    # 2. Coleta SWE-bench (placeholder - implementar scraping)
    print("\n📡 2/4 Coletando dados do SWE-bench...")
    print("   ⏳ Implementar scraping da leaderboard")
    swebench_data = {}
    
    # 3. Coleta Arena/LMSYS (placeholder - implementar)
    print("\n📡 3/4 Coletando dados do Arena...")
    print("   ⏳ Implementar coleta da leaderboard")
    arena_data = {}
    
    # 4. Coleta Artificial Analysis (placeholder - implementar)
    print("\n📡 4/4 Coletando dados do Artificial Analysis...")
    print("   ⏳ Implementar scraping ou vision analysis")
    artificial_data = {}
    
    # 5. Compila dataset final
    print("\n📊 Compilando dataset final...")
    
    dataset = {
        "updated_at": timestamp,
        "update_type": "weekly",
        "sources": {
            "openrouter": {"models_count": len(normalized), "status": "ok"},
            "swebench": {"status": "pending"},
            "arena": {"status": "pending"},
            "artificial_analysis": {"status": "pending"}
        },
        "models": normalized
    }
    
    # Salva dataset
    output_dir = Path(__file__).parent.parent / "data" / "processed"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "models.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Dataset salvo em: {output_file}")
    print(f"   Total de modelos: {len(normalized)}")
    print(f"   Timestamp: {timestamp}")
    
    # Gera resumo
    print("\n📈 Resumo de Preços (top 5 mais baratos):")
    sorted_by_price = sorted(
        [m for m in normalized if m.get("pricing", {}).get("prompt", 0) > 0],
        key=lambda x: x["pricing"]["prompt"]
    )[:5]
    
    for i, m in enumerate(sorted_by_price, 1):
        price = m["pricing"]["prompt"]
        print(f"   {i}. {m['id']}: ${price:.4f}/1M tokens")
    
    return dataset


if __name__ == "__main__":
    run_weekly_update()
