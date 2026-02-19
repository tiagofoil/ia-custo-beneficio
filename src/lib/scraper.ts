/**
 * Real Web Scraper using Playwright + Chromium for Serverless
 * Scrapes benchmarks from Artificial Analysis, Arena, SWE-bench
 */

import chromium from '@sparticuz/chromium';
import { chromium as playwrightChromium } from 'playwright-core';

interface ScrapedBenchmark {
  model_id: string;
  source: string;
  intelligence_score?: number;
  arena_elo?: number;
  swe_bench?: number;
  agentic_score?: number;
  bfcl_score?: number;
  scraped_at: string;
}

// Model name mapping from site-specific names to OpenRouter IDs
const MODEL_MAPPINGS: Record<string, string> = {
  'GPT-5': 'openai/gpt-5',
  'GPT-5.1': 'openai/gpt-5.1', 
  'GPT-5.2': 'openai/gpt-5.2',
  'GPT-4o': 'openai/gpt-4o',
  'o1': 'openai/o1',
  'o1-pro': 'openai/o1-pro',
  'o3-mini': 'openai/o3-mini',
  'Claude Opus 4': 'anthropic/claude-opus-4',
  'Claude Opus 4.5': 'anthropic/claude-opus-4.5',
  'Claude Opus 4.6': 'anthropic/claude-opus-4.6',
  'Claude Sonnet 4': 'anthropic/claude-sonnet-4',
  'Claude Sonnet 4.5': 'anthropic/claude-sonnet-4.5',
  'Gemini 2.5 Pro': 'google/gemini-2.5-pro',
  'Gemini 2.5 Flash': 'google/gemini-2.5-flash',
  'Gemini 3 Pro': 'google/gemini-3-pro',
  'DeepSeek V3.2': 'deepseek/deepseek-v3.2',
  'DeepSeek R1': 'deepseek/deepseek-r1',
  'Llama 4 Scout': 'meta-llama/llama-4-scout',
  'Llama 4 Maverick': 'meta-llama/llama-4-maverick',
  'Kimi K2': 'moonshotai/kimi-k2',
  'Kimi K2.5': 'moonshotai/kimi-k2.5',
  'Mistral Large': 'mistralai/mistral-large',
  'Mistral Medium 3': 'mistralai/mistral-medium-3',
  'Mistral Medium 3.1': 'mistralai/mistral-medium-3.1',
  'MiniMax M2.5': 'minimax/minimax-m2.5',
};

export async function scrapeAllBenchmarks(): Promise<ScrapedBenchmark[]> {
  const results: ScrapedBenchmark[] = [];
  const timestamp = new Date().toISOString();
  
  console.log('[Scraper] Launching browser with @sparticuz/chromium...');
  
  // Launch browser with @sparticuz/chromium for serverless compatibility
  const browser = await playwrightChromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  
  try {
    // Scrape each source
    const sources = [
      { name: 'artificial_analysis', scrape: scrapeArtificialAnalysis },
      { name: 'arena', scrape: scrapeArena },
      { name: 'swe_bench', scrape: scrapeSWEBench },
    ];
    
    for (const source of sources) {
      console.log(`[Scraper] Scraping ${source.name}...`);
      try {
        const data = await source.scrape(browser);
        results.push(...data.map(d => ({ 
          model_id: d.model_id || 'unknown',
          source: d.source || source.name,
          intelligence_score: d.intelligence_score,
          arena_elo: d.arena_elo,
          swe_bench: d.swe_bench,
          agentic_score: d.agentic_score,
          bfcl_score: d.bfcl_score,
          scraped_at: timestamp 
        })));
        console.log(`[Scraper] ${source.name}: ${data.length} models`);
      } catch (e: any) {
        console.error(`[Scraper] ${source.name} failed:`, e.message);
      }
    }
    
  } finally {
    await browser.close();
    console.log('[Scraper] Browser closed');
  }
  
  // Merge results by model_id
  const merged = mergeResults(results);
  console.log(`[Scraper] Total unique models: ${merged.length}`);
  
  return merged;
}

