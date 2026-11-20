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
  icon: z.string().optional(),
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
  logo: z.string().optional(),
  featured: z.boolean().default(false),
});

export const CredentialSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
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
  avatar: z.string().optional(),
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
  formEndpoint: z.string().url().optional(),
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

export const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  client: z.string().optional(),
  sector: z.string().optional(),
  period: z.string(),
  challenge: z.string(),
  approach: z.string(),
  outcome: z.string(),
  metrics: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  confidentiality: z.enum(['public', 'anonymized', 'confidential']).default('anonymized'),
  link: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export const WritingSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  type: z.enum(['blog', 'whitepaper', 'research', 'book', 'guide', 'article']),
  summary: z.string(),
  publishedDate: z.string(),
  tags: z.array(z.string()).optional(),
  link: z.string().url().optional(),
  pdfUrl: z.string().url().optional(),
  readingTimeMinutes: z.number().int().positive().optional(),
  featured: z.boolean().default(false),
});

export const SpeakingSchema = z.object({
  id: z.string(),
  title: z.string(),
  event: z.string(),
  eventUrl: z.string().url().optional(),
  date: z.string(),
  location: z.string().optional(),
  type: z.enum(['keynote', 'talk', 'workshop', 'panel', 'training', 'podcast']),
  audience: z.string().optional(),
  slidesUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
});

export const ContentSchema = z.object({
  siteConfig: SiteConfigSchema,
  hero: HeroSchema,
  profile: ProfileSchema,
  capabilities: z.array(CapabilitySchema),
  engagements: z.array(EngagementSchema),
  credentials: z.array(CredentialSchema),
  testimonials: z.array(TestimonialSchema),
  caseStudies: z.array(CaseStudySchema).optional(),
  writing: z.array(WritingSchema).optional(),
  speaking: z.array(SpeakingSchema).optional(),
  contact: ContactSchema,
  footer: FooterSchema,
});

export type Content = z.infer<typeof ContentSchema>;