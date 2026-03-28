/**
 * After `vite build`, merges react-helmet-async output into HTML.
 * - `/` -> dist/index.html (head only; shared SPA shell keeps empty #root to avoid hydration mismatches).
 * - `/identity`, `/hire` -> dist/<route>/index.html (full SSR markup for crawlers).
 *
 * Uses eager imports (not React.lazy) because renderToString doesn't support Suspense.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider, type FilledContext } from 'react-helmet-async';
import { VisualSkinProvider } from '../hooks/useVisualSkin';
import { EditorialLayout } from '../components/layout/EditorialLayout';
import { Projects } from '../pages/Projects';
import { Hire } from '../pages/Hire';
import { Identity } from '../pages/Identity';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const templatePath = join(distDir, 'index.html');

function mergeHead(html: string, helmet: FilledContext['helmet']): string {
  let out = html.replace(/<title>[\s\S]*?<\/title>\s*/i, '');
  out = out.replace(/<meta\s+name="description"[^>]*>\s*/i, '');
  const inject = [
    helmet.title.toString(),
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join('\n');
  return out.replace('</head>', `${inject}\n</head>`);
}

function renderRoute(location: string) {
  const helmetContext = {};
  const layoutProps = { notifications: [], addNotification: () => {}, synth: null };
  const app = renderToString(
    <HelmetProvider context={helmetContext}>
      <VisualSkinProvider>
        <StaticRouter location={location}>
          <Routes>
            <Route path="/" element={<EditorialLayout {...layoutProps} />}>
              <Route index element={<Projects />} />
              <Route path="hire" element={<Hire />} />
              <Route path="identity" element={<Identity />} />
            </Route>
          </Routes>
        </StaticRouter>
      </VisualSkinProvider>
    </HelmetProvider>,
  );
  const { helmet } = helmetContext as FilledContext;
  return { app, helmet };
}

function writeNestedRoute(subdir: string, html: string) {
  const dir = join(distDir, subdir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
}

const viteTemplate = readFileSync(templatePath, 'utf8');

// Home: SEO head on the shared SPA entry only.
{
  const { helmet } = renderRoute('/');
  const html = mergeHead(viteTemplate, helmet);
  writeFileSync(templatePath, html, 'utf8');
}

for (const route of ['/identity', '/hire'] as const) {
  const { app, helmet } = renderRoute(route);
  let html = mergeHead(viteTemplate, helmet);
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
  const sub = route.replace(/^\//, '');
  writeNestedRoute(sub, html);
}

console.log('prerender: updated dist/index.html (head), dist/identity/index.html, dist/hire/index.html');
