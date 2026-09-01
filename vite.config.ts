import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function fileStoragePlugin(): Plugin {
  const rootDir = process.cwd();
  const dataDir = path.resolve(rootDir, 'data');
  const filePath = path.join(dataDir, 'bank_of_dad_state.json');

  const handler = (req: any, res: any, next: any) => {
    if (req.url === '/api/state' || req.url?.startsWith('/api/state?') || req.url?.startsWith('/api/state/')) {
      if (req.method === 'GET') {
        try {
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.end(content);
            return;
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ profiles: [], activeProfileId: '', lastUpdated: new Date().toISOString() }));
            return;
          }
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
          return;
        }
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, savedAt: new Date().toISOString() }));
          } catch (err: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
    }
    next();
  };

  return {
    name: 'vite-plugin-filesystem-storage',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    fileStoragePlugin(),
  ],
});
