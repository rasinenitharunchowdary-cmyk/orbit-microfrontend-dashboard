# Architecture & module communication

## Composition strategy

The shell is the runtime composition root. It owns URL routing, page chrome and route protection, but it does **not** own feature-domain UI. Feature teams expose one route-level `App` component through Module Federation.

### Independence

Every remote has its own `package.json`, Vite server, build output and `remoteEntry.js`. A team can build or deploy its remote without rebuilding another feature. The shell only needs the remote contract to remain compatible.

### Shared dependencies

React, React DOM, React Router, Zustand, `@mfe/ui`, and `@mfe/platform` are declared as federation singletons. This prevents multiple React trees/store instances and protects hooks/context behavior.

## Communication patterns

### 1. Shared platform state — only for global invariants

Authentication is a global invariant, so all modules read/write one shared Zustand store. The shell gates protected routes from that store; the API client also reads the token from the same store.

### 2. Event-based domain communication

Features publish browser events rather than directly importing each other:

- `mfe:toast`
- `mfe:user-updated`
- `mfe:notifications-changed`

The typed event contract lives in `@mfe/platform`. This allows a User Management deployment to remain unaware of Shell implementation details.

### 3. API as source of truth

Feature data comes from REST endpoints, not from cross-feature component state. That prevents hidden coupling and makes remote refresh/recovery straightforward.

## Failure isolation

Each federated route is wrapped by a React Error Boundary and Suspense. A network failure loading Analytics can show a module-level fallback while navigation and other remotes remain functional.

## Security notes

The included API is intentionally local/demo-grade but the frontend design follows production boundaries. A production implementation should use OIDC/OAuth2 PKCE or BFF cookies, short-lived credentials, backend authorization, CSP, strict CORS, dependency scanning, secret management and observability.

## Scaling to multiple repositories

This monorepo simplifies review for the assignment. To split ownership later:

1. Move each `apps/<remote>` to its own repository.
2. Publish `@mfe/platform` and `@mfe/ui` to an internal registry with semantic versions.
3. Deploy each remote independently.
4. Update shell remote URLs through environment/config management.
5. Add contract tests checking exposed module names and shared package compatibility.
