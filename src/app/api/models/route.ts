import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/models - Lista todos os modelos usando views simplificadas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let sql = '';
    
    // Usar views simplificadas que funcionam com dados básicos
    switch (category) {
      case 'free':
        sql = 'SELECT * FROM value.v_rank_free';
        break;
      case 'under10':
        sql = 'SELECT * FROM value.v_rank_under_10';
        break;
      case '10to20':
        sql = 'SELECT * FROM value.v_rank_10_to_20';
        break;
      case 'under50':
        sql = 'SELECT * FROM value.v_rank_under_50';
        break;
      case 'unlimited':
        sql = 'SELECT * FROM value.v_rank_unlimited';
        break;
      default:
        sql = 'SELECT * FROM value.v_models_basic ORDER BY basic_value_score DESC';
    }
    
    const result = await query(sql);
    
    // Transforma para formato esperado pelo frontend
    const models = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      provider: row.provider,
      context_length: row.context_window,
      pricing: {
        prompt: parseFloat(row.price_input),
        completion: parseFloat(row.price_output),
      },
      cost_benefit_scores: {
        coding: parseFloat(row.basic_value_score) || 0,
        general: parseFloat(row.basic_value_score) || 0,
      },
      benchmarks: {
        arena_elo: null, // Ainda não coletado
        swe_bench_full: null, // Ainda não coletado
        intelligence_score: null, // Ainda não coletado
      },
      free_tier: row.estimated_monthly_cost === 0 ? {
        is_free: true,
        type: 'api',
        provider: row.provider,
      } : undefined,
      rank: row.rank,
      monthly_cost: parseFloat(row.estimated_monthly_cost),
    }));
    
    return NextResponse.json({ 
      models,
      total: models.length,
      updated_at: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models', details: String(error) },
      { status: 500 }
    );
  }
}
