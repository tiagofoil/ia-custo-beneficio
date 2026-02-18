import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/models - Lista todos os modelos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let sql = '';
    
    switch (category) {
      case 'free':
        sql = 'SELECT * FROM value.rank_free';
        break;
      case 'under10':
        sql = 'SELECT * FROM value.rank_under_10';
        break;
      case '10to20':
        sql = 'SELECT * FROM value.rank_10_to_20';
        break;
      case 'under50':
        sql = 'SELECT * FROM value.rank_under_50';
        break;
      case 'unlimited':
        sql = 'SELECT * FROM value.rank_unlimited';
        break;
      default:
        sql = `
          SELECT 
            id, name, provider, context_length,
            pricing_prompt, pricing_completion,
            benchmark_arena_elo, benchmark_swe_bench_full, benchmark_intelligence_score,
            cost_benefit_coding, cost_benefit_general,
            free_tier_is_free, free_tier_type, free_tier_provider, 
            free_tier_limitations, free_tier_url, free_tier_requirements,
            created_at, updated_at
          FROM value.models 
          WHERE is_active = TRUE 
          ORDER BY created_at DESC
        `;
    }
    
    const result = await query(sql);
    
    // Transforma para formato esperado pelo frontend
    const models = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      provider: row.provider,
      context_length: row.context_length,
      pricing: {
        prompt: parseFloat(row.pricing_prompt),
        completion: parseFloat(row.pricing_completion),
      },
      benchmarks: {
        arena_elo: row.benchmark_arena_elo,
        swe_bench_full: row.benchmark_swe_bench_full ? parseFloat(row.benchmark_swe_bench_full) : null,
        intelligence_score: row.benchmark_intelligence_score,
      },
      cost_benefit_scores: {
        coding: row.cost_benefit_coding ? parseFloat(row.cost_benefit_coding) : 0,
        general: row.cost_benefit_general ? parseFloat(row.cost_benefit_general) : 0,
      },
      free_tier: row.free_tier_is_free ? {
        is_free: true,
        type: row.free_tier_type,
        provider: row.free_tier_provider,
        limitations: row.free_tier_limitations,
        url: row.free_tier_url,
        requirements: row.free_tier_requirements,
      } : undefined,
      rank: row.rank,
      monthly_cost: row.monthly_cost ? parseFloat(row.monthly_cost) : undefined,
    }));
    
    return NextResponse.json({ 
      models,
      total: models.length,
      updated_at: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// POST /api/models - Cria novo modelo (para admin)
export async function POST(request: Request) {
  try {
    // Verifica senha admin
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const sql = `
      INSERT INTO value.models (
        id, name, provider, context_length,
        pricing_prompt, pricing_completion,
        benchmark_arena_elo, benchmark_swe_bench_full, benchmark_intelligence_score,
        cost_benefit_coding, cost_benefit_general,
        free_tier_is_free, free_tier_type, free_tier_provider,
        free_tier_limitations, free_tier_url, free_tier_requirements,
        source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        provider = EXCLUDED.provider,
        context_length = EXCLUDED.context_length,
        pricing_prompt = EXCLUDED.pricing_prompt,
        pricing_completion = EXCLUDED.pricing_completion,
        benchmark_arena_elo = EXCLUDED.benchmark_arena_elo,
        benchmark_swe_bench_full = EXCLUDED.benchmark_swe_bench_full,
        benchmark_intelligence_score = EXCLUDED.benchmark_intelligence_score,
        cost_benefit_coding = EXCLUDED.cost_benefit_coding,
        cost_benefit_general = EXCLUDED.cost_benefit_general,
        free_tier_is_free = EXCLUDED.free_tier_is_free,
        free_tier_type = EXCLUDED.free_tier_type,
        free_tier_provider = EXCLUDED.free_tier_provider,
        free_tier_limitations = EXCLUDED.free_tier_limitations,
        free_tier_url = EXCLUDED.free_tier_url,
        free_tier_requirements = EXCLUDED.free_tier_requirements,
        updated_at = CURRENT_TIMESTAMP,
        source = EXCLUDED.source
      RETURNING *
    `;
    
    const values = [
      body.id,
      body.name,
      body.provider,
      body.context_length || 0,
      body.pricing?.prompt || 0,
      body.pricing?.completion || 0,
      body.benchmarks?.arena_elo || null,
      body.benchmarks?.swe_bench_full || null,
      body.benchmarks?.intelligence_score || null,
      body.cost_benefit_scores?.coding || null,
      body.cost_benefit_scores?.general || null,
      body.free_tier?.is_free || false,
      body.free_tier?.type || null,
      body.free_tier?.provider || null,
      body.free_tier?.limitations || null,
      body.free_tier?.url || null,
      body.free_tier?.requirements || null,
      body.source || 'manual',
    ];
    
    const result = await query(sql, values);
    
    return NextResponse.json({ 
      success: true,
      model: result.rows[0],
    });
    
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}

// DELETE /api/models - Remove modelo (soft delete)
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await query(
      'UPDATE value.models SET is_active = FALSE WHERE id = $1',
      [id]
    );
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
}
