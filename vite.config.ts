import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local `vite` / `vite preview` only serve static files — `/api/*` is not the Hono app (that only exists on Vercel
 * rewrites or `vercel dev`). Without a proxy, `fetch('/api/...')` gets `index.html` → "Unexpected token '<' ... JSON".
 */
function apiProxy(env: Record<string, string>) {
  const raw = env.VITE_API_PROXY_TARGET?.trim();
  if (raw === 'false' || raw === '0' || raw === 'off') return undefined;
  const target = (raw || 'https://pcstyle.dev').replace(/\/$/, '');
  return {
    '/api': {
      target,
      changeOrigin: true,
    },
  } as const;
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const proxy = apiProxy(env);
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        ...(proxy ? { proxy } : {}),
      },
      preview: {
        ...(proxy ? { proxy } : {}),
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
