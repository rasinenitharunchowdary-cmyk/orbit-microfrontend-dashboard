export type AppEventMap = {
  'mfe:toast': { title: string; message: string };
  'mfe:user-updated': { userId: string };
  'mfe:notifications-changed': { unread: number };
};

export function emitAppEvent<K extends keyof AppEventMap>(name: K, detail: AppEventMap[K]) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}
export function onAppEvent<K extends keyof AppEventMap>(name: K, handler: (detail: AppEventMap[K]) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<AppEventMap[K]>).detail);
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
}
