'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/types';

interface AuthState {
  user: User | null;
  token: string | null;
  rememberMe: boolean;
  hasHydrated: boolean;
  setAuth: (payload: { user: User; token: string; rememberMe?: boolean }) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      rememberMe: true,
      hasHydrated: false,
      setAuth: ({ user, token, rememberMe = true }) =>
        set(() => {
          return { user, token, rememberMe };
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
          rememberMe: true,
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

