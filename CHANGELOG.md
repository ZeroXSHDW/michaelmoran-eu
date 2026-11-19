# Changelog

All notable changes to the michaelmoran.eu project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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