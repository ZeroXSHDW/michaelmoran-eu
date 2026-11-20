import { readFileSync, writeFileSync, statSync } from 'fs';
import { globSync } from 'glob';

const SITE_URL = 'https://michaelmoran.eu';

async function generateSitemap() {
  const files = globSync('dist/**/*.html');
  const urls = files.map(file => {
    const url = file.replace('dist/', SITE_URL + '/').replace('/index.html', '/').replace('.html', '');
    const stats = statSync(file);
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${stats.mtime.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url === SITE_URL + '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  
  writeFileSync('dist/sitemap.xml', sitemap);
  console.log(`Generated sitemap.xml with ${urls.length} URLs`);
}

generateSitemap().catch(console.error);