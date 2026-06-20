# Chill Express — Website

A responsive, installable (PWA) website for Chill Express, built with plain HTML, CSS and JavaScript — no frameworks, no build step required to run it.

## Folder structure

```
/                       index.html, 404.html, offline.html, manifest.json, sw.js
/menu/index.html        Full menu with category filtering
/cart/index.html        Cart → sends order to WhatsApp
/location/index.html    Address, hours, contact, click-to-load map
/assets/css/styles.css  Single stylesheet (design tokens + components)
/assets/js/             data.js, cart-store.js, app.js, home.js, menu.js, cart-page.js
/assets/fonts/          Self-hosted Inter + Space Grotesk (.woff2) — no Google Fonts request
/assets/icons/          Favicon, PWA icons, maskable icons, icons.svg (UI icon sprite)
/assets/images/         logo.png/.webp, og-image.jpg (social share image)
.htaccess               Security headers + HTTPS redirect (Apache hosts: AwardSpace, InfinityFree)
_headers                Same security headers, Netlify format
robots.txt, sitemap.xml SEO
```

Pages use folder-style URLs (`/menu/`, `/cart/`, `/location/`) so they work cleanly on **any** static host with zero server configuration — no `.htaccess` rewrite rules required for routing.

Every internal link, stylesheet, script, icon, and font reference uses a **relative path**, not an absolute one starting with `/`. This matters more than it sounds: if you ever upload this into a subfolder (e.g. `yoursite.com/chill-express/` instead of the domain root — common on shared hosting with multiple projects), absolute `/assets/...` paths silently break because the browser looks for them at the real domain root, not inside your subfolder. Relative paths don't have that problem — they always resolve correctly no matter how deep the site is hosted. The three subpages (`menu/`, `cart/`, `location/`) each have a `<base href="../">` tag in the `<head>` to make this work consistently from one level down.

## Adding real food photos

See **`PHOTOS.md`** — five free CC0 photos from foodiesfeed.com, with direct links and the exact filenames to save them as. Drop them into `assets/images/menu/` and they show up automatically; nothing else needs to change.

## Before you go live — update these placeholders

The domain `https://www.chillexpress.ng` is a placeholder used for canonical links, Open Graph tags, JSON-LD, and the sitemap. Once you have a real domain, update it in:

- `index.html`, `menu/index.html`, `cart/index.html`, `location/index.html`, `404.html`, `offline.html` (canonical + OG/Twitter meta tags)
- `sitemap.xml`
- `robots.txt` (the `Sitemap:` line)

Business details (phone, WhatsApp number, address, hours, social links) all live in **one place** — `assets/js/data.js` (`CONFIG` object). Editing it there updates every page automatically, since every page reads from the same file.

## Deploying

**Netlify:** drag the whole folder into Netlify, or connect the repo. `_headers` is picked up automatically.

**InfinityFree / AwardSpace (or any cPanel host):** upload everything to your `htdocs`/`public_html` root via FTP. `.htaccess` is picked up automatically. If you ever see a 500 error after upload, open `.htaccess` and comment out the specific `<IfModule>` block your host doesn't support (some free hosts disable `mod_expires` or `mod_deflate`) — the rest will keep working.

## How the cart works

The cart has no backend — it's stored in the browser's `localStorage` (key `chillexpress_cart_v1`) and survives navigation between pages. "Send Order via WhatsApp" builds a pre-filled message and opens `wa.me` with it. There's no server, no database, and no payment processing involved.

## PWA

`manifest.json` + `sw.js` make the site installable on a phone's home screen with a custom icon, and cache the app shell so it still opens (with an offline page for new, uncached pages) without a connection. Bump `CACHE_VERSION` at the top of `sw.js` whenever you deploy changes to CSS/JS so returning visitors get the new files instead of a stale cache.

## Updating the logo / icons

If the logo ever changes, regenerate the icon set (favicon, apple-touch-icon, the four manifest icons, and the OG share image) from the new artwork — they were generated once from `logo-BI478T0H.jpeg` and are not derived automatically.

## What was tested before delivery

- Every `href`/`src`/`url()` in the HTML and CSS resolves to a real file (no 404s).
- Every icon reference resolves to a defined symbol in `icons.svg`.
- All JavaScript passes `node --check` (no syntax errors).
- `manifest.json`, `sitemap.xml`, and both JSON-LD blocks are valid.
- All 6 pages parse with no malformed HTML, no nested interactive elements, no duplicate IDs, and every image has alt text.
- Simulated user flows (add to cart, open item modal, filter menu by category, adjust quantities, clear cart, send WhatsApp order, open/close the mobile menu) were run end-to-end in a headless DOM and produce the correct state every time.
- Re-tested with the site simulated as hosted in a subfolder rather than a domain root, to confirm every CSS, JS, icon, font, and navigation link still resolves correctly.
- Text/background color combinations were checked against WCAG contrast minimums and adjusted where they fell short (the WhatsApp-green buttons in particular needed a slightly darker shade to keep white text readable).
