import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'under10';
    
    // Query with ALL benchmark columns
    const sql = `
      SELECT 
        lm.id,
        lm.name,
        lm.provider,
        lm.context_window,
        b.price_input,
        b.price_output,
        b.price_input * 1.0 + b.price_output * 0.5 as monthly_cost,
        b.swe_bench_verified,
        b.agentic_score,
        b.artificial_analysis_intelligence_score as intelligence_score,
        b.bfcl_score,
        b.leaderboard_ai_score as arena_elo,
        b.aider_polyglot_score
      FROM value.llm_master_list lm
      INNER JOIN value.benchmarks b ON b.llm_id = lm.id
      WHERE b.price_input IS NOT NULL 
        AND b.price_output IS NOT NULL
    `;
    
    const result = await query(sql);
    
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'No data in database',
        models: [],
        total: 0
      }, { status: 500 });
    }
    
    // Transform data
    let models = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      provider: row.provider,
      context_length: row.context_window,
      pricing: {
        prompt: parseFloat(row.price_input),
        completion: parseFloat(row.price_output),
      },
      // Value score = Performance / Price (currently just 1/price since no perf data)
      cost_benefit_scores: {
        coding: row.monthly_cost > 0 ? 1000.0 / row.monthly_cost : 0,
        general: row.monthly_cost > 0 ? 1000.0 / row.monthly_cost : 0,
      },
      // Individual benchmark scores
      benchmarks: {
        swe_bench: row.swe_bench_verified ? parseFloat(row.swe_bench_verified) : null,
        agentic: row.agentic_score ? parseFloat(row.agentic_score) : null,
        intelligence: row.intelligence_score ? parseFloat(row.intelligence_score) : null,
        bfcl: row.bfcl_score ? parseFloat(row.bfcl_score) : null,
        arena_elo: row.arena_elo ? parseFloat(row.arena_elo) : null,
        aider: row.aider_polyglot_score ? parseFloat(row.aider_polyglot_score) : null,
      },
      monthly_cost: parseFloat(row.monthly_cost),
    }));
    
    // Filter by category
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
        // Sort by performance (if available) or context
        models.sort((a: any, b: any) => {
          const perfA = a.benchmarks.swe_bench || a.benchmarks.intelligence || 0;
          const perfB = b.benchmarks.swe_bench || b.benchmarks.intelligence || 0;
          return perfB - perfA;
        });
        break;
    }
    
    // Add rank
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
