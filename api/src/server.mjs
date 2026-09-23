import http from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.PORT || 4000);
const sessions = new Set();

let users = [
  { id: 'u1', name: 'Ava Rodriguez', email: 'ava@orbit.dev', role: 'Admin', status: 'Active' },
  { id: 'u2', name: 'Liam Chen', email: 'liam@orbit.dev', role: 'Manager', status: 'Active' },
  { id: 'u3', name: 'Noah Williams', email: 'noah@orbit.dev', role: 'Viewer', status: 'Invited' },
  { id: 'u4', name: 'Mia Patel', email: 'mia@orbit.dev', role: 'Viewer', status: 'Active' },
  { id: 'u5', name: 'Ethan Brooks', email: 'ethan@orbit.dev', role: 'Manager', status: 'Suspended' }
];

let notifications = [
  { id: 'n1', title: 'New sign-in detected', message: 'A new session was started from Chrome on macOS.', time: '8 min ago', unread: true, kind: 'security' },
  { id: 'n2', title: 'Workspace export completed', message: 'Your weekly analytics export is ready.', time: '26 min ago', unread: true, kind: 'system' },
  { id: 'n3', title: 'Mia Patel joined the workspace', message: 'The invitation was accepted successfully.', time: '1 hour ago', unread: true, kind: 'team' },
  { id: 'n4', title: 'Billing cycle completed', message: 'The September invoice has been generated.', time: 'Yesterday', unread: false, kind: 'billing' }
];

const dashboard = {
  metrics: [
    { label: 'Active users', value: '2,842', delta: 12.4, trend: [2, 4, 3, 7] },
    { label: 'Conversion rate', value: '8.74%', delta: 3.2, trend: [3, 5, 6, 8] },
    { label: 'API requests', value: '184.2K', delta: 18.9, trend: [3, 7, 5, 9] },
    { label: 'Error rate', value: '0.18%', delta: -23.1, trend: [8, 6, 4, 2] }
  ],
  weekly: [
    { label: 'Mon', value: 68 }, { label: 'Tue', value: 82 }, { label: 'Wed', value: 73 },
    { label: 'Thu', value: 96 }, { label: 'Fri', value: 91 }, { label: 'Sat', value: 57 }, { label: 'Sun', value: 76 }
  ],
  activity: [
    { id: 'a1', icon: 'User', text: 'Ava changed Liam’s role', time: '12 minutes ago' },
    { id: 'a2', icon: 'Download', text: 'Analytics export completed', time: '31 minutes ago' },
    { id: 'a3', icon: 'Shield', text: 'Security policy updated', time: '2 hours ago' },
    { id: 'a4', icon: 'Zap', text: 'API latency recovered', time: '4 hours ago' }
  ]
};

const analytics = {
  metrics: [
    { label: 'Total sessions', value: '94.8K', delta: 14.2, trend: [] },
    { label: 'New visitors', value: '61.3K', delta: 8.7, trend: [] },
    { label: 'Avg. session', value: '4m 18s', delta: 5.4, trend: [] },
    { label: 'Bounce rate', value: '31.2%', delta: -4.6, trend: [] }
  ],
  traffic: [
    { label: 'W1', value: 62 }, { label: 'W2', value: 71 }, { label: 'W3', value: 66 },
    { label: 'W4', value: 79 }, { label: 'W5', value: 85 }, { label: 'W6', value: 88 },
    { label: 'W7', value: 94 }, { label: 'W8', value: 91 }
  ],
  sources: [
    { name: 'Organic', value: 48 }, { name: 'Direct', value: 30 },
    { name: 'Referral', value: 13 }, { name: 'Social', value: 9 }
  ]
};

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

async function body(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString()); }
  catch { return {}; }
}

