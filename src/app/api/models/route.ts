import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'intermediate';
    
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
        AND lm.is_active = TRUE
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
    let models = result.rows.map((row: any) => {
      const monthlyCost = parseFloat(row.monthly_cost);
      const sweBench = row.swe_bench_verified ? parseFloat(row.swe_bench_verified) : null;
      const intelligence = row.intelligence_score ? parseFloat(row.intelligence_score) : null;
      const arenaElo = row.arena_elo ? parseFloat(row.arena_elo) : null;
      const agentic = row.agentic_score ? parseFloat(row.agentic_score) : null;
      const bfcl = row.bfcl_score ? parseFloat(row.bfcl_score) : null;
      const aider = row.aider_polyglot_score ? parseFloat(row.aider_polyglot_score) : null;
      
      // Calculate composite performance score (0-100)
      // Weights: SWE-bench 40%, Intelligence 25%, Arena 15%, Agentic 10%, BFCL 5%, Aider 5%
      let performanceScore = 0;
      let performanceCount = 0;
      
      if (sweBench) { performanceScore += sweBench * 0.40; performanceCount++; }
      if (intelligence) { performanceScore += intelligence * 0.25; performanceCount++; }
      if (arenaElo) { performanceScore += ((arenaElo - 1200) / 13) * 0.15; performanceCount++; }
      if (agentic) { performanceScore += agentic * 0.10; performanceCount++; }
      if (bfcl) { performanceScore += bfcl * 0.05; performanceCount++; }
      if (aider) { performanceScore += aider * 0.05; performanceCount++; }
      
      // Normalize if we have partial data
      if (performanceCount > 0 && performanceCount < 6) {
        performanceScore = performanceScore * (6 / performanceCount);
      }
      
      // Value score (just inverse price)
      const valueScore = monthlyCost > 0 ? 1000.0 / monthlyCost : 0;
      
      // INTERMEDIATE: Hybrid formula - Performance 70%, Price 30%
      const intermediateScore = (performanceScore * 0.70) + (Math.min(valueScore / 10, 100) * 0.30);
      
      return {
        id: row.id,
        name: row.name,
        provider: row.provider,
        context_length: row.context_window,
        pricing: {
          prompt: parseFloat(row.price_input),
          completion: parseFloat(row.price_output),
        },
        performance: {
          swe_bench: sweBench,
          intelligence: intelligence,
          arena_elo: arenaElo,
          agentic: agentic,
          bfcl: bfcl,
          aider: aider,
          composite: performanceScore,
        },
        scores: {
          performance: performanceScore,
          value: valueScore,
          intermediate: intermediateScore,
        },
        monthly_cost: monthlyCost,
      };
    });
    
    // Sort by category
    switch (category) {
      case 'cost-savings':
        // Sort by price only (cheapest first)
        models.sort((a: any, b: any) => a.monthly_cost - b.monthly_cost);
        break;
        
      case 'best-performance':
        // Sort by performance only (best first)
        models.sort((a: any, b: any) => b.scores.performance - a.scores.performance);
        break;
        
      case 'intermediate':
      default:
        // Sort by intermediate score (performance 70%, price 30%)
        models.sort((a: any, b: any) => b.scores.intermediate - a.scores.intermediate);
        break;
    }
    
    // Add rank
    models = models.map((m: any, i: number) => ({ ...m, rank: i + 1 }));
    
    return NextResponse.json({ 
      models,
      total: models.length,
      category,
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
