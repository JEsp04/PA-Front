import { create } from "zustand";
import {
  obtenerCarritoPorUsuario,
  sincronizarCarrito,
  crearCarrito,
} from "../services/cartService";

export const useCartStore = create((set, get) => ({
  carritoId: null,
  items: [],
  loading: false,
  error: null,

  // ========================
  // Limpiar carrito
  // ========================
  clearCart: () =>
    set({
      carritoId: null,
      items: [],
      loading: false,
      error: null,
    }),

  // ========================
  // Cargar carrito al inicio
  // ========================
  loadCart: async (usuarioId) => {
    try {
      set({ loading: true });

      const carrito = await obtenerCarritoPorUsuario(usuarioId);

      set({
        carritoId: carrito.carritoId,
        items:
          carrito.CarritoDetalles?.map((d) => ({
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.subtotal,
            Product: d.Product || null, // ← añadir producto completo
          })) || [],
        error: null,
      });
    } catch (error) {
      console.error("Error loading cart:", error);

      // Si el backend responde 404, no existe carrito → crear uno
      if (error?.response?.status === 404) {
        try {
          await crearCarrito(usuarioId);

          const carrito2 = await obtenerCarritoPorUsuario(usuarioId);

          set({
            carritoId: carrito2.carritoId,
            items:
              carrito2.CarritoDetalles?.map((d) => ({
                productoId: d.productoId,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario,
                subtotal: d.subtotal,
                Product: d.Product || null, // ← añadir producto completo
              })) || [],
            error: null,
          });
        } catch (err2) {
          console.error("Error creating cart:", err2);
          set({ error: "Error creando carrito" });
        }
      } else {
        set({ error: "Error cargando carrito" });
      }
    } finally {
      set({ loading: false });
    }
  },

  // ========================
  // Agregar producto
  // ========================
  addToCart: async (usuarioId, product, cantidad) => {
    const { items } = get();

    const updated = [...items];

    const resolvedId = product?.productoId ?? null;
    const resolvedPrice = Number(product?.precioUnitario ?? 0);

    const existing = updated.find((i) => i.productoId === resolvedId);

    if (existing) {
      existing.cantidad += cantidad;
    } else {
      updated.push({
        productoId: resolvedId,
        cantidad,
        precioUnitario: resolvedPrice,
        Product: product, // ← guardar el objeto producto completo
      });
    }

    set({ items: updated });

    const payloadItems = updated
      .filter((i) => i.productoId != null)
      .map((i) => ({
        productoId: i.productoId,
        cantidad: Number(i.cantidad),
      }));

    try {
      await sincronizarCarrito(usuarioId, payloadItems);
    } catch (err) {
      console.error("Error sincronizando carrito en addToCart:", err);
      set({ error: "Error sincronizando carrito" });
    }
  },

  // ========================
  // Actualizar cantidad
  // ========================
  updateQuantity: async (usuarioId, productoId, newQuantity) => {
    const updated = get().items.map((i) =>
      i.productoId === productoId ? { ...i, cantidad: newQuantity } : i
    );

    set({ items: updated });

    const payloadItems = updated
      .filter((i) => i.productoId != null)
      .map((i) => ({
        productoId: i.productoId,
        cantidad: Number(i.cantidad),
      }));

    try {
      await sincronizarCarrito(usuarioId, payloadItems);
    } catch (err) {
      console.error("Error sincronizando carrito:", err);
      set({ error: "Error sincronizando carrito" });
    }
  },

  // ========================
  // Eliminar item
  // ========================
  removeProduct: async (usuarioId, productoId) => {
    const updated = get().items.filter((i) => i.productoId !== productoId);

    set({ items: updated });

    const payloadItems = updated.map((i) => ({
      productoId: i.productoId,
      cantidad: Number(i.cantidad),
    }));

    try {
      await sincronizarCarrito(usuarioId, payloadItems);
    } catch (err) {
      console.error("Error sincronizando carrito:", err);
      set({ error: "Error sincronizando carrito" });
    }
  },

  // ========================
  // Total items
  // ========================
  getTotalItems: () =>
    get().items.reduce((acc, i) => acc + Number(i.cantidad), 0),
}));
