import { create } from "zustand";
import { LoginUser, RegisterUser } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  notification: null,
  setNotification: (message) => set({ notification: message }),

  register: async (userData) => {
    set({ loading: true, error: null });

    try {
      const res = await RegisterUser(userData);

      const user = res.user || res.usuario || res;
      const token = res.token || null;

      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (token) localStorage.setItem("token", token);

      set({
        user,
        token,
        isAuthenticated: !!token,
        loading: false,
        notification: user ? `¡Bienvenido/a, ${user.nombre || ''}! Tu cuenta ha sido creada con éxito.` : null,
      });

      return { success: true };
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || "Error en registro",
      });
      return { success: false };
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const res = await LoginUser(credentials);

      const user = res.user || res.usuario || res;
      const token = res.token || null;

      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (token) localStorage.setItem("token", token);

      set({
        user,
        token,
        isAuthenticated: !!token,
        loading: false,
        notification: user ? `¡Bienvenido/a de nuevo, ${user.nombre || ''}! Has iniciado sesión con éxito.` : null,
      });

      return { success: true };
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || "Error en login",
      });
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      loading: false,
    });
  },
}));
