import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    database_url_set: !!process.env.DATABASE_URL,
    tests: []
  };
  
  // Test 1: Conexão básica
  try {
    const result = await query('SELECT NOW() as time');
    diagnostics.tests.push({
      name: 'connection',
      status: 'OK',
      time: result.rows[0].time
    });
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'connection',
      status: 'FAILED',
      error: error.message,
      code: error.code
    });
    return NextResponse.json(diagnostics, { status: 500 });
  }
  
  // Test 2: Verificar tabelas
  try {
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'value'
    `);
    diagnostics.tests.push({
      name: 'tables',
      status: 'OK',
      count: tables.rows.length,
      tables: tables.rows.map(r => r.table_name)
    });
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'tables',
      status: 'FAILED',
      error: error.message
    });
  }
  
  // Test 3: Verificar views
  try {
    const views = await query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'value'
    `);
    diagnostics.tests.push({
      name: 'views',
      status: 'OK',
      count: views.rows.length,
      views: views.rows.map(r => r.table_name)
    });
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'views',
      status: 'FAILED',
      error: error.message
    });
  }
  
  // Test 4: Contar LLMs
  try {
    const count = await query('SELECT COUNT(*) as count FROM value.llm_master_list');
    diagnostics.tests.push({
      name: 'llm_count',
      status: 'OK',
      count: parseInt(count.rows[0].count)
    });
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'llm_count',
      status: 'FAILED',
      error: error.message
    });
  }
  
  // Test 5: Tentar SELECT na view
  try {
    const viewTest = await query('SELECT * FROM value.v_models_basic LIMIT 1');
    diagnostics.tests.push({
      name: 'view_query',
      status: 'OK',
      rows_returned: viewTest.rows.length,
      sample: viewTest.rows[0]?.name || 'no data'
    });
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'view_query',
      status: 'FAILED',
      error: error.message,
      hint: error.hint
    });
  }
  
  return NextResponse.json(diagnostics);
}
