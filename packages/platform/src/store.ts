import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser } from './types';

type AuthState = {
  token: string | null;
  user: SessionUser | null;
  hydrated: boolean;
  setSession: (token: string, user: SessionUser) => void;
  clearSession: () => void;
  markHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    token: null,
    user: null,
    hydrated: false,
    setSession: (token, user) => set({ token, user }),
    clearSession: () => set({ token: null, user: null }),
    markHydrated: () => set({ hydrated: true }),
  }),
  {
    name: 'orbit-session',
    partialize: (state) => ({ token: state.token, user: state.user }),
    onRehydrateStorage: () => (state) => state?.markHydrated(),
  }
));
