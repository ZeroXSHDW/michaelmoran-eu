#!/usr/bin/env python3
"""
Generate AI-enhanced content for michaelmoran.eu using freellmapi:
- Blog posts from portfolio data
- Case study deep-dives
- Speaking abstracts and proposals
- SEO-optimized content
"""

import json
import requests
import re
from pathlib import Path
from typing import Dict, List, Any

FREELLM_API = "http://127.0.0.1:3001/v1/chat/completions"
FREELLM_KEY = "freellmapi-805e627aa569bf60115c77214a4e02ae0009c0a2b31cebde"

OUTPUT_DIR = Path("ai-generated-content")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def call_freellm(prompt: str, temperature: float = 0.4, max_tokens: int = 6000) -> str:
    headers = {
        "Authorization": f"Bearer {FREELLM_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "auto",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    resp = requests.post(FREELLM_API, headers=headers, json=payload, timeout=180)
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"]
    return re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', content)

def extract_json(content: str) -> Dict:
    # Clean control characters first
    content = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', content)
    try:
        return json.loads(content)
    except:
        pass
    m = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
    if m: return json.loads(m.group(1))
    m = re.search(r'\{.*\}', content, re.DOTALL)
    if m: return json.loads(m.group(0))
    raise ValueError('No JSON found')

def save_content(filename: str, content: str):
    filepath = OUTPUT_DIR / filename
    filepath.write_text(content)
    print(f"  ✓ Saved {filepath}")

# Portfolio data (extracted from content.ts)
portfolio = {
    'writing': [
        {
            'id': 'writing-sec411-book',
            'title': 'SANS SEC411: Managing AI Cybersecurity Risk — Official Course Book',
            'slug': 'sec411-book',
            'type': 'book',
            'summary': 'Definitive 607-page hardcover covering LLM internals, prompt injection taxonomy, RAG poisoning, agentic system guardrails, MCP security, and defense engineering. Includes 136 lab tasks and 20+ defense scripts.',
            'publishedDate': '2024',
            'tags': ['SEC411', 'AI Security', 'SANS', 'LLM Security'],
            'readingTimeMinutes': 1200,
            'featured': True,
        },
        {
            'id': 'writing-mitre-atlas-llm',
            'title': 'Mapping MITRE ATLAS to LLM Application Threat Models',
            'slug': 'mitre-atlas-llm-threat-modeling',
            'type': 'whitepaper',
            'summary': 'Technical whitepaper demonstrating how to apply MITRE ATLAS techniques to real-world LLM-integrated applications. Includes STRIDE mapping, attack trees, and mitigation patterns for RAG, agents, and tool use.',
            'publishedDate': '2024',
            'tags': ['MITRE ATLAS', 'Threat Modeling', 'LLM Security', 'STRIDE'],
            'readingTimeMinutes': 45,
            'link': 'https://github.com/ZeroXSHDW/mitre-atlas-llm-threat-modeling',
            'featured': True,
        },
        {
            'id': 'writing-prompt-injection-defense',
            'title': 'Prompt Injection Defense Patterns: A Practitioner\'s Guide',
            'slug': 'prompt-injection-defense-patterns',
            'type': 'guide',
            'summary': 'Comprehensive guide to detecting and mitigating prompt injection attacks. Covers instruction hierarchy, delimiter strategies, semantic firewalls, and guardrail validation. Includes production-ready Python implementations.',
            'publishedDate': '2024',
            'tags': ['Prompt Injection', 'Defense', 'Python', 'SEC411'],
            'readingTimeMinutes': 30,
            'link': 'https://github.com/ZeroXSHDW/prompt-injection-defense',
            'featured': False,
        },
    ],
    'caseStudies': [
        {
            'id': 'case-ai-security-audit',
            'title': 'AI/ML Security Audit for Financial Services Firm',
            'slug': 'ai-security-audit-financial',
            'client': 'Major European Bank (anonymized)',
            'sector': 'Financial Services',
            'period': 'Q1 2024',
            'challenge': 'Assess security posture of LLM-integrated customer support platform handling PII and financial data. Identify prompt injection, data exfiltration, and model extraction risks.',
            'approach': 'Applied MITRE ATLAS framework for AI threat modeling. Conducted red team exercises simulating adversarial prompts, RAG poisoning, and agentic tool misuse. Built custom evaluation harness for guardrail effectiveness testing.',
            'outcome': 'Discovered 17 critical/high vulnerabilities including 3 zero-day prompt injection chains. Delivered prioritized remediation roadmap with code-level fixes. Client implemented all P0 fixes within 2 weeks.',
            'metrics': [
                '17 vulnerabilities (3 critical, 7 high, 7 medium)',
                '94% guardrail bypass rate pre-fix → 0% post-fix',
                '2-week remediation for all P0 findings',
            ],
            'tags': ['LLM Security', 'MITRE ATLAS', 'Red Teaming', 'Financial Services'],
            'confidentiality': 'anonymized',
            'featured': True,
        },
        {
            'id': 'case-sec411-materials',
            'title': 'SANS SEC411 Course Materials Development',
            'slug': 'sec411-materials-development',
            'client': 'ZeroDev LLC / SANS Institute',
            'sector': 'Security Training',
            'period': '2024–Present',
            'challenge': 'Create definitive study materials for SANS SEC411: Managing AI Cybersecurity Risk — a new course with no existing comprehensive resources. Must cover LLM internals, attack taxonomy, defense engineering, and agentic system security.',
            'approach': 'Built 607-page hardcover book from primary sources. Developed 136 verified lab tasks across 5 environments. Created 20+ autonomous defense scripts. Built interactive exam simulator and cyber defense console. Multi-model consensus audit for technical accuracy.',
            'outcome': 'Published Amazon KDP hardcover (€150 retail). All 136/136 labs verified. 100/100 multi-model consensus score. Materials adopted by SANS for official course delivery.',
            'metrics': [
                '607-page print-ready hardcover',
                '136/136 lab tasks verified',
                '20+ production-grade Python scripts',
                '100/100 consensus audit score',
            ],
            'tags': ['SEC411', 'AI Security', 'Curriculum Development', 'SANS'],
            'confidentiality': 'public',
            'link': 'https://github.com/ZeroXSHDW/SEC411-Managing-AI-Cybersecurity-Risk',
            'featured': True,
        },
    ],
    'speaking': [
        {
            'id': 'speaking-sec411-launch',
            'title': 'Launching SEC411: Managing AI Cybersecurity Risk',
            'event': 'SANS Institute Course Launch',
            'eventUrl': 'https://sans.org',
            'date': '2024-09-15',
            'location': 'Virtual / Global',
            'type': 'keynote',
            'audience': '3,000+ security professionals',
            'slidesUrl': 'https://github.com/ZeroXSHDW/sec411-launch-slides',
            'tags': ['SEC411', 'AI Security', 'SANS', 'Course Launch'],
            'featured': True,
        },
        {
            'id': 'speaking-llm-threat-modeling',
            'title': 'Threat Modeling LLM Applications with MITRE ATLAS',
            'event': 'BSides Dublin 2024',
            'eventUrl': 'https://bsidesdublin.ie',
            'date': '2024-06-22',
            'location': 'Dublin, Ireland',
            'type': 'talk',
            'audience': '200+ practitioners',
            'slidesUrl': 'https://github.com/ZeroXSHDW/bsides-dublin-2024-slides',
            'videoUrl': 'https://youtube.com/watch?v=...',
            'tags': ['MITRE ATLAS', 'Threat Modeling', 'LLM Security', 'BSides'],
            'featured': True,
        },
        {
            'id': 'speaking-prompt-injection-workshop',
            'title': 'Hands-On: Prompt Injection Attack & Defense',
            'event': 'OWASP Ireland Chapter Meeting',
            'eventUrl': 'https://owasp.org/www-chapter-ireland/',
            'date': '2024-03-14',
            'location': 'Dublin, Ireland',
            'type': 'workshop',
            'audience': '50 developers & security engineers',
            'slidesUrl': 'https://github.com/ZeroXSHDW/owasp-ireland-workshop-2024',
            'tags': ['Prompt Injection', 'Workshop', 'OWASP', 'Hands-on'],
            'featured': False,
        },
    ],
    'hero': {
        'name': 'Michael Moran',
        'title': 'Cyber Security Professional',
        'valueProposition': 'Securing AI systems, building resilient architectures, and teaching defensive cyber operations.',
    },
    'profile': {
        'headline': '15+ years securing critical infrastructure and emerging technologies',
        'body': 'I specialize in AI/ML model security, threat modeling for LLM applications, and building defense-in-depth architectures. My work spans government, financial services, and critical infrastructure sectors. I\'m the author of the definitive SANS SEC411: Managing AI Cybersecurity Risk study materials and maintain several open-source security tools.',
        'location': 'Dublin, Ireland / Remote',
        'availability': 'Open to consulting engagements and speaking opportunities',
    },
    'capabilities': [
        {'number': 1, 'title': 'AI/ML Security', 'description': 'Prompt injection defense, RAG poisoning prevention, model extraction mitigation, agentic system guardrails', 'icon': 'shield-alert', 'tags': ['OWASP LLM Top 10', 'SEC411', 'MCP Security']},
        {'number': 2, 'title': 'Threat Modeling & Architecture', 'description': 'STRIDE, PASTA, MITRE ATLAS mapping for AI systems. Secure design reviews for LLM-integrated applications.', 'icon': 'git-branch', 'tags': ['STRIDE', 'PASTA', 'MITRE ATLAS']},
    ],
}

def load_portfolio():
    return portfolio

portfolio = load_portfolio()

# =============================================================================
# BLOG POST GENERATION
# =============================================================================

def generate_blog_post(topic: Dict, portfolio_data: Dict) -> Dict:
    """Generate a blog post from a writing/speaking/case study topic."""
    prompt = f"""You are Michael Moran, a senior cyber security professional specializing in AI/ML security, threat modeling, and secure architecture. Write a technical blog post for michaelmoran.eu.

TOPIC: {topic.get('title', '')}
TYPE: {topic.get('type', topic.get('event', 'article'))}
SUMMARY: {topic.get('summary', '')}
TAGS: {', '.join(topic.get('tags', []))}
PUBLISHED: {topic.get('publishedDate', topic.get('date', '2024'))}

AUTHOR CONTEXT:
- 15+ years securing critical infrastructure and emerging technologies
- Author of SANS SEC411: Managing AI Cybersecurity Risk
- Lead Architect of CogniRise Healing Realms
- GIAC certifications: GSEC, GCIH, GPEN, AWS Security Specialty
- NIST AI RMF Practitioner, ISO 42001 Lead Implementer

WRITING STYLE:
- Technical depth with practitioner focus
- Code/configuration examples where relevant
- Actionable takeaways
- No marketing fluff
- First-person professional voice
- ~1500-2500 words

STRUCTURE:
1. Hook - why this matters now
2. Problem context - real-world scenario
3. Technical deep-dive - core concepts
4. Practical implementation - code/config/patterns
5. Lessons learned / common pitfalls
6. Resources / next steps

OUTPUT as JSON with keys: title, slug, excerpt, content_md, tags, reading_time_minutes, seo_keywords, meta_description"""

    result = call_freellm(prompt, temperature=0.5, max_tokens=8000)
    return extract_json(result)

def generate_case_study_deep_dive(case: Dict) -> Dict:
    """Generate an expanded case study deep-dive."""
    prompt = f"""You are Michael Moran writing an expanded case study deep-dive for your portfolio.

CASE STUDY: {case.get('title', '')}
CLIENT: {case.get('client', '')}
SECTOR: {case.get('sector', '')}
PERIOD: {case.get('period', '')}
CHALLENGE: {case.get('challenge', '')}
APPROACH: {case.get('approach', '')}
OUTCOME: {case.get('outcome', '')}
METRICS: {json.dumps(case.get('metrics', []))}
TAGS: {', '.join(case.get('tags', []))}

Write a comprehensive case study deep-dive (~2000-3000 words) with:

1. **Executive Summary** - 2-3 paragraph overview
2. **Client Context** - anonymized but specific sector/size
3. **The Challenge** - technical and business problem
4. **Threat Model & Methodology** - frameworks used (MITRE ATLAS, STRIDE, etc.)
5. **Technical Approach** - step-by-step with specifics
6. **Key Findings** - vulnerabilities discovered with CVSS/impact
7. **Remediation Strategy** - prioritized, with code-level guidance
8. **Results & Metrics** - quantifiable outcomes
9. **Lessons Learned** - what worked, what didn't
10. **Applicability** - how this applies to other organizations
11. **Artifacts** - references to tools/scripts created

OUTPUT as JSON with keys: title, slug, executive_summary, client_context, challenge, methodology, technical_approach, key_findings, remediation, results, lessons, applicability, artifacts, tags, reading_time_minutes"""

    result = call_freellm(prompt, temperature=0.4, max_tokens=8000)
    return extract_json(result)

def generate_speaking_abstract(speaking: Dict) -> Dict:
    """Generate a polished speaking abstract and proposal."""
    prompt = f"""You are Michael Moran creating a conference speaking proposal/abstract.

TALK: {speaking.get('title', '')}
EVENT: {speaking.get('event', '')}
TYPE: {speaking.get('type', 'talk')}
AUDIENCE: {speaking.get('audience', '')}
DATE: {speaking.get('date', '')}
LOCATION: {speaking.get('location', '')}
TAGS: {', '.join(speaking.get('tags', []))}

Create a comprehensive speaking package:

1. **Abstract** (300 words max) - conference submission ready
2. **Elevator Pitch** (50 words) - for event marketing
3. **Learning Objectives** - 3-4 measurable outcomes
4. **Target Audience** - specific roles/levels
5. **Prerequisites** - what attendees should know
6. **Outline with Timing** - detailed 45-60 min breakdown
7. **Key Takeaways** - 3-5 actionable items
8. **Speaker Bio** - 100 words tailored to this topic
9. **Previous Speaking** - relevant experience
10. **Technical Requirements** - A/V, live demo needs

OUTPUT as JSON with keys: abstract, elevator_pitch, learning_objectives, target_audience, prerequisites, outline, key_takeaways, speaker_bio, previous_experience, technical_requirements, tags"""

    result = call_freellm(prompt, temperature=0.4, max_tokens=5000)
    return extract_json(result)

def generate_seo_content(portfolio_data: Dict) -> Dict:
    """Generate SEO-optimized content for key pages."""
    prompt = f"""Generate SEO-optimized content for michaelmoran.eu key pages.

PORTFOLIO DATA:
- Name: Michael Moran
- Title: Cyber Security Professional
- Specialties: AI/ML Security, Threat Modeling, Secure Architecture, Incident Response
- Key Projects: SEC411 Materials, CogniRise, MITRE ATLAS LLM Threat Modeling
- Certifications: GSEC, GCIH, GPEN, AWS Security Specialty, NIST AI RMF, ISO 42001
- Location: Dublin, Ireland / Remote
- Availability: Consulting & Speaking

Generate for these pages:

1. **Homepage Hero SEO** - H1, subheadline, 3 key value props with keywords
2. **About Page** - 500-word professional bio with keyword integration
3. **Services Page** - 6 service offerings with titles, descriptions, keywords
4. **Case Studies Index** - Intro copy with keywords
5. **Speaking Page** - Intro with event types, topics, keywords
6. **Blog Index** - Category descriptions with keywords
7. **Meta Tags** - title, description, OG tags for each page
8. **Schema.org JSON-LD** - Person, ProfessionalService, WebSite schemas

TARGET KEYWORDS: AI security consultant, LLM threat modeling, prompt injection defense, MITRE ATLAS, SANS SEC411 instructor, secure architecture review, incident response consultant, NIST AI RMF implementation

OUTPUT as JSON with keys for each page section"""

    result = call_freellm(prompt, temperature=0.4, max_tokens=8000)
    return extract_json(result)

def main():
    print("=" * 60)
    print("GENERATING AI CONTENT FOR MICHAELMORAN.EU")
    print("=" * 60)
    
    # Generate blog posts from writing portfolio
    print("\n📝 Generating Blog Posts...")
    writing_items = portfolio.get('writing', [])
    for item in writing_items[:3]:  # First 3
        print(f"  Generating: {item['title'][:50]}...")
        try:
            blog = generate_blog_post(item, portfolio)
            save_content(f"blog_{item['slug']}.json", json.dumps(blog, indent=2))
            save_content(f"blog_{item['slug']}.md", blog.get('content_md', ''))
        except Exception as e:
            print(f"    ✗ Failed: {e}")
    
    # Generate case study deep-dives
    print("\n📊 Generating Case Study Deep-Dives...")
    case_studies = portfolio.get('caseStudies', [])
    for case in case_studies[:2]:  # First 2
        print(f"  Generating: {case['title'][:50]}...")
        try:
            deep_dive = generate_case_study_deep_dive(case)
            save_content(f"case_study_{case['slug']}.json", json.dumps(deep_dive, indent=2))
            # Also save as markdown
            md = f"# {deep_dive.get('title', '')}\n\n"
            md += f"## Executive Summary\n{deep_dive.get('executive_summary', '')}\n\n"
            md += f"## Client Context\n{deep_dive.get('client_context', '')}\n\n"
            md += f"## The Challenge\n{deep_dive.get('challenge', '')}\n\n"
            md += f"## Threat Model & Methodology\n{deep_dive.get('methodology', '')}\n\n"
            md += f"## Technical Approach\n{deep_dive.get('technical_approach', '')}\n\n"
            md += f"## Key Findings\n{deep_dive.get('key_findings', '')}\n\n"
            md += f"## Remediation Strategy\n{deep_dive.get('remediation', '')}\n\n"
            md += f"## Results & Metrics\n{deep_dive.get('results', '')}\n\n"
            md += f"## Lessons Learned\n{deep_dive.get('lessons', '')}\n\n"
            md += f"## Applicability\n{deep_dive.get('applicability', '')}\n\n"
            save_content(f"case_study_{case['slug']}.md", md)
        except Exception as e:
            print(f"    ✗ Failed: {e}")
    
    # Generate speaking abstracts
    print("\n🎤 Generating Speaking Abstracts...")
    speaking_items = portfolio.get('speaking', [])
    for talk in speaking_items[:3]:  # First 3
        print(f"  Generating: {talk['title'][:50]}...")
        try:
            abstract = generate_speaking_abstract(talk)
            save_content(f"speaking_{talk['id']}.json", json.dumps(abstract, indent=2))
        except Exception as e:
            print(f"    ✗ Failed: {e}")
    
    # Generate SEO content
    print("\n🔍 Generating SEO Content...")
    try:
        seo = generate_seo_content(portfolio)
        save_content("seo_content.json", json.dumps(seo, indent=2))
    except Exception as e:
        print(f"    ✗ Failed: {e}")
    
    print("\n" + "=" * 60)
    print("CONTENT GENERATION COMPLETE")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()