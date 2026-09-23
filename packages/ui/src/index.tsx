import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Inbox, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/* ── Button ── */
export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  return <button className={`btn btn-${variant} ${className}`} {...props} />;
}

/* ── Card ── */
export function Card({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ── Badge ── */
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

/* ── Avatar ── */
export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar" aria-label={name}>
      {name
        .split(' ')
        .map((x) => x[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()}
    </span>
  );
}

/* ── Empty state ── */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon"><Inbox size={32} strokeWidth={1.5} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

/* ── Error state ── */
export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="empty error-panel">
      <div className="empty-icon"><AlertTriangle size={32} strokeWidth={1.5} /></div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}

/* ── Page header ── */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="header-actions">{actions}</div>}
    </header>
  );
}

/* ── Loading skeleton ── */
export function Skeleton({ height = 20 }: { height?: number }) {
  return <div className="skeleton" style={{ height }} />;
}

/* ── Full-page module skeleton ── */
export function ModuleSkeleton() {
  return (
    <div className="page">
      <Skeleton height={42} />
      <div className="metric-grid">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <Skeleton height={18} />
            <br />
            <Skeleton height={38} />
            <br />
            <Skeleton height={90} />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Stat card ── */
export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta: number;
  icon?: ReactNode;
}) {
  return (
    <Card className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small className={delta >= 0 ? 'positive' : 'negative'} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {delta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {Math.abs(delta)}% vs last period
      </small>
    </Card>
  );
}
