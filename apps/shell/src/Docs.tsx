import { Card, PageHeader, Badge } from '@mfe/ui';

export default function Docs() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="System"
        title="Developer Documentation"
        description="Architecture, module boundaries, and communication patterns for the Orbit Micro-Frontend ecosystem."
      />

      <div className="analytics-layout" style={{ gridTemplateColumns: '1fr' }}>
        <Card>
          <div className="section-title">
            <div>
              <h2>Composition Strategy</h2>
              <p>Runtime module federation and routing</p>
            </div>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
            <p>
              The shell is the runtime composition root. It owns URL routing, page
              chrome and route protection, but it does <strong>not</strong> own
              feature-domain UI. Feature teams expose one route-level{' '}
              <code>App</code> component through Module Federation.
            </p>
            <br />
            <h3 style={{ color: 'white', marginTop: 12, marginBottom: 8 }}>Independence</h3>
            <p>
              Every remote has its own <code>package.json</code>, Vite server, build
              output and <code>remoteEntry.js</code>. A team can build or deploy its
              remote without rebuilding another feature. The shell only needs the
              remote contract to remain compatible.
            </p>
            <br />
            <h3 style={{ color: 'white', marginTop: 12, marginBottom: 8 }}>Shared Dependencies</h3>
            <p>
              React, React DOM, React Router, Zustand, <code>@mfe/ui</code>, and{' '}
              <code>@mfe/platform</code> are declared as federation singletons. This
              prevents multiple React trees/store instances and protects hooks/context
              behavior.
            </p>
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h2>Communication Patterns</h2>
              <p>How modules interact without tight coupling</p>
            </div>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
            <h3 style={{ color: 'white', marginTop: 12, marginBottom: 8 }}>
              1. Shared Platform State
            </h3>
            <p>
              Authentication is a global invariant, so all modules read/write one
              shared Zustand store. The shell gates protected routes from that
              store; the API client also reads the token from the same store.
            </p>
            <br />
            <h3 style={{ color: 'white', marginTop: 12, marginBottom: 8 }}>
              2. Event-Based Domain Communication
            </h3>
            <p>
              Features publish browser events rather than directly importing each
              other:
            </p>
            <ul style={{ paddingLeft: 20, margin: '8px 0', listStyleType: 'none' }}>
              <li style={{ marginBottom: 6 }}>
                <Badge tone="info">mfe:toast</Badge>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Badge tone="success">mfe:user-updated</Badge>
              </li>
              <li style={{ marginBottom: 6 }}>
                <Badge tone="warning">mfe:notifications-changed</Badge>
              </li>
            </ul>
            <p>
              The typed event contract lives in <code>@mfe/platform</code>. This
              allows a User Management deployment to remain unaware of Shell
              implementation details.
            </p>
            <br />
            <h3 style={{ color: 'white', marginTop: 12, marginBottom: 8 }}>
              3. API as Source of Truth
            </h3>
            <p>
              Feature data comes from REST endpoints, not from cross-feature
              component state. That prevents hidden coupling and makes remote
              refresh/recovery straightforward.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
