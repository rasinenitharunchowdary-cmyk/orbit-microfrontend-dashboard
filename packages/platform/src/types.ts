export type Role = 'Admin' | 'Manager' | 'Viewer';
export type User = { id: string; name: string; email: string; role: Role; status: 'Active' | 'Invited' | 'Suspended'; avatar?: string };
export type SessionUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;
export type NotificationItem = { id: string; title: string; message: string; time: string; unread: boolean; kind: 'system' | 'security' | 'team' | 'billing' };
export type Metric = { label: string; value: string; delta: number; trend: number[] };
export type AnalyticsData = { metrics: Metric[]; traffic: {label:string; value:number}[]; sources: {name:string; value:number}[] };
