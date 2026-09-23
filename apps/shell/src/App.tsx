import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { onAppEvent, useAuthStore } from '@mfe/platform';
import { Avatar, Button, ModuleSkeleton } from '@mfe/ui';
import { LayoutDashboard, Users as UsersIcon, BarChart2, Bell, BookOpen, Menu, Search, LogOut } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

/* ── Federated remote imports (lazy-loaded) ── */
const Auth = lazy(() => import('auth/App'));
const Dashboard = lazy(() => import('dashboard/App'));
const Users = lazy(() => import('users/App'));
const Analytics = lazy(() => import('analytics/App'));
const Notifications = lazy(() => import('notifications/App'));
import Docs from './Docs';
import Profile from './Profile';

/* ── Navigation items ── */
const nav = [
  ['/dashboard', <LayoutDashboard size={18} />, 'Dashboard'],
  ['/users', <UsersIcon size={18} />, 'User Management'],
  ['/analytics', <BarChart2 size={18} />, 'Analytics'],
  ['/notifications', <Bell size={18} />, 'Notifications'],
] as const;

/* ── Protected route wrapper ── */
function Protected({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) return <ModuleSkeleton />;
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

/* ── Shell layout with sidebar, topbar and toast stack ── */
function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();
  const location = useLocation();

  const [menu, setMenu] = useState(false);
  const [unread, setUnread] = useState(3);
  const [toasts, setToasts] = useState<
    { id: number; title: string; message: string }[]
  >([]);

  /* Listen for cross-module events */
  useEffect(() => {
    const off1 = onAppEvent('mfe:toast', (d) => {
      const id = Date.now();
      setToasts((v) => [...v, { id, ...d }]);
      setTimeout(() => setToasts((v) => v.filter((x) => x.id !== id)), 3500);
    });
    const off2 = onAppEvent('mfe:notifications-changed', (d) =>
      setUnread(d.unread)
    );
    return () => {
      off1();
      off2();
    };
  }, []);

  /* Close sidebar on navigation */
  useEffect(() => setMenu(false), [location.pathname]);

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${menu ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">O</span>
          <span>Orbit Control</span>
        </div>

        <div className="nav-section-label">Workspace</div>
        <nav>
          {nav.map(([to, icon, label]) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              to={to}
              key={to}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-section-label">System</div>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          to="/docs"
        >
          <span className="nav-icon"><BookOpen size={18} /></span>
          <span>Developer docs</span>
        </NavLink>

        <div className="sidebar-footer">
          <div className="profile-mini">
            <Avatar name={user?.name || 'User'} />
            <div className="profile-copy">
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              clear();
              navigate('/login');
            }}
            style={{ color: 'var(--danger)', marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <LogOut size={16} /> Sign out
          </Button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main className="shell-main">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setMenu((v) => !v)}
          >
            <Menu size={20} />
          </button>

          <label className="search-box">
            <Search size={16} style={{ opacity: 0.5 }} />
            <input placeholder="Search workspace…" aria-label="Search workspace" />
          </label>

          <div className="top-actions">
            <button
              className="icon-btn"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unread > 0 && <sup style={{ color: 'var(--danger)' }}>{unread}</sup>}
            </button>
            <div 
              className="profile-mini"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              role="button"
              tabIndex={0}
            >
              <Avatar name={user?.name || 'User'} />
              <div className="profile-copy">
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>
              </div>
            </div>
          </div>
        </header>

        <ErrorBoundary>
          <Suspense fallback={<ModuleSkeleton />}>{children}</Suspense>
        </ErrorBoundary>
      </main>

      {/* ── Toast notifications ── */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <strong>{t.title}</strong>
            <p>{t.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Route wrapper for protected + layout ── */
function Remote({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <Layout>{children}</Layout>
    </Protected>
  );
}

/* ── Root application routes ── */
export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ErrorBoundary>
            <Suspense fallback={<ModuleSkeleton />}>
              {token ? <Navigate to="/dashboard" replace /> : <Auth />}
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Remote>
            <Dashboard />
          </Remote>
        }
      />
      <Route
        path="/users"
        element={
          <Remote>
            <Users />
          </Remote>
        }
      />
      <Route
        path="/analytics"
        element={
          <Remote>
            <Analytics />
          </Remote>
        }
      />
      <Route
        path="/notifications"
        element={
          <Remote>
            <Notifications />
          </Remote>
        }
      />
      <Route
        path="/docs"
        element={
          <Remote>
            <Docs />
          </Remote>
        }
      />
      <Route
        path="/profile"
        element={
          <Remote>
            <Profile />
          </Remote>
        }
      />
      <Route
        path="/"
        element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="*"
        element={
          <div className="not-found">
            <div>
              <strong>404</strong>
              <h1>Page not found</h1>
              <p style={{ color: 'var(--muted)' }}>
                The requested route does not exist in this shell.
              </p>
              <a
                className="btn btn-primary"
                href="/dashboard"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Back to dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
