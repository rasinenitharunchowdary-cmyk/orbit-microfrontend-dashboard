import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
export default defineConfig({
  base: '/',
  plugins: [react(), federation({
    name: 'dashboard', filename: 'remoteEntry.js', manifest: true,
    exposes: { './App': './src/DashboardApp.tsx' },
    shared: {
      react: { singleton: true, requiredVersion: '^19.3.0' },
      'react-dom': { singleton: true, requiredVersion: '^19.3.0' },
      'react-router-dom': { singleton: true },
      zustand: { singleton: true },
      '@mfe/platform': { singleton: true },
      '@mfe/ui': { singleton: true }
    }
  })],
  server: { port: 4175, cors: true, origin: 'http://localhost:4175' },
  preview: { port: 4175, cors: true },
  build: { target: 'chrome89', sourcemap: true }
});
