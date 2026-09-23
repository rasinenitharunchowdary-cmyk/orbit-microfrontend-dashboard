import { useAuthStore } from '@mfe/platform';
import { PageHeader, Card, Button, Avatar } from '@mfe/ui';
import { Mail, Briefcase, Shield, Key } from 'lucide-react';

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Settings"
        title="My Profile"
        description="Manage your account settings and preferences."
      />
      <div className="profile-grid" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '24px' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 16px' }}>
          <div style={{ transform: 'scale(1.5)', marginBottom: '24px' }}>
            <Avatar name={user?.name || 'User'} />
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{user?.name}</h2>
          <p style={{ color: 'var(--muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} /> {user?.email}
          </p>
          <div style={{ marginTop: '24px', width: '100%' }}>
            <Button variant="secondary" style={{ width: '100%' }}>Edit Avatar</Button>
          </div>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Account Information</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--muted)' }}><Briefcase size={20} /></div>
                <div>
                  <div style={{ fontWeight: 500 }}>Role</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user?.role}</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--muted)' }}><Shield size={20} /></div>
                <div>
                  <div style={{ fontWeight: 500 }}>Security Level</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Standard</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--muted)' }}><Key size={20} /></div>
                <div>
                  <div style={{ fontWeight: 500 }}>Password</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Last changed 3 months ago</div>
                </div>
              </div>
              <Button variant="secondary">Change</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
