# KAVOKA · The Art of Cacao & Coffee

Brand website and link-in-bio page for **KAVOKA**, a coffee-infused chocolate made from Indonesian cacao and Indonesian coffee. It was built for the UPH Medan *Digital Marketing & Social Media* class, **60-Minute Brand Launch Challenge**.

| Page | Path | What it covers |
| --- | --- | --- |
| Website | `/` | Round 1 product & USP · Round 2 brand identity · collection & pricing · packaging · how it's made · Round 3 30-second Reel storyboard (playable) · Round 4 customer journey, channels & launch promo · Measure funnel · market data · Round 5 60-second pitch script, timer & 20-slide deck |
| Link in bio | `/links` (also `/linktree`, `/bio`) | Link-in-bio page with TikTok Shop, Shopee, WhatsApp, gifting, reel, website and socials |

## Edit your links
All shop and social URLs live in **`public/assets/links.js`**. Replace the placeholder URLs with your real TikTok Shop, Shopee, Instagram, TikTok, WhatsApp number and email, then commit. Vercel redeploys automatically.

## Stack
Static HTML, CSS and JS with no build step, hosted on Vercel (`vercel.json` serves `public/`). Turn on Vercel Web Analytics in the project dashboard to count button clicks (`data-track` events) for the conversion funnel.

## Run locally
```bash
npx serve public
```
