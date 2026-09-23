# Publishing & Deployment

## 1. Publish to GitHub

From the project root:

```bash
git init
git add .
git commit -m "feat: production micro-frontend dashboard"
git branch -M main
```

If GitHub CLI is authenticated:

```bash
gh repo create orbit-microfrontend-dashboard --private --source=. --remote=origin --push
```

Or create an empty repository in GitHub and run:

```bash
git remote add origin https://github.com/<your-user>/orbit-microfrontend-dashboard.git
git push -u origin main
```

## 2. Deployment topology

Deploy these as independent projects/services:

| Service | Workspace | Port locally | Build command | Output |
|---|---|---:|---|---|
| Shell | `@mfe/shell` | 4173 | `npm run build -w @mfe/shell` | `apps/shell/dist` |
| Auth | `@mfe/auth` | 4174 | `npm run build -w @mfe/auth` | `apps/auth/dist` |
| Dashboard | `@mfe/dashboard` | 4175 | `npm run build -w @mfe/dashboard` | `apps/dashboard/dist` |
| Users | `@mfe/users` | 4176 | `npm run build -w @mfe/users` | `apps/users/dist` |
| Analytics | `@mfe/analytics` | 4177 | `npm run build -w @mfe/analytics` | `apps/analytics/dist` |
| Notifications | `@mfe/notifications` | 4178 | `npm run build -w @mfe/notifications` | `apps/notifications/dist` |
| API | `@mfe/api` | 4000 | none | `npm run start -w @mfe/api` |

## 3. Shell production variables

Set these in the shell hosting project after the remotes are deployed:

```env
VITE_API_URL=https://api.example.com
VITE_AUTH_REMOTE=https://auth-mfe.example.com/remoteEntry.js
VITE_DASHBOARD_REMOTE=https://dashboard-mfe.example.com/remoteEntry.js
VITE_USERS_REMOTE=https://users-mfe.example.com/remoteEntry.js
VITE_ANALYTICS_REMOTE=https://analytics-mfe.example.com/remoteEntry.js
VITE_NOTIFICATIONS_REMOTE=https://notifications-mfe.example.com/remoteEntry.js
```

Then redeploy only the shell. Each remote can subsequently be released independently as long as its exposed `./App` contract remains compatible.

## 4. Production hardening before public launch

The provided API is intentionally an assignment/demo service with in-memory storage. For a real production deployment, replace it with persistent storage and production identity (OIDC/OAuth2/BFF), restrict CORS, add CSP, secrets management, rate limiting, monitoring, logs, alerting, dependency scanning and end-to-end tests.
