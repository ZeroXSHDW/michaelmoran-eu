#!/usr/bin/env node

/**
 * Post-build script to fix JSON-LD inline scripts in built HTML files
 * Astro's inline script handling requires this workaround
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Michael Moran",
  "jobTitle": "Cyber Security Professional",
  "url": "https://michaelmoran.eu",
  "sameAs": [
    "https://linkedin.com/in/placeholder"
  ],
  "description": "Senior cyber security consultant. Government and high-value corporate engagements in mobile security, wireless analysis, network forensics, penetration testing, and security architecture.",
  "knowsAbout": [
    "Mobile & Device Security",
    "Wireless/RF Analysis",
    "Network Forensics",
    "Penetration Testing",
    "Security Architecture",
    "Incident Response"
  ]
};

const jsonString = JSON.stringify(jsonLd, null, 2);
const jsonLdScript = `<script type="application/ld+json">\n${jsonString}\n    </script>`;

// Fix HTML files in dist/
const distDir = join(import.meta.dirname, '..', 'dist');

function fixHtmlFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    if (content.includes('{JSON.stringify(jsonLd)}')) {
      content = content.replace(
        /<script type="application\/ld\+json">\s*\{JSON\.stringify\(jsonLd\)\}\s*<\/script>/,
        jsonLdScript
      );
      writeFileSync(filePath, content);
      console.log(`Fixed JSON-LD in: ${filePath}`);
    }
  } catch (e) {
    console.error(`Error processing ${filePath}:`, e.message);
  }
}

function processDirectory(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extname(entry) === '.html') {
      fixHtmlFile(fullPath);
    }
  }
}

processDirectory(distDir);
console.log('✓ JSON-LD scripts fixed');