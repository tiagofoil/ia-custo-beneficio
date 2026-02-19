#!/usr/bin/env node
/**
 * Script para popular o banco de dados Neon com 24 LLMs
 * Executa: node scripts/populate-db.js
 */

const { Pool } = require('pg');

const LLMS = [
  // OpenAI
  { id: 'openai/gpt-5', name: 'GPT-5', provider: 'OpenAI', family: 'GPT', ctx: 400000, reasoning: false, price_in: 1.25, price_out: 10.00 },
  { id: 'openai/gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', family: 'GPT', ctx: 400000, reasoning: false, price_in: 1.25, price_out: 10.00 },
  { id: 'openai/gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', family: 'GPT', ctx: 400000, reasoning: false, price_in: 1.75, price_out: 14.00 },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', family: 'GPT', ctx: 128000, reasoning: false, price_in: 2.50, price_out: 10.00 },
  { id: 'openai/o1', name: 'o1', provider: 'OpenAI', family: 'o-series', ctx: 200000, reasoning: true, price_in: 15.00, price_out: 60.00 },
  { id: 'openai/o1-pro', name: 'o1 Pro', provider: 'OpenAI', family: 'o-series', ctx: 200000, reasoning: true, price_in: 150.00, price_out: 600.00 },
  { id: 'openai/o3-mini', name: 'o3-mini', provider: 'OpenAI', family: 'o-series', ctx: 200000, reasoning: true, price_in: 1.10, price_out: 4.40 },
  
  // Anthropic
  { id: 'anthropic/claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', family: 'Claude', ctx: 200000, reasoning: false, price_in: 15.00, price_out: 75.00 },
  { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic', family: 'Claude', ctx: 200000, reasoning: false, price_in: 5.00, price_out: 25.00 },
  { id: 'anthropic/claude-opus-4.6', name: 'Claude Opus 4.6', provider: 'Anthropic', family: 'Claude', ctx: 1000000, reasoning: false, price_in: 5.00, price_out: 25.00 },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', family: 'Claude', ctx: 1000000, reasoning: false, price_in: 3.00, price_out: 15.00 },
  { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', family: 'Claude', ctx: 1000000, reasoning: false, price_in: 3.00, price_out: 15.00 },
  
  // Google
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', family: 'Gemini', ctx: 1048576, reasoning: false, price_in: 1.25, price_out: 10.00 },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', family: 'Gemini', ctx: 1048576, reasoning: false, price_in: 0.30, price_out: 2.50 },
  
  // DeepSeek
  { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek', family: 'DeepSeek', ctx: 163840, reasoning: false, price_in: 0.26, price_out: 0.38 },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', family: 'DeepSeek', ctx: 64000, reasoning: true, price_in: 0.70, price_out: 2.50 },
  
  // Meta
  { id: 'meta-llama/llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta', family: 'Llama', ctx: 327680, reasoning: false, price_in: 0.08, price_out: 0.30 },
  { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', family: 'Llama', ctx: 1048576, reasoning: false, price_in: 0.15, price_out: 0.60 },
  
  // Moonshot
  { id: 'moonshotai/kimi-k2', name: 'Kimi K2', provider: 'Moonshot', family: 'Kimi', ctx: 131072, reasoning: false, price_in: 0.50, price_out: 2.40 },
  { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5', provider: 'Moonshot', family: 'Kimi', ctx: 262144, reasoning: false, price_in: 0.23, price_out: 3.00 },
  
  // Mistral
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral', family: 'Mistral', ctx: 128000, reasoning: false, price_in: 2.00, price_out: 6.00 },
  { id: 'mistralai/mistral-medium-3', name: 'Mistral Medium 3', provider: 'Mistral', family: 'Mistral', ctx: 131072, reasoning: false, price_in: 0.40, price_out: 2.00 },
  { id: 'mistralai/mistral-medium-3.1', name: 'Mistral Medium 3.1', provider: 'Mistral', family: 'Mistral', ctx: 131072, reasoning: false, price_in: 0.40, price_out: 2.00 },
  
  // MiniMax
  { id: 'minimax/minimax-m2.5', name: 'MiniMax M2.5', provider: 'MiniMax', family: 'MiniMax', ctx: 196608, reasoning: false, price_in: 0.30, price_out: 1.10 },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set');
    console.log('Set it with: export DATABASE_URL="postgresql://..."');
    process.exit(1);
  }

  console.log('🚀 Connecting to Neon database...\n');
  
  const pool = new Pool({ connectionString: databaseUrl });
  
  try {
    // Limpar dados antigos
    console.log('🧹 Clearing old data...');
    await pool.query('DELETE FROM value.benchmarks');
    await pool.query('DELETE FROM value.llm_master_list');
    console.log('✅ Old data cleared\n');
    
    // Inserir LLMs
    console.log('📥 Inserting 24 LLMs...');
    for (const llm of LLMS) {
      await pool.query(`
        INSERT INTO value.llm_master_list 
        (id, name, provider, model_family, context_window, supports_coding, supports_agents, supports_reasoning, is_active)
        VALUES ($1, $2, $3, $4, $5, true, true, $6, true)
        ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name,
          provider = EXCLUDED.provider,
          context_window = EXCLUDED.context_window
      `, [llm.id, llm.name, llm.provider, llm.family, llm.ctx, llm.reasoning]);
    }
    console.log('✅ LLMs inserted\n');
    
    // Inserir preços
    console.log('💰 Inserting prices...');
    for (const llm of LLMS) {
      await pool.query(`
        INSERT INTO value.benchmarks 
        (llm_id, price_input, price_output, context_window, data_source)
        VALUES ($1, $2, $3, $4, 'openrouter_feb2026')
        ON CONFLICT DO NOTHING
      `, [llm.id, llm.price_in, llm.price_out, llm.ctx]);
    }
    console.log('✅ Prices inserted\n');
    
    // Verificar
    const llmCount = await pool.query('SELECT COUNT(*) FROM value.llm_master_list');
    const benchCount = await pool.query('SELECT COUNT(*) FROM value.benchmarks');
    
    console.log('📊 Results:');
    console.log(`   LLMs: ${llmCount.rows[0].count}`);
    console.log(`   Benchmarks: ${benchCount.rows[0].count}\n`);
    
    // Mostrar top 5 por preço
    const top5 = await pool.query(`
      SELECT lm.name, lm.provider, b.price_input, b.price_output
      FROM value.llm_master_list lm
      JOIN value.benchmarks b ON b.llm_id = lm.id
      ORDER BY b.price_input ASC
      LIMIT 5
    `);
    
    console.log('🏆 Top 5 (cheapest):');
    top5.rows.forEach((row, i) => {
      console.log(`   ${i+1}. ${row.name} ($${row.price_in}/1M in)`);
    });
    
    console.log('\n✅ Database populated successfully!');
    console.log('   Visit: https://value.ai-foil.com');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
