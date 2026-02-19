import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: any = {};
  
  // 1. Verificar LLMs
  try {
    const llms = await query('SELECT id, name FROM value.llm_master_list LIMIT 5');
    results.llms = llms.rows;
  } catch (e: any) {
    results.llms_error = e.message;
  }
  
  // 2. Verificar benchmarks
  try {
    const bench = await query('SELECT llm_id, price_input FROM value.benchmarks LIMIT 5');
    results.benchmarks = bench.rows;
  } catch (e: any) {
    results.benchmarks_error = e.message;
  }
  
  // 3. Verificar se IDs correspondem
  try {
    const match = await query(`
      SELECT lm.id as llm_id, b.llm_id as bench_id
      FROM value.llm_master_list lm
      FULL OUTER JOIN value.benchmarks b ON b.llm_id = lm.id
      LIMIT 10
    `);
    results.id_matching = match.rows;
  } catch (e: any) {
    results.match_error = e.message;
  }
  
  // 4. Contar matches
  try {
    const counts = await query(`
      SELECT 
        (SELECT COUNT(*) FROM value.llm_master_list) as llm_count,
        (SELECT COUNT(*) FROM value.benchmarks) as bench_count,
        (SELECT COUNT(*) FROM value.llm_master_list lm 
         JOIN value.benchmarks b ON b.llm_id = lm.id) as match_count
    `);
    results.counts = counts.rows[0];
  } catch (e: any) {
    results.counts_error = e.message;
  }
  
  // 5. Ver estrutura da tabela benchmarks
  try {
    const cols = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'benchmarks' AND table_schema = 'value'
    `);
    results.benchmark_columns = cols.rows;
  } catch (e: any) {
    results.columns_error = e.message;
  }
  
  return NextResponse.json(results);
}
