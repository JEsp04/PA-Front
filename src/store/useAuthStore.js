import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  register: async (userData) => {
    try {
      set({ loading: true });

      const res = await axios.post("http://localhost:4000/api/usuarios/auth/registro", userData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false
      });

      return { success: true };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.msg || "Error en registro" });
      return { success: false };
    }
  },

  login: async (credentials) => {
    try {
      set({ loading: true });

      const res = await axios.post("http://localhost:4000/api/usuarios/auth/login", credentials);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false
      });

      return { success: true };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.msg || "Error en login" });
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
    });
  },
}));
