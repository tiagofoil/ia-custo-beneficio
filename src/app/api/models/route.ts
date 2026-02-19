import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'under10';
    
    // Query direta no banco - SEM usar views
    const sql = `
      SELECT 
        lm.id,
        lm.name,
        lm.provider,
        lm.context_window,
        b.price_input,
        b.price_output,
        b.price_input * 1.0 + b.price_output * 0.5 as monthly_cost
      FROM value.llm_master_list lm
      INNER JOIN value.benchmarks b ON b.llm_id = lm.id
      WHERE b.price_input IS NOT NULL 
        AND b.price_output IS NOT NULL
        AND b.price_input >= 0
        AND b.price_output >= 0
    `;
    
    const result = await query(sql);
    
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'No data in database',
        models: [],
        total: 0
      }, { status: 500 });
    }
    
    // Filtrar e ordenar na API
    let models = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      provider: row.provider,
      context_length: row.context_window,
      pricing: {
        prompt: parseFloat(row.price_input),
        completion: parseFloat(row.price_output),
      },
      cost_benefit_scores: {
        coding: row.monthly_cost > 0 ? 1000.0 / row.monthly_cost : 0,
        general: row.monthly_cost > 0 ? 1000.0 / row.monthly_cost : 0,
      },
      benchmarks: {
        arena_elo: null,
        swe_bench_full: null,
        intelligence_score: null,
      },
      monthly_cost: parseFloat(row.monthly_cost),
    }));
    
    // Filtrar por categoria
    switch (category) {
      case 'free':
        models = models.filter((m: any) => m.monthly_cost === 0);
        break;
      case 'under10':
        models = models.filter((m: any) => m.monthly_cost > 0 && m.monthly_cost < 10);
        models.sort((a: any, b: any) => b.cost_benefit_scores.coding - a.cost_benefit_scores.coding);
        break;
      case '10to20':
        models = models.filter((m: any) => m.monthly_cost >= 10 && m.monthly_cost <= 20);
        models.sort((a: any, b: any) => b.cost_benefit_scores.coding - a.cost_benefit_scores.coding);
        break;
      case 'under50':
        models = models.filter((m: any) => m.monthly_cost > 20 && m.monthly_cost < 50);
        models.sort((a: any, b: any) => b.cost_benefit_scores.coding - a.cost_benefit_scores.coding);
        break;
      case 'unlimited':
        models.sort((a: any, b: any) => b.context_length - a.context_length);
        break;
    }
    
    // Adicionar rank
    models = models.map((m: any, i: number) => ({ ...m, rank: i + 1 }));
    
    return NextResponse.json({ 
      models,
      total: models.length,
      source: 'database',
      updated_at: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      error: 'Database query failed',
      details: error.message,
      models: [],
      total: 0
    }, { status: 500 });
  }
}