function authed(req) {
  const t = req.headers.authorization?.replace('Bearer ', '');
  return t && sessions.has(t);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, 'http://localhost');
  
  if (url.pathname === '/health') return send(res, 200, { status: 'ok', service: 'orbit-api' });
  
  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    const b = await body(req);
    if (b.email === 'admin@orbit.dev' && b.password === 'Admin123!') {
      const token = randomUUID();
      sessions.add(token);
      return send(res, 200, { token, user: { id: 'u1', name: 'Ava Rodriguez', email: b.email, role: 'Admin' } });
    }
    return send(res, 401, { message: 'Invalid email or password' });
  }
  
  if (url.pathname.startsWith('/api/') && !authed(req)) {
    return send(res, 401, { message: 'Your session has expired. Please sign in again.' });
  }
  
  if (url.pathname === '/api/dashboard' && req.method === 'GET') {
    const days = url.searchParams.get('days') || '30';
    let result = JSON.parse(JSON.stringify(dashboard));
    
    if (days === '7') {
      result.metrics[0].value = '1,120';
      result.metrics[1].value = '4.2%';
      result.metrics[2].value = '45.1K';
      result.metrics[3].value = '0.04%';
      result.weekly = [
        { label: 'Mon', value: 42 }, { label: 'Tue', value: 38 }, { label: 'Wed', value: 55 },
        { label: 'Thu', value: 61 }, { label: 'Fri', value: 70 }, { label: 'Sat', value: 20 },
        { label: 'Sun', value: 15 }
      ];
      result.activity = result.activity.slice(0, 2);
    }
    return send(res, 200, result);
  }
  
  if (url.pathname === '/api/analytics' && req.method === 'GET') {
    const days = url.searchParams.get('days') || '30';
    let result = JSON.parse(JSON.stringify(analytics));
    
    if (days === '7') {
      result.metrics[0].value = '23.4K';
      result.metrics[1].value = '15.1K';
      result.traffic = [
        { label: 'Mon', value: 42 }, { label: 'Tue', value: 51 }, { label: 'Wed', value: 46 },
        { label: 'Thu', value: 69 }, { label: 'Fri', value: 55 }, { label: 'Sat', value: 48 },
        { label: 'Sun', value: 52 }
      ];
      result.sources = [
        { name: 'Organic', value: 55 }, { name: 'Direct', value: 25 },
        { name: 'Referral', value: 12 }, { name: 'Social', value: 8 }
      ];
    }
    return send(res, 200, result);
  }
  
  if (url.pathname === '/api/users' && req.method === 'GET') return send(res, 200, users);
  
  if (url.pathname === '/api/users' && req.method === 'POST') {
    const b = await body(req);
    if (!b.name || !b.email) return send(res, 400, { message: 'Name and email are required' });
    const u = { id: randomUUID(), name: b.name, email: b.email, role: b.role || 'Viewer', status: 'Invited' };
    users = [u, ...users];
    notifications = [
      { id: randomUUID(), title: 'User invitation sent', message: `${u.name} was invited as ${u.role}.`, time: 'Just now', unread: true, kind: 'team' },
      ...notifications
    ];
    return send(res, 201, u);
  }
  
  if (url.pathname.startsWith('/api/users/') && req.method === 'DELETE') {
    const id = url.pathname.split('/').pop();
    users = users.filter(u => u.id !== id);
    return send(res, 200, { ok: true });
  }

  if (url.pathname.startsWith('/api/users/') && req.method === 'PUT') {
    const id = url.pathname.split('/').pop();
    const b = await body(req);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return send(res, 404, { message: 'User not found' });
    
    users[index] = { ...users[index], name: b.name || users[index].name, email: b.email || users[index].email, role: b.role || users[index].role };
    
    notifications = [
      { id: randomUUID(), title: 'User updated', message: `${users[index].name}'s details were updated.`, time: 'Just now', unread: true, kind: 'team' },
      ...notifications
    ];
    return send(res, 200, users[index]);
  }
  
  if (url.pathname === '/api/notifications' && req.method === 'GET') return send(res, 200, notifications);
  
  if (url.pathname === '/api/notifications/read-all' && req.method === 'POST') {
    notifications = notifications.map(n => ({ ...n, unread: false }));
    return send(res, 200, { ok: true });
  }
  
  return send(res, 404, { message: 'Route not found' });
});

server.listen(port, () => console.log(`Orbit API listening on http://localhost:${port}`));
