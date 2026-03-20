# SEO / GEO — after deploy

Do these outside the repo (or partly in repo) to reinforce entity signals and measure results.

## Google Search Console & Bing

1. Add property **https://pcstyle.dev** in [Google Search Console](https://search.google.com/search-console).
2. Submit **sitemap**: `https://pcstyle.dev/sitemap.xml`.
3. Repeat in [Bing Webmaster Tools](https://www.bing.com/webmasters) (feeds Copilot/Bing discovery).

## LinkedIn (same person, stronger branded queries)

- Set **Featured** or **Website** to **https://pcstyle.dev** (and optionally `/hire`).
- Headline should include **frontend designer** (or your preferred title) + **Adam Krupa**.
- This does not “lose” to your site — it adds **`sameAs`** consistency when you add your LinkedIn URL to [`lib/seo.ts`](../lib/seo.ts) as `PROFILE_LINKEDIN`.

## GitHub

- Profile README: full name, role, link to **pcstyle.dev** and **/hire**.
- Pin repositories that show UI craft.

## Optional: personal domain

If you own `adamkrupa.*`, point it with a **301 redirect** to `https://pcstyle.dev` or a minimal landing page with `rel="canonical"` to pcstyle.dev.

## Validate structured data

- [Rich Results Test](https://search.google.com/test/rich-results?url=https://pcstyle.dev/hire) (FAQ + Person on `/hire`).
- [Rich Results Test](https://search.google.com/test/rich-results?url=https://pcstyle.dev/identity) (Person on `/identity`).

## Backlinks (high leverage vs raw name-only rankings)

Aim for a few **quality** links: conference bios, employer/university pages, guest posts, or community profiles that link to **pcstyle.dev** or **/hire**.
