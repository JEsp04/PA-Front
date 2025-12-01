// 🟦 useEnvioStore.js
import { create } from "zustand";
import {
  crearEnvio,
  obtenerEnviosPorUsuario,
} from "../services/envioService";

export const useEnvioStore = create((set) => ({
  loading: false,
  error: null,
  envios: [], // <- aquí se guardarán los envíos del usuario

  // ============================
  // 🔵 Crear un envío
  // ============================
  createEnvio: async (
    ordenId,
    direccionEnvio,
    ciudad,
    departamento,
    codigoPostal,
    estadoEnvio
  ) => {
    set({ loading: true, error: null });

    try {
      const nuevoEnvio = await crearEnvio(
        ordenId,
        direccionEnvio,
        ciudad,
        departamento,
        codigoPostal,
        estadoEnvio
      );

      // Opcional: agregarlo al store sin tener que recargar
      set((state) => ({
        loading: false,
        envios: [...state.envios, nuevoEnvio],
      }));
    } catch (error) {
      console.error("Error creando envío:", error);
      set({
        loading: false,
        error: error.response?.data || error.message,
      });
    }
  },

  // ============================
  // 🔵 Obtener envíos del usuario
  // ============================
  fetchEnviosUsuario: async (usuarioId) => {
    set({ loading: true, error: null });

    try {
      const data = await obtenerEnviosPorUsuario(usuarioId);

      set({
        loading: false,
        envios: data, // <-- aquí queda el array listo para renderizar
      });
    } catch (error) {
      console.error("Error obteniendo envíos:", error);
      set({
        loading: false,
        error: error.response?.data || error.message,
      });
    }
  },
}));
