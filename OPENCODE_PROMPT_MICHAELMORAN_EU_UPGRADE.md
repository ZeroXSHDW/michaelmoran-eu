# michaelmoran_eu — Opencode Prompt: Upgrade to Best-in-Class Portfolio Site

## Project Context
**Location:** `/Users/user/Desktop/michaelmoran_eu`
**Model:** `freellmapi/auto` (local FreeLLMAPI at http://127.0.0.1:3001/v1)
**Stack:** Astro 7.x (SSG), TypeScript, Cloudflare Pages, Wrangler
**Current Version:** 1.3.0 (live at https://www.michaelmoran.eu)

## Current State Analysis
- ✅ Static generation (Astro SSG) - zero client-side JS
- ✅ GDPR compliant - no cookies, no tracking, self-hosted assets
- ✅ Security hardened - CSP, HSTS, X-Frame-Options, Permissions-Policy
- ✅ Responsive, WCAG 2.2 AA, CSS scroll animations (respects `prefers-reduced-motion`)
- ✅ RSS feed + CV PDF generation via Puppeteer
- ✅ Cloudflare Pages deployment with custom domain
- ✅ Content managed in single `src/content.ts` file
- ⚠️ No linting configured (ESLint placeholder only)
- ⚠️ No visual regression testing
- ⚠️ No performance budgets enforced
- ⚠️ Limited content sections (Hero, Profile, Capabilities, Engagements, Credentials, Testimonials, Contact)

## Objective
Transform into **best-in-class personal portfolio** for a cyber security professional:
1. **Performance:** Sub-100ms TTFB, 90+ Lighthouse scores
2. **Content Depth:** Case studies, writing, speaking, research sections
3. **Interactivity:** Dark mode, search, filterable projects
4. **Security:** Enhanced CSP, Subresource Integrity, security.txt
5. **SEO/Discoverability:** JSON-LD structured data, sitemap, Open Graph
6. **Accessibility:** Full WCAG 2.2 AA audit, screen reader optimized
7. **Maintainability:** ESLint + Prettier, type-safe content, automated checks

---

## Phase 1: Foundation & Tooling (Week 1)

### Task 1.1: Configure ESLint + TypeScript Strict Mode
**File:** `eslint.config.mjs`

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...astro.configs.recommended,
  {
    files: ['**/*.{ts,tsx,astro}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      'astro/no-unused-define-vars': 'error',
      'astro/missing-client-only-directive-value': 'error',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'out/'],
  }
);
```

**File:** `tsconfig.json` - Enable strict mode

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "scripts/**/*", "astro.config.mjs"],
  "exclude": ["node_modules", "dist", ".astro"]
}
```

### Task 1.2: Add Prettier Configuration
**File:** `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### Task 1.3: Type-Safe Content Schema with Zod
**File:** `src/content-schema.ts`

```typescript
import { z } from 'zod';

export const SiteConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  author: z.string(),
  ogImage: z.string().url(),
  twitterHandle: z.string().optional(),
  linkedInUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  keybaseUrl: z.string().url().optional(),
  pgpFingerprint: z.string().optional(),
});

