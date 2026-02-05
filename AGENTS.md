# Agent Guidelines

Personal portfolio website for pcstyle.dev. React + TypeScript + Vite with cyberpunk/matrix aesthetic.

## Commands

- **Dev**: `bun run dev` - Starts Vite dev server on port 3000
- **Build**: `bun run build` - Production build with Vite
- **Preview**: `bun run preview` - Preview production build locally
- **Projects CLI**: `bun run projects` - Run the projects CLI tool

*Note: No test runner configured. No lint/format commands defined in package.json.*

## Architecture

- **Frontend**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS with custom cyberpunk theme (magenta `#ff00ff` accent)
- **Routing**: React Router v7 (HashRouter)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Hono API in `/api/index.ts`
- **Package Manager**: Bun
- **Path Alias**: `@/*` maps to repository root

### Directory Structure

```
/
├── App.tsx              # Main app with routing and layout
├── pages/               # Route components (Projects, Terminal, Identity, Stats)
├── components/
│   ├── ui/             # Reusable UI components (cards, overlays, visualizations)
│   └── layout/         # Layout components (MatrixBackground)
├── lib/                # Types and shared utilities
├── utils/              # Utility functions (audio, etc.)
├── api/                # Hono API endpoints
├── data/               # Static data (projects JSON)
└── projects-cli/       # CLI tool for managing projects
```

## Code Style

### TypeScript

- Strict mode enabled
- Target: ES2022
- Module: ESNext with bundler resolution
- Use explicit return types on exported functions
- Prefer interfaces over type aliases for object shapes
- All types in `lib/types.ts` with descriptive names

### React Components

- Use named exports: `export const ComponentName`
- Prefer functional components with hooks
- Use `React.memo()` for performance optimization on list items
- Destructure props in function parameters
- Use `useCallback` for event handlers passed to children

### Imports

- React imports first
- Third-party libraries next (alphabetical)
- Local imports last (grouped by relative depth)
- Use `@/*` path alias for root-relative imports
- Example:

```typescript
import React, { useState, useCallback, memo } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';

import { GlitchText } from '@/components/ui/GlitchText';
import { Synth } from '@/utils/audio';
import type { Project } from '@/lib/types';
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.tsx`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Types/Interfaces**: PascalCase with descriptive names
- **Files**: PascalCase for components, camelCase for utilities

### Styling (Tailwind)

- Use Tailwind utility classes exclusively
- Custom colors: `bg-[#ff00ff]` for magenta accent
- Group related classes logically
- Use `className` template literals for conditional classes
- Common pattern: `className={`base ${condition ? 'active' : 'inactive'}`}`

### State Management

- Use React hooks (useState, useReducer) for local state
- Use React Context via `useOutletContext` for shared state
- No external state management library

### Error Handling

- Minimal explicit error handling in UI components
- API errors handled in Hono endpoints
- Optional chaining for potentially undefined values

### Git

- Husky pre-commit hooks configured
- Conventional commit messages preferred

## Workspace Dependencies

This project uses workspace packages from the monorepo:
- `@pcstyle/analytics`
- `@pcstyle/hooks`
- `@pcstyle/logger`
- `@pcstyle/og`
- `@pcstyle/seo`
- `@pcstyle/toast`

## Environment Variables

Required in `.env.local`:
- `GEMINI_API_KEY` - Used for AI features

## Key Patterns

- Audio feedback via `utils/audio.ts` with `Synth` class
- Custom cursor effects in `NeuralCursor`
- CRT overlay effect for retro aesthetic
- Matrix-style background animation
- Glitch text effects for cyberpunk feel
