import { create } from "zustand";
import { crearEnvio } from "../services/envioService";

export const useEnvioStore = create((set) => ({
  loading: false,
  error: null,
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
      await crearEnvio(
        ordenId,
        direccionEnvio,
        ciudad,
        departamento,
        codigoPostal,
        estadoEnvio
      );
      set({ loading: false });
    } catch (error) {
      console.error("Error creating envio:", error);
      set({ loading: false, error: error.response?.data || error.message });
    }
  },
}));
