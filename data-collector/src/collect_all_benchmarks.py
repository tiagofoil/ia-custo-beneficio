"""
Unified Benchmark Collector
Consolida dados de todas as fontes e atualiza o banco de dados
"""

import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from collectors.artificial_analysis import fetch_intelligence_index
from collectors.arena import fetch_arena_elo
from collectors.swe_bench import fetch_swe_bench
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def collect_all_benchmarks():
    """
    Coleta benchmarks de todas as fontes disponíveis.
    """
    logger.info("=" * 60)
    logger.info("Coletando benchmarks de todas as fontes...")
    logger.info("=" * 60)
    
    # Coletar de cada fonte
    intelligence = fetch_intelligence_index()
    arena_elo = fetch_arena_elo()
    swe_bench = fetch_swe_bench()
    
    # Unificar em estrutura comum
    all_models = set(intelligence.keys()) | set(arena_elo.keys()) | set(swe_bench.keys())
    
    unified = {}
    for model_id in all_models:
        unified[model_id] = {
            "intelligence_score": intelligence.get(model_id),
            "arena_elo": arena_elo.get(model_id),
            "swe_bench": swe_bench.get(model_id),
        }
    
    result = {
        "collected_at": datetime.utcnow().isoformat() + "Z",
        "total_models": len(unified),
        "sources": {
            "artificial_analysis": len(intelligence),
            "chatbot_arena": len(arena_elo),
            "swe_bench": len(swe_bench),
        },
        "benchmarks": unified
    }
    
    # Salvar
    output_path = "data/processed/benchmarks_unified.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    logger.info(f"\n✅ Total: {len(unified)} modelos com benchmarks")
    logger.info(f"💾 Salvo em: {output_path}")
    
    return result


def generate_sql_updates(benchmarks_data: dict) -> str:
    """
    Gera SQL para atualizar o banco de dados.
    """
    sql_lines = ["-- Update benchmarks in database", ""]
    
    for model_id, scores in benchmarks_data["benchmarks"].items():
        updates = []
        
        if scores.get("intelligence_score"):
            updates.append(f"artificial_analysis_intelligence_score = {scores['intelligence_score']}")
        if scores.get("arena_elo"):
            updates.append(f"leaderboard_ai_score = {scores['arena_elo']}")
        if scores.get("swe_bench"):
            updates.append(f"swe_bench_verified = {scores['swe_bench']}")
        
        if updates:
            sql = f"""UPDATE value.benchmarks 
SET {', '.join(updates)}
WHERE llm_id = '{model_id}';"""
            sql_lines.append(sql)
    
    sql_lines.append("")
    sql_lines.append("-- Verify updates")
    sql_lines.append("SELECT lm.name, b.swe_bench_verified, b.artificial_analysis_intelligence_score, b.leaderboard_ai_score")
    sql_lines.append("FROM value.llm_master_list lm")
    sql_lines.append("JOIN value.benchmarks b ON b.llm_id = lm.id")
    sql_lines.append("WHERE b.swe_bench_verified IS NOT NULL")
    sql_lines.append("ORDER BY b.swe_bench_verified DESC;")
    
    return "\n".join(sql_lines)


def main():
    """
    Executa coleta completa e gera SQL.
    """
    # Coletar
    data = collect_all_benchmarks()
    
    # Gerar SQL
    sql = generate_sql_updates(data)
    
    sql_path = "database/update_benchmarks.sql"
    os.makedirs(os.path.dirname(sql_path), exist_ok=True)
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write(sql)
    
    logger.info(f"📝 SQL gerado: {sql_path}")
    logger.info("\nPara aplicar no banco:")
    logger.info(f"  psql $DATABASE_URL -f {sql_path}")
    
    return data


if __name__ == "__main__":
    main()
