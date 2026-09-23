import { useEffect, useState } from 'react';
import { apiFetch, type Metric } from '@mfe/platform';
import { Card, ErrorState, PageHeader, Skeleton, StatCard } from '@mfe/ui';
import { TrendingUp, Target, Layers, Zap, User, Download, Shield } from 'lucide-react';

type Data = {
  metrics: Metric[];
  weekly: { label: string; value: number }[];
  activity: { id: string; icon: string; text: string; time: string }[];
};

export default function DashboardApp() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [days, setDays] = useState('30');

  const load = (daysParam: string) => {
    setError('');
    setData(null);
    apiFetch<Data>(`/api/dashboard?days=${daysParam}`)
      .then(setData)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load(days);
  }, [days]);

  if (error) {
    return (
      <div className="page">
        <PageHeader eyebrow="Overview" title="Dashboard" />
        <ErrorState message={error} onRetry={() => load(days)} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <PageHeader eyebrow="Overview" title="Dashboard" />
        <div className="metric-grid">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton height={120} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const max = Math.max(...data.weekly.map((x) => x.value));
  const statIcons = [<TrendingUp size={18}/>, <Target size={18}/>, <Layers size={18}/>, <Zap size={18}/>];

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return <User size={16} />;
      case 'Download': return <Download size={16} />;
      case 'Shield': return <Shield size={16} />;
      case 'Zap': return <Zap size={16} />;
      default: return <Target size={16} />;
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Live operational snapshot assembled from the dashboard remote."
        actions={
          <div style={{ display: 'flex', gap: 12 }}>
            <select 
              className="select" 
              style={{ width: 150 }} 
              value={days}
              onChange={(e) => setDays(e.target.value)}
            >
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
            </select>
            <button className="btn btn-secondary" onClick={() => load(days)}>
              <Zap size={16} style={{ marginRight: 6 }} /> Refresh
            </button>
          </div>
        }
      />

      <div className="metric-grid">
        {data.metrics.map((m, i) => (
          <StatCard key={m.label} {...m} icon={statIcons[i]} />
        ))}
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="section-title">
            <div>
              <h2>Weekly activity</h2>
              <p>Requests processed across the platform</p>
            </div>
            <span className="badge badge-success">Live</span>
          </div>
          <div className="bars">
            {data.weekly.map((x) => (
              <div className="bar-col" key={x.label}>
                <div
                  className="bar"
                  style={{
                    height: `${Math.max(10, (x.value / max) * 190)}px`,
                  }}
                />
                {x.label}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h2>Recent activity</h2>
              <p>Cross-module events</p>
            </div>
          </div>
          <div className="activity">
            {data.activity.map((a) => (
              <div className="activity-row" key={a.id}>
                <span className="activity-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getActivityIcon(a.icon)}
                </span>
                <div>
                  <p>{a.text}</p>
                  <small>{a.time}</small>
                </div>
                <span style={{ opacity: 0.5 }}>›</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
