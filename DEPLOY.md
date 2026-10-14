# Deploying Sport Within

The site is static: plain HTML, CSS and JavaScript with no server, database or build step. That makes it fast, cheap and hard to attack, because there is no backend to break into or overload.

## 1. Before launch (required)

Run this once you know the domain and the real contact address:

```bash
scripts/configure.sh https://www.yourdomain.com hello@yourdomain.com
```

It replaces the `https://SITE_DOMAIN` placeholder (canonical URL, social-share image, sitemap, robots.txt, security.txt, structured data) and the placeholder email (contact form, privacy notice, security.txt) everywhere.

Then:

- [ ] **Contact form:** create a free form at [formspree.io](https://formspree.io) and paste its URL into `site.formEndpoint` in `content.js`. Without it, the form opens the visitor's email app instead.
- [ ] **Privacy notice:** read `privacy.html` and confirm it matches how you'll actually handle enquiries.
- [ ] **YouTube:** add the channel URL in `content.js` → `links` when it exists (until then it shows "Soon").
- [ ] **Versions:** bump `?v=` on the three CSS/JS links in `index.html` whenever those files change.

## 2. Hosting

**Recommended: Cloudflare Pages or Netlify.** Both are free at this scale, serve from a global CDN, provide HTTPS automatically, absorb traffic spikes and DDoS attacks, and read the `_headers` file in this repo.

### Cloudflare Pages
1. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → pick `Sport-Within`.
2. Framework preset: **None**. Build command: *(leave empty)*. Output directory: **`/`**.
3. Deploy, then **Custom domains** → add your domain. HTTPS is set up automatically.

### Netlify
1. app.netlify.com → Add new site → Import from Git → pick `Sport-Within`.
2. Build command: *(empty)*. Publish directory: **`.`**
3. Domain management → add your domain; HTTPS is automatic.

### Vercel
Import the repo with framework **Other**, no build command, output directory `.`. Vercel reads `vercel.json` (same headers as `_headers`).

### GitHub Pages
Works (Settings → Pages → branch, root), but GitHub Pages **can't send custom headers**, so you lose HSTS, clickjacking protection and the full security policy. The page carries a fallback policy in a `<meta>` tag, but prefer one of the hosts above. On a `github.io/Sport-Within/` sub-path the 404 page's links won't resolve; use a custom domain.

## 3. What's built in

### Security
| Protection | How |
|---|---|
| Content Security Policy | Only this site, Google Fonts, Unsplash images and Formspree may load or receive data. Blocks injected scripts. |
| HTTPS only | `Strict-Transport-Security` plus `upgrade-insecure-requests` |
| Clickjacking | `X-Frame-Options: DENY` and `frame-ancestors 'none'` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Referrer leakage | `Referrer-Policy: strict-origin-when-cross-origin` |
| Browser features | `Permissions-Policy` turns off camera, microphone, location, payments and USB |
| Window isolation | `Cross-Origin-Opener-Policy: same-origin` |
| Safe rendering | No `innerHTML`, `eval` or inline scripts. Content is inserted as text, so it can't run as code. |
| Form spam | Hidden honeypot field, a minimum fill time, length limits, no double submits, and a 15-second timeout |
| Vulnerability reports | `/.well-known/security.txt` tells researchers how to reach you |

**Adding a third-party service?** Add its domain to the policy in `_headers`, `vercel.json` and the `<meta>` tag in `index.html`, or the browser will block it. For example, Plausible analytics needs `https://plausible.io` in `script-src` and `connect-src`.

### Performance and traffic
- Served from a CDN edge close to each visitor; there's no origin server to overload.
- Page weight is small: about 90 KB of HTML/CSS/JS before compression, a 16 KB logo and 15–25 KB founder photos (WebP with JPEG fallback).
- Photos come from Unsplash's CDN at the right size for each screen, and below-the-fold images load lazily.
- Caching: HTML is always revalidated, CSS/JS are cached for a day, and images for 30 days.
- Animations respect `prefers-reduced-motion`, and the orbit only redraws while the page is scrolling.

### SEO and sharing
Title, description, canonical URL, Open Graph and Twitter cards with a 1200×630 image, Organization structured data (with both co-founders and social profiles), `sitemap.xml`, `robots.txt`, a web manifest and app icons.

### Privacy and compliance (UK)
No cookies and no trackers, so no cookie banner is needed. `privacy.html` covers UK GDPR basics. If you add Google Analytics later, you will need a consent banner; cookieless analytics like Plausible avoid that.

## 4. After launch

- [ ] **Google Search Console** and **Bing Webmaster Tools:** verify the domain and submit `sitemap.xml`.
- [ ] **Uptime monitoring:** free check every 5 minutes with UptimeRobot or Better Stack.
- [ ] **Check the headers:** run the domain through [securityheaders.com](https://securityheaders.com) (aim for A) and [PageSpeed Insights](https://pagespeed.web.dev).
- [ ] **Test sharing:** paste the URL into a LinkedIn post draft to check the preview card.
- [ ] **Renew security.txt:** its `Expires` date is October 2027.
