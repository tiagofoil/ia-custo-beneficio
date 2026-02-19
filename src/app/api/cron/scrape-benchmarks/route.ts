import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// This endpoint is called by Vercel Cron to update benchmarks
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Import scraper dynamically to avoid loading Playwright on every request
    const { scrapeAllBenchmarks } = await import('@/lib/scraper');
    
    console.log('[Cron] Starting benchmark scraping...');
    const results = await scrapeAllBenchmarks();
    
    // Update database with new data
    const updateResults = await updateBenchmarksInDB(results);
    
    return NextResponse.json({
      success: true,
      scraped: results.length,
      updated: updateResults.updated,
      errors: updateResults.errors,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('[Cron] Scraping failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

async function updateBenchmarksInDB(results: any[]) {
  let updated = 0;
  let errors = 0;
  
  for (const result of results) {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      if (result.intelligence_score) {
        updates.push(`artificial_analysis_intelligence_score = $${paramIndex++}`);
        values.push(result.intelligence_score);
      }
      if (result.arena_elo) {
        updates.push(`leaderboard_ai_score = $${paramIndex++}`);
        values.push(result.arena_elo);
      }
      if (result.swe_bench) {
        updates.push(`swe_bench_verified = $${paramIndex++}`);
        values.push(result.swe_bench);
      }
      if (result.agentic_score) {
        updates.push(`agentic_score = $${paramIndex++}`);
        values.push(result.agentic_score);
      }
      if (result.bfcl_score) {
        updates.push(`bfcl_score = $${paramIndex++}`);
        values.push(result.bfcl_score);
      }
      
      if (updates.length > 0) {
        values.push(result.model_id);
        await query(
          `UPDATE value.benchmarks SET ${updates.join(', ')} WHERE llm_id = $${paramIndex}`,
          values
        );
        updated++;
      }
    } catch (e) {
      console.error(`[Cron] Failed to update ${result.model_id}:`, e);
      errors++;
    }
  }
  
  return { updated, errors };
}
