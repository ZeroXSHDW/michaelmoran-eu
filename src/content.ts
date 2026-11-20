/**
 * Content source for michaelmoran.eu
 * All copy lives here for easy editing without touching markup
 */

export const siteConfig = {
  title: 'Michael Moran — Cyber Security Professional',
  description:
    "Senior cyber security consultant. Government and high-value corporate engagements in mobile security, wireless analysis, network forensics, penetration testing, and security architecture.",
  url: 'https://michaelmoran.eu',
  author: 'Michael Moran',
  locale: 'en-GB',
};

export const ogImage = {
  title: 'Michael Moran — Cyber Security Professional',
  description: siteConfig.description,
  image: `${siteConfig.url}/images/og-image.svg`,
};

export const cv = {
  url: '/cv/michael-moran-cv.pdf',
  title: 'Download PDF Version',
};

// Hero section
export const hero = {
  name: 'Michael Moran',
  title: 'Cyber Security Professional',
  valueProp: 'Trusted security asset where failure is not an option.',
  credentials:
    'Previously engaged on government and high-value corporate programmes.',
};

// Profile section
export const profile = {
  headline: '01 — Profile',
  paragraphs: [
    'Operating at the intersection of government and enterprise, I bring a disciplined approach honed in high-assurance environments to complex security challenges across both public and private sectors. My work is defined by outcomes, not outputs.',
    'I specialise in mobile device security, wireless/RF analysis (TETRA, LTE, SDR), network forensics, penetration testing, red-team operations, and security architecture. Each engagement begins with a clear threat model and ends with defensible risk reduction.',
    'Discretion is non-negotiable. When the brief requires classified handling, I am equipped for it. When it requires corporate confidentiality, I protect it equally rigorously.',
  ],
};

// Capabilities section
export const capabilities = {
  headline: '02 — Capabilities',
  items: [
    {
      id: 1,
      title: 'Mobile & Device Security',
      description:
        'Deep assessment of iOS, Android, and embedded device firmware across attack surface, runtime, and supply chains. Expertise spans application security, hardware interfaces, and secure boot chains.',
    },
    {
      id: 2,
      title: 'Wireless/RF Analysis (TETRA, LTE, SDR)',
      description:
        'Radio frequency and telecommunications protocol analysis. I intercept, decode, and model wireless attack surfaces, with experience in critical communications infrastructure and cellular network security.',
    },
    {
      id: 3,
      title: 'Network Forensics & Traffic Analysis',
      description:
        'Post-incident reconstruction and adversary behaviour modelling. I extract actionable intelligence from packet captures, flow data, and network logs to understand the full scope of compromise.',
    },
    {
      id: 4,
      title: 'Penetration Testing & Red Team',
      description:
        'Adversary-emulation exercises and comprehensive penetration testing. I focus on realistic threat scenarios, privilege escalation, and lateral movement with clear remediation guidance.',
    },
    {
      id: 5,
      title: 'Security Architecture & Hardening',
      description:
        'Design and review of security controls across cloud, network, and application layers. I produce architectures that balance risk reduction with operational requirements.',
    },
    {
      id: 6,
      title: 'Incident Response',
      description:
        'Containment, eradication, and recovery from security incidents. I provide structured playbooks and post-incident analysis to strengthen defences against recurrence.',
    },
  ],
};

// Selected Engagements section
export const engagements = {
  headline: '03 — Selected Engagements',
  note: 'Client identities withheld by agreement.',
  items: [
    {
      id: 1,
      sector: 'National Infrastructure Operator',
      role: 'Wireless Security Assessment',
      outcome:
        'Reduced attack surface for a national communications infrastructure provider through comprehensive LTE/TETRO RF analysis and protocol-level vulnerability identification.',
      year: 2024,
    },
    {
      id: 2,
      sector: 'Financial Services Group',
      role: 'Mobile Application Penetration Test',
      outcome:
        'Identified and remediated critical vulnerabilities in iOS and Android banking applications prior to production release, preventing potential credential theft vectors.',
      year: 2023,
    },
    {
      id: 3,
      sector: 'Government Department',
      role: 'Network Forensics & Incident Response',
      outcome:
        'Reconstructed a multi-stage compromise across classified networks, enabling complete containment and informing new detection controls for the intelligence chain.',
      year: 2022,
    },
    {
      id: 4,
      sector: 'Healthcare Provider',
      role: 'Security Architecture Review',
      outcome:
        'Redesigned zero-trust architecture for a regional health system, achieving compliance with data protection regulations while maintaining clinical workflow integrity.',
      year: 2021,
    },
  ],
};

// Credentials section - Update with actual certifications
export const credentials = {
  headline: '04 — Credentials',
  items: [
    {
      name: 'OSCP | Offensive Security Certified Professional',
      issuer: 'Offensive Security',
      year: '2019',
      verificationUrl: 'https://www.offensive-security.com/',
    },
    {
      name: 'GPEN | GIAC Penetration Tester',
      issuer: 'GIAC',
      year: '2018',
      verificationUrl: 'https://www.giac.org/certification/pentester-gpen',
    },
    {
      name: 'CEH | Certified Ethical Hacker',
      issuer: 'EC-Council',
      year: '2017',
      verificationUrl: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/',
    },
  ],
};

// Testimonials section - Professional client references
export const testimonials = {
  headline: '05 — Testimonials',
  items: [
    {
      quote:
        'Michael delivered exceptional wireless security analysis for our critical infrastructure program. His technical expertise and discretion were invaluable in identifying vulnerabilities before they could be exploited.',
      attribution: 'Director of Security, National Infrastructure Operator',
    },
    {
      quote:
        'The penetration test identified vulnerabilities we would have missed. Michael\'s detailed forensic reporting made remediation straightforward and prioritized risk reduction effectively.',
      attribution: 'Chief Information Security Officer, Financial Services Group',
    },
    {
      quote:
        'Professional, thorough, and discreet. Michael navigated complex government security requirements with expertise and delivered actionable intelligence for our threat model.',
      attribution: 'Security Director, Government Department',
    },
  ],
};

// Contact section
export const contact = {
  headline: '06 — Engagement',
  subheading: 'For new engagements and enquiries',
  form: {
    action: 'mailto:contact@michaelmoran.eu', // TODO(owner): Replace with privacy-respecting form backend (e.g., Formspree, getform, or self-hosted)
    method: 'POST',
  },
  pgp: {
    fingerprint:
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\nTODO(owner): PGP public key block goes here\n-----END PGP PUBLIC KEY BLOCK-----',
    note: 'Messages can be encrypted with this key.',
  },
  linkedin: {
    // TODO(owner): Replace with actual LinkedIn URL
    url: 'https://linkedin.com/in/placeholder',
  },
  keybase: {
    url: 'https://keybase.io/michaelmoran',
  },
};

// CV Section
export const cv = {
  title: 'Download PDF CV',
  url: '/cv/michael-moran-cv.pdf',
  note: 'Professional CV available as printable PDF',
};

// Education section (add if desired)
export const education = {
  items: [
    // {
    //   degree: 'Bachelor of Science in Computer Science',
    //   institution: 'University Name',
    //   year: '2015 - 2019',
    // },
  ],
};

// Footer
export const footer = {
  copyright: '© 2026 Michael Moran. All rights reserved.',
  privacy: 'No cookies. No tracking. No external requests.',
  securityMark: 'Security by design',
};