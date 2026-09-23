import { useEffect, useMemo, useState } from 'react';
import { apiFetch, emitAppEvent, type NotificationItem } from '@mfe/platform';
import { Button, Card, EmptyState, ErrorState, PageHeader, Skeleton } from '@mfe/ui';
import { Settings, Shield, Users, DollarSign, CheckCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const iconMap: Record<NotificationItem['kind'], ReactNode> = {
  system: <Settings size={20} />,
  security: <Shield size={20} />,
  team: <Users size={20} />,
  billing: <DollarSign size={20} />,
};

export default function NotificationsApp() {
  const [data, setData] = useState<NotificationItem[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = () => {
    apiFetch<NotificationItem[]>('/api/notifications')
      .then(setData)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const shown = useMemo(
    () => data?.filter((n) => filter === 'all' || n.unread) || [],
    [data, filter]
  );

  async function markAll() {
    await apiFetch('/api/notifications/read-all', { method: 'POST' });
    setData((v) => v?.map((n) => ({ ...n, unread: false })) || []);
    emitAppEvent('mfe:notifications-changed', { unread: 0 });
    emitAppEvent('mfe:toast', {
      title: 'Inbox cleared',
      message: 'All notifications marked as read.',
    });
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="System, security and team updates in one resilient federated module."
        actions={
          <Button variant="secondary" onClick={markAll} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCheck size={16} /> Mark all read
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <Card>
          <div className="toolbar">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'secondary'}
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
          </div>

          {data === null ? (
            <Skeleton height={360} />
          ) : shown.length === 0 ? (
            <EmptyState
              title="You're all caught up"
              description="No notifications match this filter."
            />
          ) : (
            <div className="notification-list">
              {shown.map((n) => (
                <article
                  className={`notification ${n.unread ? 'unread' : ''}`}
                  key={n.id}
                >
                  <div className="notification-icon">{iconMap[n.kind]}</div>
                  <div>
                    <h3>{n.title}</h3>
                    <p>{n.message}</p>
                  </div>
                  <time>{n.time}</time>
                </article>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