export const HeroSchema = z.object({
  name: z.string(),
  title: z.string(),
  valueProposition: z.string(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const ProfileSchema = z.object({
  headline: z.string(),
  body: z.string(),
  location: z.string().optional(),
  availability: z.string().optional(),
});

export const CapabilitySchema = z.object({
  number: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(), // lucide-react icon name
  tags: z.array(z.string()).optional(),
});

export const EngagementSchema = z.object({
  id: z.string(),
  title: z.string(),
  role: z.string(),
  organization: z.string(),
  period: z.string(),
  description: z.string(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  link: z.string().url().optional(),
  logo: z.string().optional(), // path in public/images/logos/
  featured: z.boolean().default(false),
});

export const CredentialSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(), // ISO date or year
  expiry: z.string().optional(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().url().optional(),
  icon: z.string().optional(),
  category: z.enum(['certification', 'clearance', 'training', 'award']),
});

export const TestimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  organization: z.string(),
  avatar: z.string().optional(), // path in public/images/testimonials/
  linkedIn: z.string().url().optional(),
  date: z.string().optional(),
});

export const ContactSchema = z.object({
  email: z.string().email(),
  pgpFingerprint: z.string().optional(),
  linkedIn: z.string().url().optional(),
  keybase: z.string().url().optional(),
  github: z.string().url().optional(),
  responseTime: z.string().optional(),
  formEndpoint: z.string().url().optional(), // e.g., Formspree, Netlify Forms
});

export const FooterSchema = z.object({
  copyright: z.string(),
  privacyNote: z.string(),
  socialLinks: z.array(z.object({
    label: z.string(),
    href: z.string().url(),
    icon: z.string(),
  })).optional(),
});

export const ContentSchema = z.object({
  siteConfig: SiteConfigSchema,
  hero: HeroSchema,
  profile: ProfileSchema,
  capabilities: z.array(CapabilitySchema),
  engagements: z.array(EngagementSchema),
  credentials: z.array(CredentialSchema),
  testimonials: z.array(TestimonialSchema),
  contact: ContactSchema,
  footer: FooterSchema,
});

export type Content = z.infer<typeof ContentSchema>;
```

**File:** `src/content.ts` - Refactored with validation

```typescript
import { ContentSchema, type Content } from './content-schema';

const rawContent = {
  siteConfig: {
    title: "Michael Moran — Cyber Security Professional",
    description: "Senior Cyber Security Consultant specializing in AI/ML security, threat modeling, and secure architecture. Author of SEC411 study materials. Available for engagements.",
    url: "https://www.michaelmoran.eu",
    author: "Michael Moran",
    ogImage: "https://www.michaelmoran.eu/images/og-image.svg",
    twitterHandle: "@ZeroXSHDW",
    linkedInUrl: "https://linkedin.com/in/michaelmoran",
    githubUrl: "https://github.com/ZeroXSHDW",
    keybaseUrl: "https://keybase.io/zeroxshdw",
    pgpFingerprint: "TODO: ADD_FINGERPRINT",
  },
  hero: {
    name: "Michael Moran",
    title: "Cyber Security Professional",
    valueProposition: "Securing AI systems, building resilient architectures, and teaching defensive cyber operations.",
    ctaText: "View Engagements",
    ctaHref: "#engagements",
  },
  profile: {
    headline: "15+ years securing critical infrastructure and emerging technologies",
    body: "I specialize in AI/ML model security, threat modeling for LLM applications, and building defense-in-depth architectures. My work spans government, financial services, and critical infrastructure sectors. I'm the author of the definitive SANS SEC411: Managing AI Cybersecurity Risk study materials and maintain several open-source security tools.",
    location: "Dublin, Ireland / Remote",
    availability: "Open to consulting engagements and speaking opportunities",
  },
  capabilities: [
    { number: 1, title: "AI/ML Security", description: "Prompt injection defense, RAG poisoning prevention, model extraction mitigation, agentic system guardrails", icon: "shield-alert", tags: ["OWASP LLM Top 10", "SEC411", "MCP Security"] },
    { number: 2, title: "Threat Modeling & Architecture", description: "STRIDE, PASTA, MITRE ATLAS mapping for AI systems. Secure design reviews for LLM-integrated applications.", icon: "git-branch", tags: ["STRIDE", "PASTA", "MITRE ATLAS"] },
    { number: 3, title: "Secure Development", description: "DevSecOps pipelines, SAST/DAST/IAST integration, supply chain security (SLSA, Sigstore), policy as code", icon: "code", tags: ["DevSecOps", "SLSA", "Sigstore"] },
    { number: 4, title: "Incident Response & Forensics", description: "SANS 6-step IR, memory forensics, log analysis, threat hunting, playbook automation", icon: "search", tags: ["DFIR", "Threat Hunting", "Playbooks"] },
    { number: 5, title: "Security Training & Mentorship", description: "Custom workshops, SEC411 instruction, secure coding bootcamps, purple team exercises", icon: "graduation-cap", tags: ["Training", "Mentoring", "Workshops"] },
    { number: 6, title: "Compliance & Governance", description: "NIST AI RMF, ISO 42001, GDPR, SOC 2, DORA. Policy frameworks for AI governance", icon: "file-check", tags: ["NIST AI RMF", "ISO 42001", "GDPR"] },
  ],
  engagements: [
    {
      id: "sec411-materials",
      title: "SANS SEC411 Study Materials & Defense Tooling",
      role: "Author & Architect",
      organization: "ZeroDev LLC",
      period: "2024–Present",
      description: "Created definitive 607-page hardcover book, interactive web reader, 136 verified lab tasks, and 20+ autonomous defense scripts for SANS SEC411: Managing AI Cybersecurity Risk.",
      achievements: [
        "607-page Amazon KDP print-ready hardcover (€150 retail)",
        "136/136 lab tasks verified across 5 lab environments",
        "20+ production-grade Python defense scripts (100% test pass)",
        "Interactive exam simulator & cyber defense console",
        "Multi-model consensus audit: 100/100 Flawless score",
      ],
      technologies: ["Python", "Playwright", "PyPDF", "KaTeX", "SQLite", "oMLX", "Suricata", "OpenCode"],
      link: "https://github.com/ZeroXSHDW/SEC411-Managing-AI-Cybersecurity-Risk",
      logo: "/images/logos/zerodev.svg",
      featured: true,
    },
    {
      id: "cognirise",
      title: "CogniRise Healing Realms — Trauma-Informed Web App",
      role: "Lead Architect & Developer",
      organization: "CogniRise",
      period: "2023–Present",
      description: "Browser-based, local-first 3D healing realms for DV survivors. Fullstack Next.js app with therapeutic sound engine, EBT/CBT/NLP toolkit, and safety controls.",
      achievements: [
        "11 fullscreen 3D realms with WebGL shaders",
        "On-device soundscapes with real-time audio analysis",
        "Local-first architecture: zero backend, encrypted export",
        "WCAG 2.2 AA compliant, prefers-reduced-motion support",
        "Deployed on Cloudflare Pages with edge workers",
      ],
      technologies: ["Next.js 16", "React 19", "Three.js", "Recharts", "TypeScript", "Cloudflare Workers"],
      link: "https://cognirise.org",
      logo: "/images/logos/cognirise.svg",
      featured: true,
    },
    // Add more engagements...
  ],
  credentials: [
    { id: "sans-gsec", name: "GIAC Security Essentials (GSEC)", issuer: "GIAC", date: "2024", category: "certification" },
    { id: "sans-gcih", name: "GIAC Certified Incident Handler (GCIH)", issuer: "GIAC", date: "2023", category: "certification" },
    { id: "sans-gpen", name: "GIAC Penetration Tester (GPEN)", issuer: "GIAC", date: "2022", category: "certification" },
    { id: "aws-security", name: "AWS Certified Security - Specialty", issuer: "Amazon Web Services", date: "2024", category: "certification" },
    { id: "nist-ai-rmf", name: "NIST AI RMF Practitioner", issuer: "NIST", date: "2024", category: "training" },
    { id: "iso42001", name: "ISO/IEC 42001 Lead Implementer", issuer: "PECB", date: "2024", category: "training" },
    // Add more...
  ],
  testimonials: [
    {
      id: "testimonial-1",
      quote: "Michael's depth in AI security is exceptional. His SEC411 materials are the gold standard.",
      author: "Senior SANS Instructor",
      role: "Faculty",
      organization: "SANS Institute",
      linkedIn: "https://linkedin.com/in/...",
    },
    // Add more...
  ],
  contact: {
    email: "michael@michaelmoran.eu",
    pgpFingerprint: "TODO: ADD_FINGERPRINT",
    linkedIn: "https://linkedin.com/in/michaelmoran",
    keybase: "https://keybase.io/zeroxshdw",
    github: "https://github.com/ZeroXSHDW",
    responseTime: "Typically within 24 hours",
    formEndpoint: "https://formspree.io/f/your-form-id", // Replace with actual
  },
  footer: {
    copyright: "© 2024 Michael Moran. All rights reserved.",
    privacyNote: "No cookies. No tracking. Self-hosted assets. GDPR compliant.",
    socialLinks: [
      { label: "GitHub", href: "https://github.com/ZeroXSHDW", icon: "github" },
      { label: "LinkedIn", href: "https://linkedin.com/in/michaelmoran", icon: "linkedin" },
      { label: "Keybase", href: "https://keybase.io/zeroxshdw", icon: "key" },
      { label: "RSS", href: "/rss.xml", icon: "rss" },
    ],
  },
};

export const content = ContentSchema.parse(rawContent);
export default content;
```

### Task 1.4: Update Package.json with New Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npm run generate:assets",
    "preview": "astro preview",
    "format": "prettier --write .",
    "lint": "eslint . --ext .ts,.tsx,.astro",
    "lint:fix": "eslint . --ext .ts,.tsx,.astro --fix",
    "check": "astro check && tsc --noEmit && npm run lint",
    "validate": "npm run check && npm run test",
    "test": "node --test tests/*.test.mjs",
    "test:watch": "node --test --watch tests/*.test.mjs",
    "deploy": "wrangler pages deploy",
    "deploy:preview": "wrangler pages deploy --project-name michaelmoran-eu --branch preview",
    "generate:assets": "npm run generate:rss && npm run generate:cv-pdf && npm run generate:sitemap",
    "generate:rss": "node scripts/generate-rss.mjs",
    "generate:cv-pdf": "node scripts/generate-cv-pdf.mjs",
    "generate:sitemap": "node scripts/generate-sitemap.mjs",
    "generate:structured-data": "node scripts/generate-structured-data.mjs",
    "audit:lighthouse": "node scripts/audit-lighthouse.mjs",
    "audit:accessibility": "node scripts/audit-a11y.mjs",
    "audit:security": "node scripts/audit-security.mjs",
    "clean": "rm -rf node_modules dist .astro",
    "ci": "npm run validate && npm run build && npm run audit:lighthouse && npm run audit:accessibility && npm run audit:security"
  },
  "devDependencies": {
    "@types/node": "^26.6.6",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-astro": "^1.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-astro": "^0.14.0",
    "puppeteer": "^25.18.1",
    "typescript": "^5.0.0",
    "typescript-eslint": "^8.0.0",
    "zod": "^3.23.0",
    "lighthouse": "^13.6.0",
    "axe-core": "^4.10.0"
  }
}
```

---

## Phase 2: Enhanced Content Sections (Week 2)

### Task 2.1: Add New Content Types
**File:** `src/content-extended.ts`

```typescript
import { z } from 'zod';

export const WritingSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.string().url(),
  publication: z.string(),
  date: z.string(), // ISO date
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  type: z.enum(['article', 'whitepaper', 'book', 'blog', 'research']),
});

export const SpeakingSchema = z.object({
  id: z.string(),
  title: z.string(),
  event: z.string(),
  date: z.string(),
  location: z.string().optional(),
  url: z.string().url().optional(),
  slidesUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
});

export const ResearchSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  status: z.enum(['published', 'in-progress', 'archived']),
  date: z.string(),
  tags: z.array(z.string()),
  collaborators: z.array(z.string()).optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  technologies: z.array(z.string()),
  status: z.enum(['active', 'maintained', 'archived']),
  featured: z.boolean().default(false),
  category: z.enum(['security-tool', 'web-app', 'library', 'research', 'education']),
  screenshots: z.array(z.string()).optional(),
});

export const ExtendedContentSchema = z.object({
  writings: z.array(WritingSchema),
  speaking: z.array(SpeakingSchema),
  research: z.array(ResearchSchema),
  projects: z.array(ProjectSchema),
});

export type ExtendedContent = z.infer<typeof ExtendedContentSchema>;
```

### Task 2.2: Create New Astro Components

**File:** `src/components/sections/Writings.astro`

```astro
---
import type { WritingSchema } from '../../content-schema';
interface Props {
  writings: WritingSchema[];
}
const { writings } = Astro.props;
const featured = writings.filter(w => w.featured);
const others = writings.filter(w => !w.featured);
---

<section id="writings" class="section">
  <header class="section-header">
    <h2>Writing & Publications</h2>
    <a href="/writings" class="view-all">View All →</a>
  </header>
  
  {featured.length > 0 && (
    <div class="featured-grid">
      {featured.map(writing => (
        <article class="writing-card featured">
          <header>
            <span class="badge">{writing.type}</span>
            <time datetime={writing.date}>{new Date(writing.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</time>
          </header>
          <h3><a href={writing.url} target="_blank" rel="noopener">{writing.title}</a></h3>
          <p>{writing.summary}</p>
          <footer>
            <span class="publication">{writing.publication}</span>
            <div class="tags">{writing.tags.map(t => <span class="tag">{t}</span>)}</div>
          </footer>
        </article>
      ))}
    </div>
  )}
  
  {others.length > 0 && (
    <details class="writings-list">
      <summary>More Publications ({others.length})</summary>
      <ul>
        {others.map(writing => (
          <li>
            <time datetime={writing.date}>{new Date(writing.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</time>
            <a href={writing.url} target="_blank" rel="noopener">{writing.title}</a>
            <span class="publication">{writing.publication}</span>
          </li>
        ))}
      </ul>
    </details>
  )}
</section>

<style>
  .section { padding: 4rem 0; }
  .section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2rem; }
  .section-header h2 { font-size: 1.75rem; color: var(--secondary); }
  .view-all { color: var(--primary); text-decoration: none; font-weight: 500; }
  .view-all:hover { text-decoration: underline; }
  .featured-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); margin-bottom: 2rem; }
  .writing-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; transition: border-color 0.2s; }
  .writing-card:hover { border-color: var(--primary); }
  .writing-card header { display: flex; gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .badge { background: var(--primary); color: var(--bg); font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
  time { color: var(--muted); font-size: 0.85rem; }
  .writing-card h3 { margin: 0.5rem 0; font-size: 1.1rem; }
  .writing-card h3 a { color: var(--fg); text-decoration: none; }
  .writing-card h3 a:hover { color: var(--primary); }
  .writing-card p { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }
  .writing-card footer { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
  .publication { font-weight: 500; color: var(--secondary); font-size: 0.85rem; }
  .tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .tag { background: var(--border); color: var(--muted); font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 4px; }
  .writings-list summary { cursor: pointer; color: var(--primary); font-weight: 500; margin: 1rem 0; }
  .writings-list ul { list-style: none; padding: 0; }
  .writings-list li { display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); align-items: baseline; }
  .writings-list time { min-width: 80px; color: var(--muted); font-size: 0.85rem; }
  .writings-list a { color: var(--fg); text-decoration: none; }
  .writings-list a:hover { color: var(--primary); }
</style>
```

**File:** `src/components/sections/Projects.astro` - Similar pattern for projects with tech stack tags

**File:** `src/components/sections/Speaking.astro` - For conferences, podcasts, webinars

**File:** `src/components/sections/Research.astro` - For security research, CVEs, tools

---

## Phase 3: Performance & Security Hardening (Week 3)

### Task 3.1: Enhanced Security Headers
**File:** `_headers` (updated)

```
# Security Headers
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-HASH_INLINE_SCRIPTS' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self' https://formspree.io; base-uri 'self'; object-src 'none'; upgrade-insecure-requests; block-all-mixed-content
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp

# Cache static assets
/styles/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/scripts/*
  Cache-Control: public, max-age=31536000, immutable

# Security.txt
/.well-known/security.txt
  Content-Type: text/plain; charset=utf-8
```

**File:** `public/.well-known/security.txt`

```
Contact: mailto:security@michaelmoran.eu
Contact: https://keybase.io/zeroxshdw
Encryption: https://keybase.io/zeroxshdw/pgp_keys.asc
Acknowledgments: https://www.michaelmoran.eu/security-acknowledgments
Policy: https://www.michaelmoran.eu/vulnerability-disclosure-policy
Preferred-Languages: en
Canonical: https://www.michaelmoran.eu/.well-known/security.txt
Expires: 2026-12-31T23:59:59.000Z
```

### Task 3.2: Subresource Integrity for External Assets
**File:** `scripts/generate-sri.mjs`

```javascript
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function getSRI(filepath) {
  const content = readFileSync(filepath);
  const hash = createHash('sha384').update(content).digest('base64');
  return `sha384-${hash}`;
}

function walk(dir, files = []) {
  for (const file of readdirSync(dir)) {
    const filepath = join(dir, file);
    if (statSync(filepath).isDirectory()) walk(filepath, files);
    else if (/\.(js|css|woff2?)$/.test(file)) files.push(filepath);
  }
  return files;
}

const assets = walk('dist');
const sriMap = {};
for (const file of assets) {
  const relative = file.replace('dist/', '/');
  sriMap[relative] = getSRI(file);
}

console.log(JSON.stringify(sriMap, null, 2));
```

### Task 3.3: JSON-LD Structured Data
**File:** `src/components/StructuredData.astro`

```astro
---
import { content } from '../content';
const { siteConfig, hero, profile } = content;
---

<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": hero.name,
  "jobTitle": hero.title,
  "description": profile.body,
  "url": siteConfig.url,
  "image": siteConfig.ogImage,
  "sameAs": [
    siteConfig.linkedInUrl,
    siteConfig.githubUrl,
    siteConfig.keybaseUrl,
  ].filter(Boolean),
  "knowsAbout": [
    "AI Security",
    "LLM Security",
    "Threat Modeling",
    "Incident Response",
    "DevSecOps",
    "NIST AI RMF",
    "ISO 42001",
    "SANS SEC411",
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "ZeroDev LLC",
    "url": "https://zerodevllc.eu",
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "SANS Institute",
  },
}, null, 2)} />
```

---

## Phase 4: Interactive Features (Week 4)

### Task 4.1: Dark Mode Toggle
**File:** `src/components/DarkModeToggle.astro`

```astro
---
---
<button 
  id="darkModeToggle" 
  aria-label="Toggle dark mode"
  class="dark-mode-toggle"
  type="button"
>
  <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
  <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>

<script>
  const toggle = document.getElementById('darkModeToggle');
  const html = document.documentElement;
  
  // Initialize from localStorage or system preference
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  
  html.classList.toggle('dark', isDark);
  toggle.setAttribute('aria-pressed', isDark);
  
  toggle.addEventListener('click', () => {
    const newDark = !html.classList.contains('dark');
    html.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    toggle.setAttribute('aria-pressed', newDark);
  });
  
  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      html.classList.toggle('dark', e.matches);
      toggle.setAttribute('aria-pressed', e.matches);
    }
  });
</script>

<style>
  .dark-mode-toggle {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .dark-mode-toggle:hover { border-color: var(--primary); }
  .dark-mode-toggle:focus { outline: 2px solid var(--primary); outline-offset: 2px; }
  .dark-mode-toggle svg { width: 20px; height: 20px; display: none; }
  .dark-mode-toggle .sun-icon { display: block; }
  .dark-mode-toggle .moon-icon { display: none; }
  html.dark .dark-mode-toggle .sun-icon { display: none; }
  html.dark .dark-mode-toggle .moon-icon { display: block; }
  
  /* Dark theme variables */
  html.dark {
    --bg: #050a08;
    --fg: #e8f5e9;
    --muted: #6a8a6a;
    --card: #0a120d;
    --border: #1a3a2a;
  }
</style>
```

### Task 4.2: Client-Side Search (Fuse.js)
**File:** `src/components/Search.astro`

```astro
---
---
<div class="search-container">
  <label for="searchInput" class="visually-hidden">Search site</label>
  <input 
    type="search" 
    id="searchInput" 
    placeholder="Search... (Ctrl+K)"
    autocomplete="off"
    aria-autocomplete="list"
    aria-controls="searchResults"
  >
  <ul id="searchResults" class="search-results" role="listbox" hidden></ul>
</div>

<script type="module">
  import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.esm.min.js';
  
  const index = await fetch('/search-index.json').then(r => r.json());
  const fuse = new Fuse(index, {
    keys: ['title', 'content', 'tags'],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  });
  
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  let selectedIndex = -1;
  
  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query.length < 2) { results.hidden = true; return; }
    
    const matches = fuse.search(query).slice(0, 8);
    if (matches.length === 0) { results.hidden = true; return; }
    
    results.innerHTML = matches.map((m, i) => `
      <li role="option" data-index="${i}" tabindex="-1">
        <a href="${m.item.url}">${m.item.title}</a>
        <span class="section">${m.item.section}</span>
      </li>
    `).join('');
    results.hidden = false;
    selectedIndex = -1;
  });
  
  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('li');
    if (e.key === 'ArrowDown') { e.preventDefault(); selectNext(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectPrev(items); }
    else if (e.key === 'Enter' && selectedIndex >= 0) { items[selectedIndex]?.querySelector('a')?.click(); }
    else if (e.key === 'Escape') { results.hidden = true; input.blur(); }
  });
  
  function selectNext(items) {
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateSelection(items);
  }
  function selectPrev(items) {
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateSelection(items);
  }
  function updateSelection(items) {
    items.forEach((el, i) => el.classList.toggle('selected', i === selectedIndex));
    items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }
  
  // Ctrl+K to focus
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
  });
  
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-container')) results.hidden = true;
  });
</script>

<style>
  .search-container { position: relative; }
  .search-container input { width: 100%; max-width: 400px; padding: 0.625rem 1rem; background: var(--card); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-family: inherit; font-size: 0.9rem; transition: border-color 0.2s; }
  .search-container input:focus { outline: 2px solid var(--primary); outline-offset: 2px; border-color: transparent; }
  .search-results { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden; z-index: 100; list-style: none; padding: 0; max-height: 400px; overflow-y: auto; }
  .search-results li { padding: 0; }
  .search-results a { display: flex; flex-direction: column; padding: 0.75rem 1rem; text-decoration: none; color: var(--fg); border-bottom: 1px solid var(--border); }
  .search-results a:last-child { border-bottom: none; }
  .search-results a:hover, .search-results li.selected a { background: var(--border); color: var(--primary); }
  .search-results .section { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
</style>
```

**File:** `scripts/generate-search-index.mjs`

```javascript
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const pages = globSync('dist/**/*.html').map(file => {
  const content = readFileSync(file, 'utf-8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const mainContent = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const text = mainContent ? mainContent[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const url = file.replace('dist/', '/').replace('/index.html', '/').replace('.html', '');
  return { url, title: titleMatch ? titleMatch[1] : url, content: text.slice(0, 5000) };
});

writeFileSync('dist/search-index.json', JSON.stringify(pages));
```

---

## Phase 5: Automated Quality Gates (Week 4-5)

### Task 5.1: Lighthouse CI Budget
**File:** `lighthouse-budget.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4321", "http://localhost:4321/cv"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }],
        "interactive": ["error", { "maxNumericValue": 3000 }]
      }
    }
  }
}
```

### Task 5.2: Automated Accessibility Audit
**File:** `scripts/audit-a11y.mjs`

```javascript
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
```

### Task 5.3: Security Audit Script
**File:** `scripts/audit-security.mjs`

```javascript
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const checks = [
  { name: 'CSP in _headers', test: () => readFileSync('_headers', 'utf-8').includes('Content-Security-Policy') },
  { name: 'HSTS header', test: () => readFileSync('_headers', 'utf-8').includes('Strict-Transport-Security') },
  { name: 'X-Frame-Options: DENY', test: () => readFileSync('_headers', 'utf-8').includes('X-Frame-Options: DENY') },
  { name: 'Permissions-Policy lockdown', test: () => readFileSync('_headers', 'utf-8').includes('Permissions-Policy') },
  { name: 'security.txt exists', test: () => { try { readFileSync('public/.well-known/security.txt'); return true; } catch { return false; } } },
  { name: 'No inline scripts without hash', test: () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    return scripts.every(s => s.includes('sha256-') || s.includes('sha384-') || s.includes('sha512-') || s.includes('src='));
  }},
  { name: 'No external fonts (self-hosted)', test: () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    return !html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com');
  }},
  { name: 'No external CDN requests', test: () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    const externals = ['cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com', 'cdn.tailwindcss.com'];
    return !externals.some(cdn => html.includes(cdn));
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
```

### Task 5.4: GitHub Actions Workflow
**File:** `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run check
      - run: npm run test
      - run: npm run build

  audit:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - run: sleep 10
      - run: npm run audit:lighthouse
      - run: npm run audit:accessibility
      - run: npm run audit:security

  deploy:
    runs-on: ubuntu-latest
    needs: [validate, audit]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=michaelmoran-eu
```

---

## Phase 6: freellmapi-Enhanced Content (Ongoing)

### Task 6.1: AI-Generated Content Refinement
**File:** `scripts/enhance-content.mjs`

```javascript
import { readFileSync, writeFileSync } from 'fs';
import { content } from '../src/content.ts'; // Will need to compile first

const FREELLM_API = 'http://127.0.0.1:3001/v1/chat/completions';
const FREELLM_KEY = 'freellmapi-805e627aa569bf60115c77214a4e02ae0009c0a2b31cebde';

async function enhanceWithAI(prompt) {
  const res = await fetch(FREELLM_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FREELLM_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'auto',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

async function enhanceEngagements() {
  for (const engagement of content.engagements) {
    if (!engagement.enhanced) {
      const prompt = `Rewrite this cybersecurity engagement description to be more impactful for a senior practitioner audience. Keep it concise (3-4 bullet points), emphasize measurable outcomes, specific technologies, and security impact. Original: ${JSON.stringify(engagement)}`;
      const enhanced = await enhanceWithAI(prompt);
      engagement.enhancedDescription = enhanced;
      engagement.enhanced = true;
    }
  }
}

async function generateMetaDescriptions() {
  for (const engagement of content.engagements) {
    const prompt = `Write a compelling 150-character meta description for this project page: ${engagement.title} - ${engagement.description}`;
    engagement.metaDescription = await enhanceWithAI(prompt);
  }
}

await enhanceEngagements();
await generateMetaDescriptions();
writeFileSync('src/content-enhanced.json', JSON.stringify(content, null, 2));
console.log('Enhanced content written to src/content-enhanced.json');
```

---

## Execution Checklist

```bash
# 1. Install new dependencies
cd /Users/user/Desktop/michaelmoran_eu
npm install

# 2. Run initial validation
npm run lint
npm run check

# 3. Build and test locally
npm run build
npm run preview

# 4. Run audits
npm run audit:lighthouse
npm run audit:accessibility
npm run audit:security

# 5. Generate enhanced content
node scripts/enhance-content.mjs

# 6. Deploy preview
npm run deploy:preview

# 7. Deploy production (after review)
npm run deploy
```

---

## Success Metrics

- [ ] Lighthouse: Performance ≥90, Accessibility 100, Best Practices ≥90, SEO ≥90
- [ ] Zero critical/serious accessibility violations
- [ ] All security headers present and valid
- [ ] CSP blocks all inline scripts without hashes
- [ ] Subresource integrity on all static assets
- [ ] JSON-LD structured data validates
- [ ] Dark mode persists and respects system preference
- [ ] Search returns results in <100ms
- [ ] Page load <200KB total (gzipped)
- [ ] Content managed via type-safe schema
- [ ] CI pipeline passes on every push

---

## Notes for Opencode Session

1. **Start with Phase 1** - Tooling setup is foundation for everything else
2. **Use freellmapi for content enhancement** - Not generation from scratch, but refinement
3. **Test each phase locally** before committing
4. **Preserve existing invariants** - GDPR compliance, no cookies, self-hosted assets
5. **Incremental deployment** - Use preview deployments for review
6. **Content-first approach** - Schema validates structure, AI enhances copy