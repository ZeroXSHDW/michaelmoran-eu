# DNS Setup Guide for michaelmoran.eu

## Overview

This guide provides step-by-step instructions for configuring DNS records at Cloudflare to serve the portfolio website at `michaelmoran.eu`.

---

## Current Status (Nov 19, 2026)

| Step | Status | Notes |
|------|--------|-------|
| GitHub repo created | ✅ Complete | https://github.com/ZeroXSHDW/michaelmoran-eu |
| Secrets configured | ✅ Complete | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` set |
| Cloudflare Pages project | ✅ Complete | `michaelmoran-eu` project created |
| Custom domain added | ✅ Complete | `michaelmoran.eu` added |
| Nameservers changed | ✅ Complete | Now using Cloudflare (burt.ns.cloudflare.com, suzanne.ns.cloudflare.com) |
| Site working | ⚠️ Broken | SSL_ERROR_NO_CYPHER_OVERLAP - need DNS fix |

### Current Deployment

Site is live at: https://michaelmoran-eu.pages.dev

---

## 🔴 URGENT: FIX REQUIRED - Site Currently BROKEN

**Current Issue**: `SSL_ERROR_NO_CYPHER_OVERLAP`

The site `https://michaelmoran.eu` is currently **inaccessible** and showing security errors in browsers.

**Root Cause**: DNS records are **proxied** (orange cloud) but Cloudflare Pages hasn't issued an SSL certificate for the custom domain yet.

---

## 🚨 IMMEDIATE FIX (Choose One Option)

### Option A: Set DNS records to DNS Only (Gray Cloud) ⚡ FASTEST

**Recommended for immediate fix**

1. Log into Cloudflare Dashboard
2. Go to **michaelmoran.eu** → **DNS** → **Records**
3. For each record (A/AAAA), click the **proxy toggle** to turn it OFF (gray cloud icon)
   - This disables Cloudflare's reverse proxy
   - Routes traffic directly to Pages IPs (172.66.44.204, 172.66.47.52)
4. Wait 2-5 minutes
5. Verify: https://michaelmoran.eu should load

### Option B: Wait for SSL Certificate 🕐 SLOWER BUT MORE SECURE

**Keep records proxied, wait for certificate**

1. Keep DNS records as **proxied** (orange cloud)
2. Wait 2-24 hours for Google SSL certificate provisioning
3. Check Cloudflare Pages → Custom Domains for "Active" status
4. Verify status changes from "pending" to "Active"

---

## ✅ DNS Records for Cloudflare Pages

**Navigate to**: Cloudflare Dashboard → michaelmoran.eu → DNS → Records

### Configure Records (DNS Only - Gray Cloud)

**Delete existing records and add these:**

```
Type: A
Name: @
Content: 162.159.82.167
TTL: Auto
Proxy: DNS Only

Type: A
Name: @
Content: 162.159.83.167
TTL: Auto
Proxy: DNS Only
```

⚠️ **IMPORTANT**: Click the orange cloud icon next to each record to toggle it to gray (DNS Only)

### Optional: Add www Subdomain

```
Type: CNAME
Name: www
Content: michaelmoran-eu.pages.dev
TTL: Auto
Proxy: DNS Only
```

---

## 🔧 Step-by-Step Instructions

1. Go to: https://dash.cloudflare.com
2. Select your account
3. Click on **michaelmoran.eu** domain
4. Click **DNS** in the sidebar
5. **For existing records**: Click the orange cloud → turn OFF (gray cloud)
6. **Add if missing**:
   - Click "Add record"
   - Use settings above
7. Wait 2-5 minutes
8. Test: https://michaelmoran.eu should load

---

## ✅ Verification Checklist

After fixing DNS:

- [ ] `michaelmoran.eu` A records point to 162.159.82.167 and 162.159.83.167
- [ ] All records have **DNS Only** (gray cloud, not orange)
- [ ] Cloudflare Pages shows "Active" status for custom domain
- [ ] SSL certificate shows as "Valid" in Cloudflare Pages dashboard
- [ ] Site loads at https://michaelmoran.eu without errors
- [ ] Site loads at https://www.michaelmoran.eu without errors

---

## ⏱️ Timeline

| Step | Time Required |
|------|---------------|
| DNS record toggle (proxy OFF) | 1-2 minutes |
| DNS propagation (global) | 5-30 minutes |
| SSL certificate provisioning | 10-30 minutes (if keeping proxied) |

---

## 🔒 Security Notes

1. **DNS Only vs Proxied**: 
   - DNS Only = Direct to Pages, Cloudflare WAF still active
   - Proxied = Cloudflare reverse proxy, requires SSL certificate

2. **If keeping DNS Only**: Cloudflare WAF, rate limiting still apply

3. **If keeping proxied**: Wait for SSL certificate or use DNS Only

4. **TTL**: Keep at "Auto" for faster recovery from errors

---

## 🛠️ Troubleshooting

### Still getting SSL_ERROR_NO_CYPHER_OVERLAP?

1. **Verify proxy status**: Must be DNS Only (gray cloud)
2. **Verify IPs**: A records must point to:
   - 162.159.82.167
   - 162.159.83.167
3. **Wait 5 minutes** after changes
4. **Clear DNS cache**: `sudo dscacheutil -flushcache` (macOS) or equivalent

### Domain shows 409 Conflict

- Wait 10-15 minutes after DNS update
- Refresh Cloudflare Pages → Custom Domains page
- Check domain status changes from "pending" to "active"

### DNS not propagating

```bash
# Check DNS records globally
dig michaelmoran.eu A +short
# Should return: 162.159.82.167 and 162.159.83.167
```

### Mixed content warnings

- All resources use relative paths (`/path` not `http://domain/path`)
- All CSS/JS/images loaded from same origin

---

## 📊 Site Status Summary

```
GitHub:    https://github.com/ZeroXSHDW/michaelmoran-eu
Live:      https://michaelmoran-eu.pages.dev
Custom:    https://michaelmoran.eu (waiting for DNS fix)
Status:    ⚠️ Broken until DNS records are fixed
```

---

## 📝 Next Steps After DNS Fix

1. Wait 5-10 minutes
2. Check https://michaelmoran.eu loads correctly
3. Verify SSL certificate in browser (should be green)
4. Update TODO markers in `src/content.ts` (LinkedIn URL, certifications, testimonials)
5. Upload actual CV PDF to `public/cv/michael-moran-cv.pdf`
6. Run `npm run build` and push to GitHub to trigger new deployment

---

## 🆘 Need Help?

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **GitHub Issues**: https://github.com/ZeroXSHDW/michaelmoran-eu/issues
- **Pages Config**: wrangler.toml already configured with correct project name