import { defineConfig } from 'vite';

import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
