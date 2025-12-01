import { create } from "zustand";
import {
  obtenerDireccionesPorUsuario,
  agregarDireccion,
  actualizarDireccion,
  eliminarDireccion,
  establecerDireccionDefault,
} from "../services/direccionService";

export const useDireccionesStore = create((set, get) => ({
  direcciones: [],
  loading: false,
  error: null,

  // Normaliza la estructura de una dirección para garantizar strings en los campos
  _normalizeDireccion: (d) => ({
    direccionId: d?.direccionId ?? d?.id ?? null,
    usuarioId: d?.usuarioId ?? null,
    direccion:
      typeof d?.direccion === "string"
        ? d.direccion
        : d?.direccion?.direccion ?? JSON.stringify(d?.direccion ?? ""),
    ciudad: typeof d?.ciudad === "string" ? d.ciudad : d?.ciudad?.ciudad ?? "",
    departamento:
      typeof d?.departamento === "string"
        ? d.departamento
        : d?.departamento?.departamento ?? "",
    codigoPostal:
      typeof d?.codigoPostal === "string"
        ? d.codigoPostal
        : d?.codigoPostal?.codigoPostal ?? "",
    esDefault: !!d?.esDefault,
    createdAt: d?.createdAt,
    updatedAt: d?.updatedAt,
  }),

  // Obtener direcciones del usuario
  fetchDirecciones: async (usuarioId) => {
    set({ loading: true, error: null });
    try {
      const data = await obtenerDireccionesPorUsuario(usuarioId);
      const normalized = (data || []).map((d) => get()._normalizeDireccion(d));
      set({ direcciones: normalized, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Agregar nueva dirección
  addDireccion: async (usuarioId, direccionData) => {
    set({ loading: true, error: null });
    try {
      const nueva = await agregarDireccion(
        usuarioId,
        direccionData.direccion,
        direccionData.ciudad,
        direccionData.departamento,
        direccionData.codigoPostal
      );

      const norm = get()._normalizeDireccion(nueva);
      set({
        direcciones: [...get().direcciones, norm],
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Actualizar dirección
  updateDireccion: async (direccionId, data) => {
    set({ loading: true, error: null });
    try {
      const actualizada = await actualizarDireccion(direccionId, data);

      const norm = get()._normalizeDireccion(actualizada);
      set({
        direcciones: get().direcciones.map((d) =>
          d.direccionId === direccionId ? norm : d
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Eliminar dirección
  deleteDireccion: async (direccionId) => {
    set({ loading: true, error: null });
    try {
      await eliminarDireccion(direccionId);

      set({
        direcciones: get().direcciones.filter(
          (d) => d.direccionId !== direccionId
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Establecer dirección como default
  setDireccionDefault: async (direccionId) => {
    set({ loading: true, error: null });
    try {
      await establecerDireccionDefault(direccionId);

      // Actualizar en el estado
      set({
        direcciones: get().direcciones.map((d) => ({
          ...d,
          esDefault: d.direccionId === direccionId,
        })),
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
