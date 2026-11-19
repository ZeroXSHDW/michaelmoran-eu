# HANDOFF — Owner Action Required

This document lists every interactive step that requires owner credentials or login access.

---

## GitHub Repository Setup

### Step 1: Create GitHub Repository
**Location**: github.com

1. Sign in to GitHub
2. Create new repository: `michaelmoran-eu`
3. Set visibility to **Private** (recommended for initial development)
4. Initialize with README (will be replaced)

### Step 2: Push Code
```bash
# Clone the local repo to GitHub
cd michaelmoran-eu
git remote add origin git@github.com:USER/michaelmoran-eu.git
git branch -M main
git push -u origin main
```

---

## GitHub Secrets Configuration

**Location**: github.com/USER/michaelmoran-eu → Settings → Secrets and variables → Actions

Add these **Repository secrets**:

| Name | Value | How to Obtain |
|------|-------|---------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | See Step 3 below |
| `CLOUDFLARE_ACCOUNT_ID` | 32-character account ID | Cloudflare Dashboard → Overview |
| `GIT_AUTHOR_NAME` | Michael Moran | Optional: Git author name |
| `GIT_AUTHOR_EMAIL` | Email for commits | Optional: Git author email |

### Step 3: Get Cloudflare API Token

1. Sign in to **Cloudflare Dashboard**
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use template: "Pages Edit"
5. Permissions:
   - **Account** → **Pages** → **Edit**
   - **Zone** → **DNS** → **Read** (if using Method 2)
6. Scope: Select your account
7. Name: `michaelmoran-eu-deploy`
8. Copy the token immediately (won't be shown again)

---

## Njalla DNS Configuration

**Location**: https://njalla.com → Control Panel → Domains → michaelmoran.eu → DNS Records

### Method 1: CNAME + ALIAS (Immediate)

Create these records:

| Type | Name | Value/Points to | TTL |
|------|------|-----------------|-----|
| CNAME | www | michaelmoran-eu.pages.dev | Auto |
| ALIAS | @ | michaelmoran-eu.pages.dev | Auto |

**UI Location**: DNS Records → Add Record → select type and fill values

### Method 2: Full Migration to Cloudflare DNS

**Location**: https://njalla.com → Control Panel → Domains → michaelmoran.eu → Nameservers

1. Click **Nameservers** tab
2. Select **Custom nameservers**
3. Enter:
   - `luna.ns.cloudflare.com`
   - `max.ns.cloudflare.com`
4. Click **Save**

**Note**: DNS propagation may take 0-24 hours. Monitor at https://dnschecker.org

---

## LinkedIn URL Configuration

**Location**: `src/content.ts`

Find and replace:

```typescript
linkedin: {
  placeholder: 'https://linkedin.com/in/YOUR-USERNAME', // Replace this
},
```

---

## Certification Credentials

**Location**: `src/content.ts` → `credentials.items`

Replace placeholder entries with actual credentials:

```typescript
{
  name: 'CISSP',
  issuer: 'ISC²',
  year: '2019',
  verificationUrl: 'https://certification.isc2.org/verify',
},
```

---

## PGP Fingerprint

**Location**: Contact section in `src/content.ts` and displayed in the contact sidebar

Replace with actual fingerprint:

```
ABCD 1234 5678 90EF  1234  5678 90EF  1234 5678 90AB
```

---

## Contact Form Endpoint

**Location**: `src/content.ts` → `contact.form.action`

Replace with actual form service endpoint:

- **Formspree**: `https://formspree.io/f/{form_id}`
- **Netlify Forms**: Built-in, no action needed
- **Self-hosted**: Your server endpoint

---

## Testimonial Content

**Location**: `src/content.ts` → `testimonials.items`

Replace each placeholder with actual testimonials:

```typescript
{
  quote: 'Michael delivered a comprehensive assessment that identified critical vulnerabilities before they could be exploited in production.',
  attribution: 'Jane Smith, Head of Security, Major Bank',
},
```

---

## CV PDF Hosting

**Location**: `public/cv/michael-moran-cv.pdf`

Upload your CV PDF file here. The file name must match exactly.

---

## Quick Start Commands for Owner

```bash
# Clone and setup
git clone git@github.com:USER/michaelmoran-eu.git
cd michaelmoran-eu
npm ci

# Local development
npm run dev
# Open http://localhost:5173

# Build locally
npm run build

# Deploy (requires GitHub secrets configured)
npm run deploy
# or
gh workflow run deploy.yml
```

---

## Rollback Procedure

If a deployment causes issues:

### Via Cloudflare Dashboard
1. Go to **Pages** → `michaelmoran-eu` → **Deployments**
2. Find previous working deployment
3. Click **…** → **Rollback**

### Via CLI
```bash
wrangler pages deployment list
wrangler pages deployment rollback <deployment-id>
```

---

## Post-Deployment Verification

After first deployment, run:

```bash
# HTTPS check
curl -I https://michaelmoran.eu

# DNS check
dig +short michaelmoran.eu
dig +short www.michaelmoran.eu CNAME

# SSL certificate
openssl s_client -servername michaelmoran.eu -connect michaelmoran.eu:443 < /dev/null 2>/dev/null | openssl x509 -noout -subject
```

---

## Contact for Technical Issues

- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Wrangler Docs: https://developers.cloudflare.com/workers-cli/wrangler/