async function scrapeArtificialAnalysis(browser: any): Promise<Partial<ScrapedBenchmark>[]> {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    await page.waitForSelector('table, [data-testid]', { timeout: 10000 });
    
    const data = await page.evaluate(() => {
      const rows: Array<{ name: string; score: number }> = [];
      const tableRows = document.querySelectorAll('table tbody tr, .model-row, [data-model-name]');
      
      tableRows.forEach(row => {
        const nameEl = row.querySelector('td:first-child, .model-name, [data-model-name]');
        const scoreEl = row.querySelector('td:nth-child(2), .score, .intelligence-score');
        
        if (nameEl && scoreEl) {
          const name = nameEl.textContent?.trim() || '';
          const scoreText = scoreEl.textContent?.trim().replace('%', '') || '';
          const score = parseFloat(scoreText);
          
          if (name && !isNaN(score)) {
            rows.push({ name, score });
          }
        }
      });
      
      return rows;
    });
    
    return data.map(d => ({
      model_id: MODEL_MAPPINGS[d.name] || d.name,
      source: 'artificial_analysis',
      intelligence_score: d.score,
    }));
    
  } catch (e: any) {
    console.error('[Scraper] Artificial Analysis error:', e.message);
    return [];
  } finally {
    await context.close();
  }
}

async function scrapeArena(browser: any): Promise<Partial<ScrapedBenchmark>[]> {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://lmarena.ai/leaderboard', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    await page.waitForSelector('table, .leaderboard', { timeout: 10000 });
    
    const data = await page.evaluate(() => {
      const rows: Array<{ name: string; elo: number }> = [];
      const tableRows = document.querySelectorAll('table tbody tr');
      
      tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const name = cells[1]?.textContent?.trim() || '';
          const eloText = cells[2]?.textContent?.trim() || '';
          const elo = parseFloat(eloText);
          
          if (name && !isNaN(elo)) {
            rows.push({ name, elo });
          }
        }
      });
      
      return rows;
    });
    
    return data.map(d => ({
      model_id: MODEL_MAPPINGS[d.name] || d.name,
      source: 'arena',
      arena_elo: d.elo,
    }));
    
  } catch (e: any) {
    console.error('[Scraper] Arena error:', e.message);
    return [];
  } finally {
    await context.close();
  }
}

async function scrapeSWEBench(browser: any): Promise<Partial<ScrapedBenchmark>[]> {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://www.swebench.com/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    await page.waitForSelector('table, .benchmark-table', { timeout: 10000 });
    
    const data = await page.evaluate(() => {
      const rows: Array<{ name: string; resolved: number }> = [];
      const tableRows = document.querySelectorAll('table tbody tr');
      
      tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const name = cells[0]?.textContent?.trim() || '';
          const resolvedText = cells[1]?.textContent?.trim().replace('%', '') || '';
          const resolved = parseFloat(resolvedText);
          
          if (name && !isNaN(resolved)) {
            rows.push({ name, resolved });
          }
        }
      });
      
      return rows;
    });
    
    return data.map(d => ({
      model_id: MODEL_MAPPINGS[d.name] || d.name,
      source: 'swe_bench',
      swe_bench: d.resolved,
    }));
    
  } catch (e: any) {
    console.error('[Scraper] SWE-bench error:', e.message);
    return [];
  } finally {
    await context.close();
  }
}

function mergeResults(results: ScrapedBenchmark[]): ScrapedBenchmark[] {
  const byModel: Record<string, ScrapedBenchmark> = {};
  
  for (const result of results) {
    if (!byModel[result.model_id]) {
      byModel[result.model_id] = {
        model_id: result.model_id,
        source: 'merged',
        scraped_at: result.scraped_at,
      };
    }
    
    if (result.intelligence_score) byModel[result.model_id].intelligence_score = result.intelligence_score;
    if (result.arena_elo) byModel[result.model_id].arena_elo = result.arena_elo;
    if (result.swe_bench) byModel[result.model_id].swe_bench = result.swe_bench;
    if (result.agentic_score) byModel[result.model_id].agentic_score = result.agentic_score;
    if (result.bfcl_score) byModel[result.model_id].bfcl_score = result.bfcl_score;
  }
  
  return Object.values(byModel);
}
