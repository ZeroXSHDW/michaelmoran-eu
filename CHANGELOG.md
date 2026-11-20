# Changelog

All notable changes to the michaelmoran.eu project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2026-11-20

### Added
- `public/.well-known/security.txt` for security contact information
- Enhanced security audit script to properly handle JSON-LD scripts (non-executable)

### Changed
- Updated CSP header in `_headers` with multiple SHA256 hashes for inline scripts
- Layout component cleaned up - removed redundant JSON-LD import
- Improved CSP compliance for scroll reveal script

### Fixed
- Security audit now properly distinguishes between executable and non-executable scripts
- Removed duplicate JSON-LD rendering (StructuredData now sole source)

## [1.4.0] - 2026-11-20

### Added
- Enhanced ContactForm component with full contact sidebar layout
- Keybase.io account URL (`https://keybase.io/zerodevllc`) added to JSON-LD schema
- Contact information sidebar showing email, LinkedIn, Keybase, GitHub, response time
- PGP fingerprint placeholder with clear instruction format

### Changed
- Form endpoint upgraded from placeholder to `https://formspree.io/f/xgaklegg`
- Enhanced ContactForm component with contact info sidebar and improved styling
- Fixed lint warnings in `scripts/audit-security.mjs` and `scripts/generate-sitemap.mjs`
- Updated sitemap URL to use canonical `michaelmoran.eu` domain

### Fixed
- ContactForm now properly displays form action from content.ts
- Unused imports removed from build scripts
- CSP nonce security implemented for inline scroll reveal script

## [1.3.0] - 2026-11-20

### Added
- Enhanced credentials section with real certification names (OSCP, GPEN)
- Improved testimonials with detailed professional quotes
- Added CV section export to content.ts
- Package.json updated with additional npm scripts

### Changed
- Updated README.md with current status section
- Marked completed items in TODO checklist
- Removed duplicate Features section from README
- Content improvements for professional presentation

### Fixed
- Content structure now properly organized with clear section exports
- Documentation reflects current deployment state

## [1.2.1] - 2026-11-20

### Added
- Keybase.io account URL added to contact section and JSON-LD schema

### Changed
- Improved CSP security with nonce-based inline script handling
- Enhanced documentation for form backend configuration
- Better TODO comments with implementation guidance

## [1.2.0] - 2026-11-20

### Added
- Self-hosted font files (Fraunces, Inter, JetBrains Mono) in WOFF2 format
- Automated RSS feed generation with full content syndication (`scripts/generate-rss.mjs`)
- Automated CV PDF generation from built HTML using Puppeteer (`scripts/generate-cv-pdf.mjs`)
- Build-time asset generation scripts integrated into npm build process
- Font preload hints for improved performance

### Changed
- Upgraded Astro from v3 to v7 (latest)
- Updated all npm dependencies to latest versions
- Updated copyright year to 2026
- Fixed JSON-LD rendering using Astro's `set:html` directive (removed fix-jsonld.js workaround)
- Updated CSP header with correct script hash for scroll reveal functionality
- Improved build process with asset generation after build step
- Improved CSS organization and consistency

### Fixed
- Missing font files in public/fonts/ (now properly downloaded and bundled)
- Missing CV PDF in public/cv/ (now auto-generated)
- RSS feed now includes all site content (hero, profile, capabilities, engagements, testimonials)
- JSON-LD Person schema now renders correctly without post-processing
- Section header layout fixed to prevent extra container wrapper
- Credentials section now shows all 3 certifications without duplicates

## [1.1.0] - 2024-11-19

### Added
- Enhanced CV page with professional summary, competencies, and experience sections
- RSS feed for content syndication (`public/rss.xml`)
- 404 error page for improved UX
- Placeholder PDF download link for CV

### Changed
- Updated CSP header with inline script hash for scroll reveal functionality
- Improved form handling with `data-action` attribute for privacy-respecting backends
- Updated LinkedIn URL structure in JSON-LD schema

### Fixed
- Layout now correctly imports and uses LinkedIn URL from content.ts
- CV page title correctly displays "CV — Michael Moran"
- Form action uses mailto: as placeholder, awaiting owner configuration

## [1.0.0] - 2024-01-01

### Added
- Initial project setup with Astro portfolio site
- Homepage with 6 sections: Hero, Profile, Capabilities, Engagements, Credentials, Testimonials, Contact
- Design system with light/dark mode support
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Self-hosted fonts (Fraunces, Inter, JetBrains Mono)
- JSON-LD Person schema for SEO
- Open Graph metadata
- Contact form with honeypot spam protection
- Scroll reveal animations
- WCAG 2.2 AA compliance
- Responsive design at 360/768/1024/1440/1920px
- Privacy-friendly implementation (no cookies, no tracking)

[Unreleased]: https://github.com/owner/michaelmoran-eu/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/owner/michaelmoran-eu/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/owner/michaelmoran-eu/releases/tag/v1.0.0