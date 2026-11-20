#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const siteConfig = {
  title: 'Michael Moran — Cyber Security Professional',
  description: 'Senior cyber security consultant. Government and high-value corporate engagements in mobile security, wireless analysis, network forensics, penetration testing, and security architecture.',
  url: 'https://michaelmoran.eu',
  locale: 'en-GB',
};

const hero = {
  name: 'Michael Moran',
  title: 'Cyber Security Professional',
  valueProp: 'Trusted security asset where failure is not an option.',
  credentials: 'Previously engaged on government and high-value corporate programmes.',
};

const profile = {
  headline: '01 — Profile',
  paragraphs: [
    'Operating at the intersection of government and enterprise, I bring a disciplined approach honed in high-assurance environments to complex security challenges across both public and private sectors. My work is defined by outcomes, not outputs.',
    'I specialise in mobile device security, wireless/RF analysis (TETRA, LTE, SDR), network forensics, penetration testing, red-team operations, and security architecture. Each engagement begins with a clear threat model and ends with defensible risk reduction.',
    'Discretion is non-negotiable. When the brief requires classified handling, I am equipped for it. When it requires corporate confidentiality, I protect it equally rigorously.',
  ],
};

const capabilities = {
  headline: '02 — Capabilities',
  items: [
    {
      id: 1,
      title: 'Mobile & Device Security',
      description: 'Deep assessment of iOS, Android, and embedded device firmware across attack surface, runtime, and supply chains. Expertise spans application security, hardware interfaces, and secure boot chains.',
    },
    {
      id: 2,
      title: 'Wireless/RF Analysis (TETRA, LTE, SDR)',
      description: 'Radio frequency and telecommunications protocol analysis. I intercept, decode, and model wireless attack surfaces, with experience in critical communications infrastructure and cellular network security.',
    },
    {
      id: 3,
      title: 'Network Forensics & Traffic Analysis',
      description: 'Post-incident reconstruction and adversary behaviour modelling. I extract actionable intelligence from packet captures, flow data, and network logs to understand the full scope of compromise.',
    },
    {
      id: 4,
      title: 'Penetration Testing & Red Team',
      description: 'Adversary-emulation exercises and comprehensive penetration testing. I focus on realistic threat scenarios, privilege escalation, and lateral movement with clear remediation guidance.',
    },
    {
      id: 5,
      title: 'Security Architecture & Hardening',
      description: 'Design and review of security controls across cloud, network, and application layers. I produce architectures that balance risk reduction with operational requirements.',
    },
    {
      id: 6,
      title: 'Incident Response',
      description: 'Containment, eradication, and recovery from security incidents. I provide structured playbooks and post-incident analysis to strengthen defences against recurrence.',
    },
  ],
};

const engagements = {
  headline: '03 — Selected Engagements',
  note: 'Client identities withheld by agreement.',
  items: [
    {
      id: 1,
      sector: 'National Infrastructure Operator',
      role: 'Wireless Security Assessment',
      outcome: 'Reduced attack surface for a national communications infrastructure provider through comprehensive LTE/TETRO RF analysis and protocol-level vulnerability identification.',
      year: 2024,
    },
    {
      id: 2,
      sector: 'Financial Services Group',
      role: 'Mobile Application Penetration Test',
      outcome: 'Identified and remediated critical vulnerabilities in iOS and Android banking applications prior to production release, preventing potential credential theft vectors.',
      year: 2023,
    },
    {
      id: 3,
      sector: 'Government Department',
      role: 'Network Forensics & Incident Response',
      outcome: 'Reconstructed a multi-stage compromise across classified networks, enabling complete containment and informing new detection controls for the intelligence chain.',
      year: 2022,
    },
    {
      id: 4,
      sector: 'Healthcare Provider',
      role: 'Security Architecture Review',
      outcome: 'Redesigned zero-trust architecture for a regional health system, achieving compliance with data protection regulations while maintaining clinical workflow integrity.',
      year: 2021,
    },
  ],
};

const testimonials = {
  headline: '05 — Testimonials',
  items: [
    {
      quote: 'Michael delivered exceptional wireless security analysis for our critical infrastructure program. His technical expertise and discretion were invaluable.',
      attribution: 'Director of Security, National Infrastructure Operator',
    },
    {
      quote: 'The penetration test identified vulnerabilities we would have missed. Michael\'s detailed reporting made remediation straightforward.',
      attribution: 'CISO, Financial Services Group',
    },
    {
      quote: 'Professional, thorough, and discreet. Michael navigated complex government security requirements with expertise.',
      attribution: 'Security Director, Government Department',
    },
  ],
};

const items = [
  // Hero/profile as first item
  {
    title: `${hero.name} — ${hero.title}`,
    link: `${siteConfig.url}/`,
    description: hero.valueProp,
    pubDate: new Date().toUTCString(),
    guid: siteConfig.url,
  },
  // Profile
  {
    title: 'Profile',
    link: `${siteConfig.url}/#profile`,
    description: profile.paragraphs[0],
    pubDate: new Date().toUTCString(),
    guid: `${siteConfig.url}/#profile`,
  },
  // Capabilities
  ...capabilities.items.map((item) => ({
    title: `Capability: ${item.title}`,
    link: `${siteConfig.url}/#capabilities`,
    description: item.description,
    pubDate: new Date().toUTCString(),
    guid: `${siteConfig.url}/#capability-${item.id}`,
  })),
  // Engagements
  ...engagements.items.map((item) => ({
    title: `Engagement: ${item.role} at ${item.sector}`,
    link: `${siteConfig.url}/#engagements`,
    description: item.outcome,
    pubDate: new Date(item.year, 0, 1).toUTCString(),
    guid: `${siteConfig.url}/#engagement-${item.id}`,
  })),
  // Testimonials
  ...testimonials.items.map((item, i) => ({
    title: `Testimonial ${i + 1}`,
    link: `${siteConfig.url}/#testimonials`,
    description: item.quote,
    pubDate: new Date().toUTCString(),
    guid: `${siteConfig.url}/#testimonial-${i}`,
  })),
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>${siteConfig.locale}</language>
    ${items.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

const outputPath = join(__dirname, '..', 'public', 'rss.xml');
writeFileSync(outputPath, rss);
console.log(`✓ RSS feed generated at: ${outputPath}`);