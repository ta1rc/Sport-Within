# Sport Within — landing page

Static site with no build step: `index.html`, `styles.css`, `main.js` and `content.js`.

## Run locally
    python3 -m http.server 4173

## Update content
Edit `content.js`. It holds the episodes, questions, industry categories, vision stages, social links and contact settings.
- Set an episode's `status` to `"live"` and add `thumbnail`, `videoUrl` and `audioUrl`. The Conversations section then becomes a "Latest conversation" block with Watch and Listen links.
- Social links with an empty `url` show "Soon" instead of a link (no dead links).

## Design system
- **Colours:** Paper `#FAF7EF`, Ink `#15181A`, Pitch green `#0D3A2D`, Signal orange `#FF5A1F` (small orange text uses `#C2410C` for contrast), brand gold `#B39144` (logo dot).
- **Fonts:** Inter Tight for headlines and labels, Newsreader for editorial lines.
- **Photography:** 17 free Unsplash photos (Unsplash licence: free for commercial use). They're listed under `photos` in `content.js` and served from Unsplash's CDN at the right size for each screen, up to 3840px (4K). Change a photo by replacing its `id`. Photographers are credited in the footer.

## Before launch
1. Set `site.email` in `content.js` to the real branded address.
2. Optional: set `site.formEndpoint` (e.g. Formspree) so the form sends directly. If it's empty, the form opens the visitor's email app with the message filled in.
3. Add analytics (GA4/GTM or Plausible). CTA, episode, social and contact events already go to `dataLayer` / `plausible`.
4. Set `og:image` to an absolute URL once the domain is known.

## Deploy
Drag the folder onto Netlify, Vercel or Cloudflare Pages, or use GitHub Pages.
