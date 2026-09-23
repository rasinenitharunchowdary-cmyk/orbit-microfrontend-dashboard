# Advanced Frontend Task — submission checklist

| Requirement | Implementation |
|---|---|
| React | React 19.3 across shell/remotes |
| Micro-Frontend architecture | Runtime composition with Module Federation |
| Authentication | `apps/auth` remote + API login + persisted shared auth store |
| Dashboard | `apps/dashboard` remote, API-backed KPIs/activity |
| User Management | `apps/users` remote, search/invite/remove flows |
| Analytics | `apps/analytics` remote, KPI/trend/acquisition visualizations |
| Notifications | `apps/notifications` remote, filters + mark-all-read |
| Shared auth/routing/navigation | Shell route guards/nav + singleton platform store |
| Common UI/design system | `packages/ui` |
| API integration | `api/` + `@mfe/platform/apiFetch` |
| Loading/error/empty states | Suspense skeletons, ErrorBoundary, ErrorState, EmptyState |
| State management | Zustand shared authentication + component-local domain state |
| Responsive | desktop/tablet/mobile CSS breakpoints |
| Clean scalable structure | workspace monorepo, shared packages, domain remotes |
| Module communication | typed CustomEvent bus + shared auth state |
| Lazy loading | React.lazy for every federated route |
| Shared dependencies | federation singleton config |
| Protected routes | Shell `Protected` component |
| Performance | route-level code loading, shared runtimes, minification |
| Reusable utilities | shared API/store/events/UI packages |
| README + architecture | `README.md`, `ARCHITECTURE.md` |
| CI | `.github/workflows/ci.yml` |

## Reviewer flow

1. Sign in with the demo credentials.
2. Verify Dashboard loads from its remote.
3. Navigate between remote modules without page reloads.
4. Invite a user; observe the shell toast emitted by the User remote.
5. Visit Notifications and mark all as read; observe the shell unread count update.
6. Stop one remote server and confirm its error boundary does not take down the shell.
7. Resize to mobile width and verify responsive sidebar/layout behavior.
