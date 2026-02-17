"""
Script de execução manual para quando uma nova LLM é lançada.
Atualiza apenas os dados necessários sem rodar o pipeline completo.
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from collectors.openrouter import fetch_openrouter_models, normalize_model


def add_manual_model(model_id: str, model_data: dict, output_path: str = "data/processed/models.json"):
    """
    Adiciona ou atualiza um modelo específico no dataset.
    """
    output_file = Path(output_path)
    
    # Carrega dataset existente ou cria novo
    if output_file.exists():
        with open(output_file, "r", encoding="utf-8") as f:
            dataset = json.load(f)
    else:
        dataset = {"updated_at": None, "models": []}
    
    # Procura modelo existente
    existing_idx = None
    for i, m in enumerate(dataset["models"]):
        if m["id"] == model_id:
            existing_idx = i
            break
    
    # Adiciona metadata de atualização
    model_data["manually_added_at"] = datetime.utcnow().isoformat() + "Z"
    model_data["is_new_release"] = True
    
    if existing_idx is not None:
        dataset["models"][existing_idx] = model_data
        print(f"🔄 Modelo '{model_id}' atualizado")
    else:
        dataset["models"].append(model_data)
        print(f"➕ Modelo '{model_id}' adicionado")
    
    # Atualiza timestamp
    dataset["updated_at"] = datetime.utcnow().isoformat() + "Z"
    dataset["manual_update"] = True
    
    # Salva
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Dataset salvo em: {output_path}")


def update_from_openrouter(model_id: str):
    """
    Busca um modelo específico da OpenRouter e adiciona ao dataset.
    """
    print(f"🔍 Buscando modelo '{model_id}' na OpenRouter...")
    
    models = fetch_openrouter_models()
    
    # Procura pelo modelo
    target_model = None
    for m in models:
        if m.get("id") == model_id or model_id in m.get("id", ""):
            target_model = m
            break
    
    if not target_model:
        print(f"❌ Modelo '{model_id}' não encontrado na OpenRouter")
        print("💡 Modelos disponíveis (busca parcial):")
        for m in models:
            if model_id.split("/")[-1].lower() in m.get("id", "").lower():
                print(f"   - {m.get('id')}")
        return False
    
    normalized = normalize_model(target_model)
    add_manual_model(model_id, normalized)
    
    print(f"\n✅ Modelo '{model_id}' adicionado com sucesso!")
    print(f"   Preço input: ${normalized['pricing']['prompt']:.2f}/1M tokens")
    print(f"   Preço output: ${normalized['pricing']['completion']:.2f}/1M tokens")
    print(f"   Context: {normalized['context_length']:,} tokens")
    
    return True


def interactive_mode():
    """
    Modo interativo para adicionar modelo.
    """
    print("=" * 60)
    print("🚀 Adicionar Nova LLM ao Ranking")
    print("=" * 60)
    print()
    
    print("Como deseja adicionar o modelo?")
    print("1. Buscar automaticamente na OpenRouter API")
    print("2. Inserir dados manualmente (JSON)")
    print()
    
    choice = input("Opção (1/2): ").strip()
    
    if choice == "1":
        print("\n💡 Dica: Use o formato 'provider/model-name'")
        print("   Exemplos: anthropic/claude-3-opus, openai/gpt-4o")
        model_id = input("\nID do modelo: ").strip()
        
        if model_id:
            update_from_openrouter(model_id)
        else:
            print("❌ ID do modelo não pode ser vazio")
    
    elif choice == "2":
        print("\n Cole o JSON do modelo (Ctrl+D para finalizar):")
        json_input = sys.stdin.read().strip()
        
        try:
            model_data = json.loads(json_input)
            model_id = model_data.get("id", "manual-model")
            add_manual_model(model_id, model_data)
        except json.JSONDecodeError as e:
            print(f"❌ JSON inválido: {e}")
    
    else:
        print("❌ Opção inválida")


def main():
    parser = argparse.ArgumentParser(
        description="Atualização manual do ranking de LLMs"
    )
    parser.add_argument(
        "--model", "-m",
        help="ID do modelo na OpenRouter (ex: anthropic/claude-3-opus)"
    )
    parser.add_argument(
        "--json", "-j",
        help="Caminho para arquivo JSON com dados do modelo"
    )
    parser.add_argument(
        "--interactive", "-i",
        action="store_true",
        help="Modo interativo"
    )
    
    args = parser.parse_args()
    
    if args.interactive:
        interactive_mode()
    elif args.model:
        update_from_openrouter(args.model)
    elif args.json:
        with open(args.json, "r") as f:
            model_data = json.load(f)
            model_id = model_data.get("id", "unknown")
            add_manual_model(model_id, model_data)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
