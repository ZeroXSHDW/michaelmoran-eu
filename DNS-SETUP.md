# DNS Setup Guide for michaelmoran.eu

## Overview

This document provides step-by-step instructions for configuring DNS records at Cloudflare to serve the website at `michaelmoran.eu`.

---

## Current Status (as of Nov 19, 2026)

**Deployment Progress**: ⚠️ IN PROGRESS

| Step | Status | Notes |
|------|--------|-------|
| GitHub repo created | ✅ Complete | https://github.com/ZeroXSHDW/michaelmoran-eu |
| Secrets configured | ✅ Complete | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` set |
| Cloudflare Pages project | ✅ Complete | `michaelmoran-eu` project created |
| Custom domain added | ✅ Complete | `michaelmoran.eu` added (pending DNS) |
| Nameservers changed | ✅ Complete | Changed to Cloudflare (burt.ns.cloudflare.com, suzanne.ns.cloudflare.com) |
| DNS records need update | ⏳ PENDING | Cloudflare DNS records need to point to Pages |

### Current Deployment

Site is live at: https://michaelmoran-eu.pages.dev

---

## CRITICAL: Update DNS Records NOW

Since nameservers are now using Cloudflare, you must update the DNS records in the **Cloudflare Dashboard**:

**Log in to Cloudflare Dashboard** → **michaelmoran.eu** → **DNS** → **Records**

### Option 1: A Records for Pages (Recommended if apex needed)

Delete existing A record(s) and add these two new A records:

```
Type: A
Name: @
Content: 162.159.82.167
TTL: Auto
Proxy status: DNS Only

Type: A
Name: @
Content: 162.159.83.167
TTL: Auto
Proxy status: DNS Only
```

### Option 2: CNAME for www + A record for apex

For best compatibility:

1. **Add/update A record for apex:**
   ```
   Type: A
   Name: @
   Content: 162.159.82.167
   TTL: Auto
   Proxy status: DNS Only
   ```

2. **Add CNAME for www:**
   ```
   Type: CNAME
   Name: www
   Content: michaelmoran-eu.pages.dev
   TTL: Auto
   Proxy status: DNS Only
   ```

### Option 3: Only www with CNAME (Simplest)

If you don't need apex support, just add:

```
Type: CNAME
Name: www
Content: michaelmoran-eu.pages.dev
TTL: Auto
Proxy status: DNS Only
```

---

## Step-by-Step for Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Select your account
3. Click on **michaelmoran.eu** domain
4. Click **DNS** in the sidebar
5. **Delete** any existing `michaelmoran.eu` A records
6. **Add** new records as specified above
7. Wait 2-5 minutes for DNS to update

---

## Verification Checklist

After updating DNS records:

- [ ] `michaelmoran.eu` A records point to 162.159.82.167 and 162.159.83.167
- [ ] OR `www.michaelmoran.eu` CNAME points to `michaelmoran-eu.pages.dev`
- [ ] Cloudflare Pages shows "Active" status for custom domain
- [ ] SSL certificate shows as "Valid" in Cloudflare Pages dashboard
- [ ] Site loads at https://michaelmoran.eu without errors

---

## Timeline

| Step | Time Required |
|------|---------------|
| DNS record update in Cloudflare | 2-5 minutes |
| DNS propagation (global) | 5-30 minutes |
| SSL certificate provisioning | 10-30 minutes |

---

## Security Considerations

1. **Proxy Status**: Keep as "DNS Only" to avoid Cloudflare's universal SSL conflicts with Pages
2. **TTL**: Keep at "Auto" for faster recovery from errors
3. **SSl**: Cloudflare Pages will automatically provision Google SSL certificates

---

## Troubleshooting

### Domain still shows 409 Conflict
- Wait 10-15 minutes after DNS update
- Refresh Cloudflare Pages → Custom Domains page

### SSL certificate not provisioning
- Ensure DNS has propagated: `dig michaelmoran.eu A`
- Check Cloudflare dashboard for certificate status
- May take up to 48 hours in some cases

### Mixed content warnings
- All resources use relative paths (`/path` not `http://domain/path`)
- All CSS/JS/images loaded from same origin

---

## Site Status Summary

```
GitHub:    https://github.com/ZeroXSHDW/michaelmoran-eu
Live:      https://michaelmoran-eu.pages.dev
Custom:    https://michaelmoran.eu (pending DNS update)
```

---

## Next Steps After DNS Update

1. Wait 5-10 minutes
2. Check https://michaelmoran.eu loads correctly
3. Verify SSL certificate in browser
4. Update TODO markers in `src/content.ts` (LinkedIn URL, certifications, testimonials)
5. Upload actual CV PDF to `public/cv/michael-moran-cv.pdf`