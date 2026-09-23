import { useEffect, useState } from 'react';
import { apiFetch, type AnalyticsData } from '@mfe/platform';
import { Card, ErrorState, PageHeader, Skeleton, StatCard } from '@mfe/ui';
import { Users, UserPlus, Clock, Activity } from 'lucide-react';

export default function AnalyticsApp() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const [days, setDays] = useState('30');

  const load = (daysParam: string) => {
    setData(null);
    apiFetch<AnalyticsData>(`/api/analytics?days=${daysParam}`)
      .then(setData)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load(days);
  }, [days]);

  if (error) {
    return (
      <div className="page">
        <PageHeader eyebrow="Insights" title="Analytics" />
        <ErrorState message={error} onRetry={() => load(days)} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <PageHeader eyebrow="Insights" title="Analytics" />
        <Card>
          <Skeleton height={360} />
        </Card>
      </div>
    );
  }

  const max = Math.max(...data.traffic.map((x) => x.value));
  const icons = [<Users size={18} />, <UserPlus size={18} />, <Clock size={18} />, <Activity size={18} />];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Audience health, acquisition mix and product engagement from the analytics remote."
        actions={
          <select 
            className="select" 
            style={{ width: 150 }} 
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="30">Last 30 days</option>
            <option value="7">Last 7 days</option>
          </select>
        }
      />

      <div className="metric-grid">
        {data.metrics.map((m, i) => (
          <StatCard key={m.label} {...m} icon={icons[i]} />
        ))}
      </div>

      <div className="analytics-layout">
        <Card>
          <div className="section-title">
            <div>
              <h2>Traffic trend</h2>
              <p>Sessions by reporting period</p>
            </div>
          </div>
          <div className="bars">
            {data.traffic.map((x) => (
              <div className="bar-col" key={x.label}>
                <div
                  className="bar"
                  style={{ height: `${(x.value / max) * 190}px` }}
                />
                {x.label}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h2>Acquisition</h2>
              <p>Traffic source mix</p>
            </div>
          </div>
          <div className="donut-wrap">
            <div className="donut" aria-label="Acquisition source donut chart" />
            <div className="legend">
              {data.sources.map((x) => (
                <div className="legend-row" key={x.name}>
                  <span>{x.name}</span>
                  <strong>{x.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
