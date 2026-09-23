import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, useAuthStore, type SessionUser } from '@mfe/platform';
import { Button } from '@mfe/ui';

type LoginResponse = { token: string; user: SessionUser };

export default function AuthApp() {
  const nav = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('admin@orbit.dev');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSession(data.token, data.user);
      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* ── Left panel — branding art ── */}
      <section className="login-art">
        <div className="brand">
          <span className="brand-mark">O</span>
          <span>Orbit Control</span>
        </div>

        <div>
          <div className="eyebrow">Micro-frontend operations</div>
          <h1>
            One workspace.
            <br />
            Independently shipped teams.
          </h1>
          <p>
            A production-oriented control surface demonstrating federated React
            modules, shared contracts, protected routing and resilient
            API-driven states.
          </p>
        </div>

        <div className="login-proof">
          <div className="proof-card">
            <strong>6</strong>
            <small>independent apps</small>
          </div>
          <div className="proof-card">
            <strong>1</strong>
            <small>shared platform layer</small>
          </div>
          <div className="proof-card">
            <strong>100%</strong>
            <small>responsive</small>
          </div>
        </div>
      </section>

      {/* ── Right panel — login form ── */}
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <div className="eyebrow">Secure workspace</div>
          <h2>Welcome back</h2>
          <p>Sign in to access your organization dashboard.</p>

          <div className="form-grid">
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-text" role="alert">
              {error}
            </div>
          )}

          <Button disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in securely'}
          </Button>

          <div className="demo-hint">
            Demo credentials are pre-filled. Authentication still goes through
            the API and returns a bearer token.
          </div>
        </form>
      </section>
    </div>
  );
}
