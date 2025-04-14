import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { IAuthenticatedUser } from '../Types';

interface AuthState {
  userData: IAuthenticatedUser | null;
  login: (data: IAuthenticatedUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  updateUserData: (data: IAuthenticatedUser) => void;
  rememberedName: string | null;
  setRememberedName: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userData: null,
      rememberedName: null,

      login: (data) => {
        Cookies.set('token', data.token, { path: '/', expires: 7 });
        set({
          userData: data,
          rememberedName: data.profile.firstName,
        });
        window.location.href = '/home';
      },

      logout: () => {
        Cookies.remove('token', { path: '/' });
        localStorage.removeItem('auth-storage');
        set({ userData: null });
        window.location.href = '/login';
      },

      isAuthenticated: () => {
        const user = get().userData;
        return !!user && !!user.token;
      },

      updateUserData: (data: IAuthenticatedUser) =>
        set((state) => ({
          userData: {
            ...(state.userData as IAuthenticatedUser),
            ...data,
          },
        })),

      setRememberedName: (name) => {
        set({ rememberedName: name });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userData: state.userData,
        rememberedName: state.rememberedName,
      }),
    },
  ),
);
