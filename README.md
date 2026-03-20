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

**Locally**, you can fill both from the [GitHub CLI](https://cli.github.com/) after `gh auth login`:

```bash
# Append dotenv lines to .env.local (merge/edit if the file already exists)
bun run github:env >> .env.local
```

Or export into your current shell (e.g. before `vercel dev`):

```bash
eval "$(bun run github:env:export)"
```

See [`.env.example`](.env.example) for variable names.

