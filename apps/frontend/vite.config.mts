/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/frontend',

    server: {
      port: parseInt(env.VITE_FRONTEND_PORT, 10),
      host: env.VITE_FRONTEND_HOST,
    },

    preview: {
      port: parseInt(env.VITE_FRONTEND_PREVIEW_PORT, 10),
      host: env.VITE_FRONTEND_HOST,
    },

    plugins: [react(), nxViteTsPaths()],

    build: {
      outDir: '../../dist/apps/frontend',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/frontend',
        provider: 'v8',
      },
    },

    exclude: ['test-mocks'],
  };
});
