'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/types';

interface AuthState {
  user: User | null;
  token: string | null;
  hasHydrated: boolean;
  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setAuth: ({ user, token }) =>
        set(() => {
          return { user, token };
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      logout: () =>
        set(() => ({
          user: null,
          token: null,
        })),
      setHasHydrated: (hydrated: boolean) =>
        set(() => ({
          hasHydrated: hydrated,
        })),
    }),
    {
      name: 'prestalink-auth',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);

