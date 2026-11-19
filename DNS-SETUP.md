# DNS Setup Guide for michaelmoran.eu

## Overview

This document provides step-by-step instructions for configuring DNS records at Njalla and Cloudflare Pages to serve the website at `michaelmoran.eu`.

---

## Prerequisites

Before starting, ensure you have:
1. Access to the Njalla control panel
2. Cloudflare account with API token ( Pages: Edit scope)
3. The wrangler project already created

---

## Current Status

**Deployment Progress**: ⚠️ IN PROGRESS

| Step | Status | Notes |
|------|--------|-------|
| GitHub repo created | ✅ Complete | https://github.com/ZeroXSHDW/michaelmoran-eu |
| Secrets configured | ✅ Complete | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` set |
| Cloudflare Pages project | ✅ Complete | `michaelmoran-eu` project created |
| Custom domain added | ✅ Complete | `michaelmoran.eu` added (pending DNS) |
| DNS configuration | ⏳ PENDING | Njalla DNS records to be created |
| HTTPS verification | ⏳ PENDING | After DNS propagation |

### Current Deployment

Site is live at: https://df8d7c66.michaelmoran-eu.pages.dev

### Next Steps for Owner

1. **Log into Njalla control panel** → Domain → DNS Records
2. **Create CNAME record**:
   - Type: `CNAME`
   - Name: `michaelmoran.eu` (or `@` for apex)
   - Target: `michaelmoran-eu.pages.dev`
   - TTL: `Auto`
   
3. **Create CNAME for www** (if different from apex):
   - Type: `CNAME`
   - Name: `www.michaelmoran.eu`
   - Target: `michaelmoran-eu.pages.dev`
   - TTL: `Auto`

4. **Verify in Cloudflare Pages** Dashboard → Pages → Custom Domains
   - Status should change from "pending" to "Active"

5. **Wait 24-48 hours** for DNS propagation and SSL certificate issuance

### Alternative: Use Cloudflare DNS

If you prefer full Cloudflare DNS management:

1. In Njalla → Domain → Nameservers → Custom
2. Replace with Cloudflare nameservers:
   - `luna.ns.cloudflare.com`
   - `max.ns.cloudflare.com`
3. Then configure DNS records in Cloudflare Dashboard → DNS

### Step 1: Create Cloudflare Pages Project

Owner must run this command locally or via GitHub Actions:

```bash
wrangler pages project create michaelmoran-eu --production-branch main
```

After creation, note the **Account ID** from the output - this goes in GitHub secrets as `CLOUDFLARE_ACCOUNT_ID`.

### Step 2: Configure Njalla DNS Records

Log into the **Njalla control panel** → **Domain** → **DNS Records**.

#### Create CNAME for www:
```
Type: CNAME
Name: www
Target: michaelmoran-eu.pages.dev
TTL: Auto
```

#### Create ALIAS for apex (michaelmoran.eu):
Njalla supports ALIAS/ANAME-like records for apex domains.

```
Type: ALIAS (or ANAME if available)
Name: @
Target: michaelmoran-eu.pages.dev
TTL: Auto
```

If ALIAS/ANAME is not available, use an A record pointing to Pages' IP addresses (less ideal):

```
Type: A
Name: @
Target: 162.159.82.167
Target: 162.159.83.167
TTL: Auto
```

Then in Cloudflare Pages:
- Go to **Custom Domains**
- Add `michaelmoran.eu` as a custom domain

### Step 3: Add Custom Domain in Cloudflare Pages

1. Go to **Cloudflare Dashboard** → **Pages** → `michaelmoran-eu`
2. Click **Custom domains** → **Set up custom domain**
3. Enter: `michaelmoran.eu`
4. Select DNS provider: **Other** (or **Njalla** if available)
5. Cloudflare will provide verification records if needed

### Step 4: Verify HTTPS

Cloudflare Pages automatically provisions SSL certificates. After DNS propagation:

1. In Pages dashboard, under **Custom domains**
2. Status should show "Active" with a green check
3. Certificate status should show "Valid"

### Step 5: Verify Setup

Run these commands from your terminal:

```bash
# Verify A records
dig +short michaelmoran.eu A
dig +short www.michaelmoran.eu CNAME

# Verify HTTPS
openssl s_client -servername michaelmoran.eu -connect michaelmoran.eu:443 < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates

# Test HTTP redirect
curl -I http://michaelmoran.eu 2>/dev/null | head -5
```

Expected output:
- `dig` should show IP addresses or CNAME targets
- `openssl` should show certificate issued to `michaelmoran.eu`
- `curl -I` should return `301 Moved Permanently` with `Location: https://michaelmoran.eu/`

---

## Method 2: Full Cloudflare DNS Hosting (Long-term recommended)

This method moves all DNS management to Cloudflare for optimal SSL certificate handling.

### Step 1: Change Nameservers at Registrar

1. In Njalla control panel → **Domain** → **Nameservers**
2. Select **Custom nameservers**
3. Enter Cloudflare nameservers:
   - `luna.ns.cloudflare.com`
   - `max.ns.cloudflare.com`

### Step 2: Configure DNS in Cloudflare Dashboard

1. Go to **Cloudflare Dashboard** → **DNS** → **Records**
2. Add records:

```
Type: A
Name: @
IPv4 address: 162.159.82.167
TTL: Auto
Proxy status: DNS only

Type: A
Name: @
IPv4 address: 162.159.83.167
TTL: Auto
Proxy status: DNS only

Type: CNAME
Name: www
Target: michaelmoran-eu.pages.dev
TTL: Auto
Proxy status: DNS only
```

### Step 3: Enable SSL/TLS

1. Go to **SSL/TLS** → **Overview**
2. Set to **Full (strict)**
3. Go to **Edge Certificates**
4. Enable **"Always Use HTTPS"**
5. Enable **"Automatic HTTPS Rewrites"**

### Step 4: Page Rules for HTTP→HTTPS Redirect

Add a Page Rule:
```
URL Pattern: http://michaelmoran.eu/*
Setting: Forwarding URL - 301 - https://michaelmoran.eu/$1
```

### DNS Propagation Timeline

| Step | DNS TTL | Expected Time |
|------|---------|---------------|
| Nameserver change | Registrar varies | 0-24 hours |
| A/CNAME records | Auto | 5-30 minutes |
| SSL certificate | N/A | 24-48 hours after first request |

---

## Troubleshooting

### Issue: "Certificate Not Valid"
- Wait up to 48 hours after DNS setup
- Check that both `michaelmoran.eu` and `www.michaelmoran.eu` resolve correctly
- Ensure no conflicting records exist

### Issue: DNS propagation delay
- Use `dig michaelmoran.eu ANY` to verify records
- Check Cloudflare's DNS debugger tool

### Issue: Mixed content warnings
- Ensure all resources use relative paths (`/path` not `http://domain/path`)
- All CSS/JS/images loaded from same origin

---

## Verification Checklist

- [x] `michaelmoran-eu.pages.dev` deployment created via wrangler
- [x] GitHub secrets configured: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- [x] Custom domain `michaelmoran.eu` added to Cloudflare Pages (status: **pending**)
- [ ] Configure Njalla DNS records for CNAME/ALIAS
- [ ] Verify HTTPS certificate in Cloudflare Pages dashboard

---

## Security Considerations

1. **DNS Records**: Only allow A/CNAME records pointing to Cloudflare Pages
2. **TTL**: Keep TTL at Auto for faster recovery from errors
3. **Zone Transfer**: Ensure zone transfer is disabled at registrar
4. **DNSSEC**: Enable DNSSEC in Cloudflare after migration