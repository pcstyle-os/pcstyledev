# Portfolio

Welcome to my personal portfolio website! Explore my projects, skills, and experience.

## Live Site

Visit the live portfolio: [pcstyle.dev](https://pcstyle.dev)

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Hono (API)
- **Deployment**: Vercel
- **Design**: Responsive, Modern UI/UX

## Local API + GitHub (`/api/github/*`)

Stats, heatmaps, and the About page repo list call GitHub through the Hono API. **Production** needs `GITHUB_TOKEN` and `GITHUB_USERNAME` in the Vercel project settings (the Edge runtime cannot run shell tools).

### Why Stats show `Unexpected token '<' ... JSON` locally

`bun dev` (Vite) does **not** run the Hono API — `/api/*` would return `index.html`. **Vite proxies `/api` to `https://pcstyle.dev` by default** so local dev hits your deployed API. Override with `VITE_API_PROXY_TARGET` in `.env.local`, or set it to `false` and run **`vercel dev`** from this directory instead.

### GitHub CLI → env vars (optional)

Useful when running **`vercel dev`** so the local API has credentials:

```bash
# Append dotenv lines to .env.local (merge/edit if the file already exists)
bun run github:env >> .env.local
```

Or export into your current shell (e.g. before `vercel dev`):

```bash
eval "$(bun run github:env:export)"
```

See [`.env.example`](.env.example) for variable names.

