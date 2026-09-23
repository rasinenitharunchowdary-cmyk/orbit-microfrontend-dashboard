# Orbit Micro-Frontend Dashboard

This is an advanced micro-frontend architecture built with React 19.3 and Module Federation. It demonstrates a resilient, distributed frontend system where independent product teams can deploy their features separately while appearing as a single cohesive application to the user.

## Architecture Highlights

- **Module Federation:** Uses `@module-federation/vite` for runtime composition.
- **Shared Singleton:** Core dependencies (React, React Router, Zustand) and platform packages are shared to prevent duplicate runtimes and broken contexts.
- **Resilience:** Each federated route is wrapped in an `ErrorBoundary` and `Suspense`. If the Analytics module crashes or fails to load, the rest of the application remains fully functional.
- **Event-Driven Communication:** Modules communicate via loosely-coupled custom browser events (`mfe:toast`, `mfe:user-updated`) instead of tightly-coupled props.
- **Centralized State:** Authentication is managed centrally via Zustand in `@mfe/platform`, enforcing global invariants while allowing domain-specific state to remain local.

## Modules

The monorepo is structured into a host shell, remote feature modules, and shared packages:

- **`apps/shell`** (Port 4173): The host application. Manages layout, routing, error boundaries, and cross-module toast notifications.
- **`apps/auth`** (Port 4174): Remote. Handles the login flow.
- **`apps/dashboard`** (Port 4175): Remote. Displays system-wide metrics and activity feeds.
- **`apps/users`** (Port 4176): Remote. Full CRUD interface for team management.
- **`apps/analytics`** (Port 4177): Remote. Traffic and acquisition visualization.
- **`apps/notifications`** (Port 4178): Remote. System alerts and inbox management.
- **`packages/platform`**: Shared logic (Zustand auth store, typed event bus, API fetcher).
- **`packages/ui`**: Shared design system components and CSS variables.
- **`api`** (Port 4000): Local mock API server.

## Getting Started

Requires Node.js >= 20.19.0.

```bash
npm install
npm run dev
```

Open `http://localhost:4173/` in your browser.
Demo credentials are pre-filled (`admin@orbit.dev` / `Admin123!`).

## Troubleshooting

### "Module unavailable" Error / Blank Screens
If a module fails to load and shows the fallback error state, check the browser console.
- **React 19 StrictMode Issue:** In development, React 19 runs effects twice. If a `useEffect` callback implicitly returns a Promise (e.g., `useEffect(() => apiFetch(...), [])`), React will try to execute the Promise as a cleanup function and crash. Ensure all effect callbacks return `void` or a cleanup function. Example fix: `useEffect(() => { load() }, [])`.

### Module Federation DTS Errors
Warnings like `[ Module Federation DTS ] Failed to download types archive` in the terminal during development are related to type synchronization timing and are **non-fatal**. The application will still function correctly.

### Port Conflicts
If you encounter EADDRINUSE errors, ensure ports 4173-4178 and 4000 are available. You can kill hanging processes on macOS using:
```bash
lsof -ti:4173-4178,4000 | xargs kill -9
```

## Production Build

To test the production build locally:

```bash
npm run build
npm run preview
```
