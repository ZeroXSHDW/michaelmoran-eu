# michaelmoran.eu

A personal portfolio website for Michael Moran, Cyber Security Professional.

[![Deploy to Cloudflare Pages](https://github.com/owner/michaelmoran-eu/actions/workflows/deploy.yml/badge.svg)](https://github.com/owner/michaelmoran-eu/actions/workflows/deploy.yml)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages (CDN)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    michaelmoran-eu.pages.dev               │  │
│  │                                                           │  │
│  │   / ──→ dist/                                            │  │
│  │     ├── index.html       (Hero, Profile, Capabilities,   │  │
│  │     ├── cv.html          Engagements, Credentials,      │  │
│  │     └── 404.html         Testimonials, Contact, Footer)  │  │
│  │     /styles/                                             │  │
│  │     /fonts/  (Fraunces, Inter, JetBrains Mono)          │  │
│  │     /images/ (og-image.svg, favicon.svg)               │  │
│  │                                                           │  │
│  │   Static generation: Astro (SSG)                          │  │
│  │   Build output: /dist                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────────┘
                         │ Custom Domain (michaelmoran.eu)
                         │ Managed via Njalla DNS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Njalla DNS / Cloudflare                       │
│  CNAME www.michaelmoran.eu → michaelmoran-eu.pages.dev         │
│  ALIAS michaelmoran.eu → michaelmoran-eu.pages.dev             │
│                                                                  │
│  Security:                                                       │
│  - Automatic HTTPS (Cloudflare SSL)                            │
│  - CSP, HSTS, X-Frame-Options via _headers                     │
│  - No cookies, no tracking, self-hosted assets                 │
└─────────────────────────────────────────────────────────────────┘

                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                           │
│  .github/workflows/deploy.yml                                   │
│  - Build: npm run build                                         │
│  - Deploy: cloudflare/wrangler-action@v3                        │
│  - Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID       │
│                                                                  │
│  Branch protection: main (production only)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

- **Static Generation**: Zero client-side framework, maximum performance
- **GDPR Compliant**: No cookies, no tracking, self-hosted assets
- **Security Hardened**: CSP, HSTS, X-Frame-Options, Permissions-Policy
- **Responsive Design**: Mobile-first, WCAG 2.2 AA compliant
- **Scroll Animations**: CSS-based reveal animations (respects motion preference)

---

## Development

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- wrangler CLI (for Cloudflare Pages deployment)

### Setup

```bash
# Clone the repository
git clone https://github.com/owner/michaelmoran-eu.git
cd michaelmoran-eu

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at http://localhost:5173

### Building

```bash
# Development build
npm run build

# Preview production build
npm run preview
```

### Deploying

```bash
# Deploy to production (requires GitHub secrets)
npm run deploy

# Or use wrangler directly
wrangler pages deploy
```

---

## Content Management

All site copy lives in a single file: `src/content.ts`

To edit:
1. Open `src/content.ts`
2. Modify values in the exported objects
3. Run `npm run build` to see changes
4. Deploy when ready

### Content Sections

| Section | Export Name | Description |
|---------|-------------|-------------|
| Site Config | `siteConfig` | Title, description, URL, author |
| Hero | `hero` | Name, title, value proposition |
| Profile | `profile` | About section copy |
| Capabilities | `capabilities` | 6 numbered skill cards |
| Engagements | `engagements` | Case study entries |
| Credentials | `credentials` | Certification list |
| Testimonials | `testimonials` | Client endorssements |
| Contact | `contact` | Form config, PGP, LinkedIn |
| Footer | `footer` | Copyright, privacy note |

---

## Security Features

### HTTP Headers

Defined in `_headers`:

```
Content-Security-Policy     script-src 'self' 'sha256-2ZnDbMnvSkxuev4hVcFtAERGoN0iXOtSfwayfp9Oicg=' 'strict-dynamic'
X-Frame-Options            DENY
Referrer-Policy            strict-origin-when-cross-origin
Permissions-Policy         (lockdown of all browser features)
Strict-Transport-Security  max-age=31536000; includeSubDomains; preload
```

### Asset Handling

- All fonts bundled locally in `public/fonts/`
- All images self-hosted in `public/images/`
- No third-party CDN requests

---

## Deployment Configuration

### wrangler.toml

```toml
name = "michaelmoran-eu"
pages_build_output_dir = "dist"
compatibility_date = "2024-01-01"
```

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Pages: Edit scope |
| `CLOUDFLARE_ACCOUNT_ID` | 32-char account ID |

---

## DNS Configuration

See [DNS-SETUP.md](DNS-SETUP.md) for detailed instructions on:
- Setting up CNAME/ALIAS records at Njalla
- Adding custom domain in Cloudflare Pages
- Full DNS migration to Cloudflare

---

## Troubleshooting

### Common Issues

1. **DNS not resolving**: Check records with `dig michaelmoran.eu`
2. **SSL certificate pending**: Wait 24-48 hours after DNS setup
3. **404 errors**: Verify build output in `dist/` directory

### Debug Commands

```bash
# DNS resolution
dig michaelmoran.eu ANY
dig www.michaelmoran.eu CNAME

# SSL certificate
openssl s_client -servername michaelmoran.eu -connect michaelmoran.eu:443

# HTTP headers
curl -I https://michaelmoran.eu

# Cloudflare deployment list
wrangler pages deployment list
```

---

## TODO Checklist

Owner to complete:
- [ ] GitHub repository created and pushed
- [ ] CLOUDFLARE_API_TOKEN added to GitHub secrets
- [ ] CLOUDFLARE_ACCOUNT_ID added to GitHub secrets
- [ ] Njalla DNS records configured (CNAME + ALIAS)
- [ ] Custom domain added in Cloudflare Pages
- [ ] LinkedIn URL updated in src/content.ts
- [ ] PGP fingerprint added to content
- [ ] Certifications added to content
- [ ] Testimonials populated with real quotes
- [ ] CV PDF uploaded to public/cv/

---

## License

ISC — Free for personal and professional use.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial release |