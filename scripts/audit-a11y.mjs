import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';

const urls = ['/', '/cv'];
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
let hasViolations = false;

for (const url of urls) {
  await page.goto(`http://localhost:4321${url}`, { waitUntil: 'networkidle0' });
  const results = await new AxePuppeteer(page).analyze();
  
  const violations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  if (violations.length > 0) {
    console.error(`\n❌ ${url} - ${violations.length} serious/critical violations:`);
    for (const v of violations) {
      console.error(`  [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.error(`    → ${node.html}`);
      }
    }
    hasViolations = true;
  } else {
    console.log(`✅ ${url} - No serious violations`);
  }
}

await browser.close();
process.exit(hasViolations ? 1 : 0);