import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { existsSync } from 'fs';

async function runLighthouse() {
  // Use Playwright's Chrome if available
  const playwrightChrome = '/tmp/playwright-browsers/chromium-1255/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
  const chromePath = existsSync(playwrightChrome) ? playwrightChrome : undefined;
  
  const chrome = await chromeLauncher.launch({ 
    chromeFlags: ['--headless', '--no-sandbox'],
    chromePath,
  });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse('http://localhost:4321', options);
  const report = runnerResult.lhr;
  
  const scores = {
    performance: Math.round(report.categories.performance.score * 100),
    accessibility: Math.round(report.categories.accessibility.score * 100),
    'best-practices': Math.round(report.categories['best-practices'].score * 100),
    seo: Math.round(report.categories.seo.score * 100),
  };
  
  console.log('\n📊 Lighthouse Scores:');
  console.log(`  Performance: ${scores.performance}/100`);
  console.log(`  Accessibility: ${scores.accessibility}/100`);
  console.log(`  Best Practices: ${scores['best-practices']}/100`);
  console.log(`  SEO: ${scores.seo}/100`);
  
  const budgets = {
    'first-contentful-paint': 1800,
    'largest-contentful-paint': 2500,
    'cumulative-layout-shift': 0.1,
    'total-blocking-time': 200,
    interactive: 3500,
  };
  
  let failed = 0;
  for (const [metric, budget] of Object.entries(budgets)) {
    const audit = report.audits[metric];
    if (audit && audit.numericValue !== undefined) {
      const value = audit.numericValue;
      const status = value <= budget ? '✅' : '❌';
      if (value > budget) failed++;
      console.log(`  ${status} ${metric}: ${value.toFixed(metric === 'cumulative-layout-shift' ? 2 : 0)} (budget: ${budget})`);
    }
  }
  
  await chrome.kill();
  process.exit(failed > 0 ? 1 : 0);
}

runLighthouse().catch(console.error);