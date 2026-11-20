import { readFileSync } from 'fs';

const checks = [
  { name: 'CSP in _headers', test: () => readFileSync('_headers', 'utf-8').includes('Content-Security-Policy') },
  { name: 'HSTS header', test: () => readFileSync('_headers', 'utf-8').includes('Strict-Transport-Security') },
  { name: 'X-Frame-Options: DENY', test: () => readFileSync('_headers', 'utf-8').includes('X-Frame-Options: DENY') },
  { name: 'Permissions-Policy lockdown', test: () => readFileSync('_headers', 'utf-8').includes('Permissions-Policy') },
  { name: 'security.txt exists', test: () => { try { readFileSync('public/.well-known/security.txt'); return true; } catch { return false; } } },
  { name: 'No inline scripts without hash', test: () => {
    try {
      const html = readFileSync('dist/index.html', 'utf-8');
      const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
      // JSON-LD scripts (type="application/ld+json") are not executable and bypass CSP
      const executableScripts = scripts.filter(s => !s.includes('type="application/ld+json"'));
      return executableScripts.every(s => s.includes('sha256-') || s.includes('sha384-') || s.includes('sha512-') || s.includes('nonce=') || s.includes('src='));
    } catch { return false; }
  }},
  { name: 'No external fonts (self-hosted)', test: () => {
    try {
      const html = readFileSync('dist/index.html', 'utf-8');
      return !html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com');
    } catch { return false; }
  }},
  { name: 'No external CDN requests', test: () => {
    try {
      const html = readFileSync('dist/index.html', 'utf-8');
      const externals = ['cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com', 'cdn.tailwindcss.com'];
      return !externals.some(cdn => html.includes(cdn));
    } catch { return false; }
  }},
];

let passed = 0;
for (const check of checks) {
  const result = check.test();
  console.log(`${result ? '✅' : '❌'} ${check.name}`);
  if (result) passed++;
}

console.log(`\nSecurity Score: ${passed}/${checks.length}`);
process.exit(passed === checks.length ? 0 : 1);