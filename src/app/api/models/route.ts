import { NextResponse } from 'next/server';

// DADOS ESTÁTICOS - 24 LLMs com preços reais do OpenRouter
const LLMS = [
  { id: 'openai/gpt-5', name: 'GPT-5', provider: 'OpenAI', context_window: 400000, price_input: 1.25, price_output: 10.00 },
  { id: 'openai/gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', context_window: 400000, price_input: 1.25, price_output: 10.00 },
  { id: 'openai/gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', context_window: 400000, price_input: 1.75, price_output: 14.00 },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', context_window: 128000, price_input: 2.50, price_output: 10.00 },
  { id: 'openai/o1', name: 'o1', provider: 'OpenAI', context_window: 200000, price_input: 15.00, price_output: 60.00 },
  { id: 'openai/o1-pro', name: 'o1 Pro', provider: 'OpenAI', context_window: 200000, price_input: 150.00, price_output: 600.00 },
  { id: 'openai/o3-mini', name: 'o3-mini', provider: 'OpenAI', context_window: 200000, price_input: 1.10, price_output: 4.40 },
  { id: 'anthropic/claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', context_window: 200000, price_input: 15.00, price_output: 75.00 },
  { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic', context_window: 200000, price_input: 5.00, price_output: 25.00 },
  { id: 'anthropic/claude-opus-4.6', name: 'Claude Opus 4.6', provider: 'Anthropic', context_window: 1000000, price_input: 5.00, price_output: 25.00 },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', context_window: 1000000, price_input: 3.00, price_output: 15.00 },
  { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', context_window: 1000000, price_input: 3.00, price_output: 15.00 },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', context_window: 1048576, price_input: 1.25, price_output: 10.00 },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', context_window: 1048576, price_input: 0.30, price_output: 2.50 },
  { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek', context_window: 163840, price_input: 0.26, price_output: 0.38 },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', context_window: 64000, price_input: 0.70, price_output: 2.50 },
  { id: 'meta-llama/llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta', context_window: 327680, price_input: 0.08, price_output: 0.30 },
  { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', context_window: 1048576, price_input: 0.15, price_output: 0.60 },
  { id: 'moonshotai/kimi-k2', name: 'Kimi K2', provider: 'Moonshot', context_window: 131072, price_input: 0.50, price_output: 2.40 },
  { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5', provider: 'Moonshot', context_window: 262144, price_input: 0.23, price_output: 3.00 },
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral', context_window: 128000, price_input: 2.00, price_output: 6.00 },
  { id: 'mistralai/mistral-medium-3', name: 'Mistral Medium 3', provider: 'Mistral', context_window: 131072, price_input: 0.40, price_output: 2.00 },
  { id: 'mistralai/mistral-medium-3.1', name: 'Mistral Medium 3.1', provider: 'Mistral', context_window: 131072, price_input: 0.40, price_output: 2.00 },
  { id: 'minimax/minimax-m2.5', name: 'MiniMax M2.5', provider: 'MiniMax', context_window: 196608, price_input: 0.30, price_output: 1.10 },
];

// Calcular score de value (mais barato = maior score)
function calculateValueScore(priceIn: number, priceOut: number): number {
  const monthly = priceIn * 1.0 + priceOut * 0.5;
  return monthly > 0 ? 1000.0 / monthly : 0;
}

// Transformar para formato do frontend
function transformModel(llm: typeof LLMS[0], rank: number) {
  const valueScore = calculateValueScore(llm.price_input, llm.price_output);
  const monthlyCost = llm.price_input * 1.0 + llm.price_output * 0.5;
  
  return {
    id: llm.id,
    name: llm.name,
    provider: llm.provider,
    context_length: llm.context_window,
    pricing: {
      prompt: llm.price_input,
      completion: llm.price_output,
    },
    cost_benefit_scores: {
      coding: valueScore,
      general: valueScore,
    },
    benchmarks: {
      arena_elo: null,
      swe_bench_full: null,
      intelligence_score: null,
    },
    rank,
    monthly_cost: monthlyCost,
  };
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'under10';
    
    let filtered = [...LLMS];
    
    // Filtrar por categoria
    switch (category) {
      case 'free':
        filtered = filtered.filter(m => m.price_input === 0 && m.price_output === 0);
        break;
      case 'under10':
        filtered = filtered.filter(m => {
          const cost = m.price_input * 1.0 + m.price_output * 0.5;
          return cost > 0 && cost < 10;
        });
        // Ordenar por value (mais barato primeiro)
        filtered.sort((a, b) => {
          const scoreA = calculateValueScore(a.price_input, a.price_output);
          const scoreB = calculateValueScore(b.price_input, b.price_output);
          return scoreB - scoreA;
        });
        break;
      case '10to20':
        filtered = filtered.filter(m => {
          const cost = m.price_input * 1.0 + m.price_output * 0.5;
          return cost >= 10 && cost <= 20;
        });
        filtered.sort((a, b) => {
          const scoreA = calculateValueScore(a.price_input, a.price_output);
          const scoreB = calculateValueScore(b.price_input, b.price_output);
          return scoreB - scoreA;
        });
        break;
      case 'under50':
        filtered = filtered.filter(m => {
          const cost = m.price_input * 1.0 + m.price_output * 0.5;
          return cost > 20 && cost < 50;
        });
        filtered.sort((a, b) => {
          const scoreA = calculateValueScore(a.price_input, a.price_output);
          const scoreB = calculateValueScore(b.price_input, b.price_output);
          return scoreB - scoreA;
        });
        break;
      case 'unlimited':
        // Ordenar por contexto (maior primeiro)
        filtered.sort((a, b) => b.context_window - a.context_window);
        break;
      default:
        filtered.sort((a, b) => {
          const scoreA = calculateValueScore(a.price_input, a.price_output);
          const scoreB = calculateValueScore(b.price_input, b.price_output);
          return scoreB - scoreA;
        });
    }
    
    const models = filtered.map((m, i) => transformModel(m, i + 1));
    
    return NextResponse.json({ 
      models,
      total: models.length,
      updated_at: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models', details: String(error) },
      { status: 500 }
    );
  }
}
