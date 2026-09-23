import { useEffect, useMemo, useState } from 'react';
import { apiFetch, emitAppEvent, type Role, type User } from '@mfe/platform';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@mfe/ui';
import { UserPlus, Filter, Pencil, Trash2 } from 'lucide-react';

const tone = (s: User['status']) =>
  s === 'Active' ? 'success' : s === 'Invited' ? 'warning' : 'danger';

export default function UsersApp() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Viewer' as Role,
  });

  const load = () => {
    setError('');
    apiFetch<User[]>('/api/users')
      .then(setUsers)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      users?.filter((u) =>
        (u.name + u.email + u.role).toLowerCase().includes(q.toLowerCase())
      ) || [],
    [users, q]
  );

  async function saveUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingUserId) {
        const user = await apiFetch<User>(`/api/users/${editingUserId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        setUsers((v) => v?.map((u) => u.id === editingUserId ? user : u) || []);
        setModal(false);
        setEditingUserId(null);
        setForm({ name: '', email: '', role: 'Viewer' });
        emitAppEvent('mfe:user-updated', { userId: user.id });
        emitAppEvent('mfe:toast', {
          title: 'User updated',
          message: `${user.name} was updated successfully.`,
        });
      } else {
        const user = await apiFetch<User>('/api/users', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        setUsers((v) => [user, ...(v || [])]);
        setModal(false);
        setForm({ name: '', email: '', role: 'Viewer' });
        emitAppEvent('mfe:user-updated', { userId: user.id });
        emitAppEvent('mfe:toast', {
          title: 'User invited',
          message: `${user.name} was added successfully.`,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save user');
    }
  }

  async function remove(id: string) {
    try {
      await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers((v) => v?.filter((x) => x.id !== id) || []);
      emitAppEvent('mfe:user-updated', { userId: id });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete user');
    }
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Workspace"
        title="User Management"
        description="Invite teammates, manage access levels and review account status."
        actions={<Button onClick={() => {
          setEditingUserId(null);
          setForm({ name: '', email: '', role: 'Viewer' });
          setModal(true);
        }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><UserPlus size={16} /> Invite user</Button>}
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <Card>
          <div className="toolbar">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users, roles or email…"
            />
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Filter size={16} /> Filters</button>
          </div>

          {users === null ? (
            <Skeleton height={320} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No users found"
              description={
                q
                  ? 'Try a different search term.'
                  : 'Invite your first teammate to get started.'
              }
            />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <Avatar name={u.name} />
                          <div>
                            <strong>{u.name}</strong>
                            <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{u.role}</td>
                      <td>
                        <Badge tone={tone(u.status)}>{u.status}</Badge>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>
                        {u.status === 'Invited' ? 'Pending invitation' : 'Today'}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" aria-label="Edit" style={{ color: 'var(--muted)' }} onClick={() => {
                            setEditingUserId(u.id);
                            setForm({ name: u.name, email: u.email, role: u.role });
                            setModal(true);
                          }}>
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-btn"
                            aria-label="Remove"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => remove(u.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => { setModal(false); setEditingUserId(null); }}>
          <form
            className="modal"
            onSubmit={saveUser}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="eyebrow">{editingUserId ? 'Update member' : 'New team member'}</div>
            <h2>{editingUserId ? 'Edit user' : 'Invite a user'}</h2>
            <div className="form-grid">
              <div className="field">
                <label>Full name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Email address</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Role</label>
                <select
                  className="select"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as Role })
                  }
                >
                  <option>Viewer</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setModal(false); setEditingUserId(null); }}
              >
                Cancel
              </Button>
              <Button>{editingUserId ? 'Save changes' : 'Send invitation'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
