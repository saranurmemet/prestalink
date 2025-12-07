'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
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
    }),
    {
      name: 'prestalink-auth',
    },
  ),
);

