# DECISIONS.md

## Architecture Decision Log — michaelmoran.eu

---

### Decision 001 — Stack Selection
- **Date**: 2026-11-19
- **Context**: Need production-grade static site with zero client-side framework weight, full CSP compatibility, and minimal attack surface.
- **Decision**: Astro (static output mode) with no framework integrations. All interactions via native HTML/CSS/JS.
- **Rationale**: 
  - Astro generates static HTML by default, eliminating client-side JS bloat
  - Built-in support for CSP nonce generation
  - Can opt-in to partial hydration only where needed (none required here)
  - Excellent TypeScript support
  - Single-page navigation via native scroll-behavior: smooth

---

### Decision 002 — Design Tokens

#### Colour Palette (light / dark)
```
Light:
  --color-bg:     #fafafa    (near-white, reduces glare)
  --color-text:   #1a1a1a    (deep ink for readability)
  --color-accent: #0a1e4f    (deep navy, restrained)
  --color-border: #e0e0e0    (hairline rule)
  --color-meta:   #6b7280    (subtle label)

Dark (prefers-color-scheme):
  --color-bg:     #0a0a0a
  --color-text:   #f5f5f5
  --color-accent: #5a8fdf   (lighter for contrast on dark)
  --color-border: #2a2a2a
  --color-meta:   #a3a3a3
```

#### Typography Scale
```
--font-display:  'Fraunces', serif     (for headings, section labels)
--font-body:     'Inter', sans-serif   (body text, clean grotesque)
--font-mono:     'JetBrains Mono', monospace (metadata, hashes, TLP tags)

--type-scale: 1.25 (modular scale, comfortable reading)
  h1: 2.441rem  (36px / 60px on desktop)
  h2: 1.953rem  (30px / 40px)
  h3: 1.563rem  (24px)
  label: 0.8rem  (13px, small-caps via text-transform)
  body: 1.125rem (18px)
```

#### Spacing Scale
```
--space-0: 0
--space-1: 0.5rem   (8px)
--space-2: 1rem     (16px)
--space-3: 1.5rem   (24px)
--space-4: 2rem     (32px)
--space-5: 3rem     (48px)
--space-6: 4.5rem   (72px)
```

#### Motion
```
--duration-fast: 120ms
--duration-base: 200ms
--duration-slow: 320ms

Motion triggered only by:
  - Intersection Observer scroll reveal (opacity + translateY 10px)
  - Hover states (color transition)
  - Focus-visible (outline transition)
```

---

### Decision 003 — File Layout
```
michaelmoran-eu/
├── public/                # Static assets (no external requests)
│   ├── fonts/             # Self-hosted WOFF2 font files
│   └── images/
│       └── og-image.svg   # Open Graph image
├── src/
│   ├── content.ts         # Single source of truth for all copy
│   ├── layouts/
│   │   └── Layout.astro   # Root layout with meta/head
│   ├── components/
│   │   ├── SectionHeader.astro
│   │   ├── CapabilityCard.astro
│   │   ├── EngagementCard.astro
│   │   ├── CredentialItem.astro
│   │   ├── Testimonial.astro
│   │   ├── ContactForm.astro
│   │   └── Footer.astro
│   ├── styles/
│   │   └── global.css     # CSS variables + utility classes
│   └── pages/
│       ├── index.astro    # Single-page with anchored sections
│       └── cv.astro       # Downloadable CV page
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions CI/CD
├── wrangler.toml          # Cloudflare Pages config
├── package.json
├── astro.config.mjs       # Astro configuration
├── _headers               # CSP + security headers for Pages
├── _redirects             # HTTP->HTTPS redirect rules
├── sitemap.xslt           # For sitemap.xml generation
└── README.md
```

---

### Decision 004 — Security Headers
```
# _headers
/*
  Content-Security-Policy: script-src 'self' 'sha256-xxx'; style-src 'self' 'sha256-yyy'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

### Decision 005 — Font Bundling
- **Fonts**: Fraunces (display) + Inter (body) + JetBrains Mono (mono)
- **Source**: Google Fonts → self-host as WOFF2 files
- **Process**: Download via fonts.google.com, convert to WOFF2, place in `public/fonts/`
- **No CDN requests** at runtime

---

### Decision 006 — Contact Form Backend
- **Approach**: Static form handling service (e.g., Formspree, getform, or self-hosted via a serverless function)
- **Privacy**: No user data stored beyond what the owner needs
- **Documentation**: Include PGP fingerprint for encrypted email contact as fallback
- **Placeholder**: `action="/contact"` with method="POST"

---

### Decision 007 — SEO Metadata
- **Title**: "Michael Moran — Cyber Security Professional"
- **Description**: "Senior cyber security consultant. Government and high-value corporate engagements in mobile security, wireless analysis, network forensics, penetration testing, and security architecture."
- **Open Graph**: 1200x630 SVG image, self-hosted
- **JSON-LD**: Person schema with LinkedIn placeholder URL

---

### Decision 008 — Responsive Breakpoints
```
Mobile:    360px (minimum viable)
Tablet:    768px ( portrait tablet )
Laptop:    1024px ( standard laptop )
Desktop:   1440px ( 13-15" laptop, 27" monitor )
Wide:      1920px ( 32" ultrawide, 4K )
```

---

### Decision 009 — Git Strategy
- **Branch protection**: `main` is production branch, PR required for changes
- **Commit convention**: Conventional Commits (feat:, fix:, docs:, etc.)
- **Tags**: Semantic versioning for releases (v1.0.0, v1.1.0, etc.)

---

### Pending Owner Actions
1. Create Cloudflare API token with "Pages: Edit" scope
2. Configure Cloudflare account ID in GitHub repo secrets
3. Set up Njalla DNS records in Njalla control panel
4. Fill in LinkedIn URL, certifications, PGP fingerprint, testimonials

---

### Checklist Status

- [x] Phase 0 — Plan complete (this document)
- [x] Phase 1 — Design system
- [x] Phase 2 — Content
- [x] Phase 3 — Build
- [x] Phase 4 — Hardening & SEO
- [x] Phase 5 — Infrastructure
- [x] Phase 6 — Validation
- [x] Phase 7 — Handoff (awaiting owner credentials for GitHub secrets and DNS setup)