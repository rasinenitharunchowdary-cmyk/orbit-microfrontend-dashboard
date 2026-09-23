import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
export default defineConfig({
  base: '/',
  plugins: [react(), federation({
    name: 'notifications', filename: 'remoteEntry.js', manifest: true,
    exposes: { './App': './src/NotificationsApp.tsx' },
    shared: {
      react: { singleton: true, requiredVersion: '^19.3.0' },
      'react-dom': { singleton: true, requiredVersion: '^19.3.0' },
      'react-router-dom': { singleton: true },
      zustand: { singleton: true },
      '@mfe/platform': { singleton: true },
      '@mfe/ui': { singleton: true }
    }
  })],
  server: { port: 4178, cors: true, origin: 'http://localhost:4178' },
  preview: { port: 4178, cors: true },
  build: { target: 'chrome89', sourcemap: true }
});
