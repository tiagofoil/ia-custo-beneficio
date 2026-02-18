import { query } from '../src/lib/db';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('🚀 Starting migration...\n');

  // Ler dados do JSON
  const jsonPath = path.join(__dirname, '../public/data/models.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const models = data.models;

  console.log(`📊 Found ${models.length} models in JSON\n`);

  // Limpar tabela atual (truncate)
  console.log('🧹 Cleaning database...');
  await query('TRUNCATE TABLE value.models RESTART IDENTITY CASCADE');
  console.log('✅ Database cleaned\n');

  // Inserir modelos
  console.log('💾 Inserting models...');
  
  for (const m of models) {
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
    `;

    const values = [
      m.id,
      m.name,
      m.provider,
      m.context_length || 0,
      m.pricing?.prompt || 0,
      m.pricing?.completion || 0,
      m.benchmarks?.arena_elo || null,
      m.benchmarks?.swe_bench_full || null,
      m.benchmarks?.intelligence_score || null,
      m.cost_benefit_scores?.coding || null,
      m.cost_benefit_scores?.general || null,
      m.free_tier?.is_free || false,
      m.free_tier?.type || null,
      m.free_tier?.provider || null,
      m.free_tier?.limitations || null,
      m.free_tier?.url || null,
      m.free_tier?.requirements || null,
      'json_migration'
    ];

    await query(sql, values);
    console.log(`  ✅ ${m.name}`);
  }

  console.log(`\n✅ Migration complete! ${models.length} models inserted.`);
  
  // Verificar contagem
  const result = await query('SELECT COUNT(*) as count FROM value.models');
  console.log(`📊 Total models in database: ${result.rows[0].count}`);
  
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
