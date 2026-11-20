#!/usr/bin/env python3
"""
Regenerate just the blog posts with better JSON handling.
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

# Blog post items
writing_items = [
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
        'title': "Prompt Injection Defense Patterns: A Practitioner's Guide",
        'slug': 'prompt-injection-defense-patterns',
        'type': 'guide',
        'summary': 'Comprehensive guide to detecting and mitigating prompt injection attacks. Covers instruction hierarchy, delimiter strategies, semantic firewalls, and guardrail validation. Includes production-ready Python implementations.',
        'publishedDate': '2024',
        'tags': ['Prompt Injection', 'Defense', 'Python', 'SEC411'],
        'readingTimeMinutes': 30,
        'link': 'https://github.com/ZeroXSHDW/prompt-injection-defense',
        'featured': False,
    },
]

def generate_blog_post(topic: Dict) -> Dict:
    """Generate a blog post from a writing/speaking/case study topic."""
    prompt = f"""You are Michael Moran, a senior cyber security professional specializing in AI/ML security, threat modeling, and secure architecture. Write a technical blog post for michaelmoran.eu.

TOPIC: {topic.get('title', '')}
TYPE: {topic.get('type', 'article')}
SUMMARY: {topic.get('summary', '')}
TAGS: {', '.join(topic.get('tags', []))}
PUBLISHED: {topic.get('publishedDate', '2024')}

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

def main():
    print("=" * 60)
    print("REGENERATING BLOG POSTS")
    print("=" * 60)
    
    for item in writing_items:
        print(f"  Generating: {item['title'][:50]}...")
        try:
            blog = generate_blog_post(item)
            save_content(f"blog_{item['slug']}.json", json.dumps(blog, indent=2))
            save_content(f"blog_{item['slug']}.md", blog.get('content_md', ''))
        except Exception as e:
            print(f"    ✗ Failed: {e}")
            # Try once more with lower temperature
            try:
                blog = generate_blog_post(item)
                save_content(f"blog_{item['slug']}.json", json.dumps(blog, indent=2))
                save_content(f"blog_{item['slug']}.md", blog.get('content_md', ''))
                print(f"    ✓ Retried successfully")
            except Exception as e2:
                print(f"    ✗ Retry failed: {e2}")
    
    print("\nBlog post regeneration complete!")

if __name__ == "__main__":
    main()