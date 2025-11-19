import { create } from "zustand";
import {
  obtenerCarritoUsuario,
  sincronizarCarrito,
  crearCarrito,
} from "../services/cartService";

export const useCartStore = create((set, get) => ({
  carritoId: null,
  items: [],
  loading: false,
  error: null,

  // ========================
  // Cargar carrito al inicio
  // ========================
  loadCart: async (usuarioId) => {
    try {
      set({ loading: true });

      const res = await obtenerCarritoUsuario(usuarioId);
      const carrito = res.data;

      set({
        carritoId: carrito.carritoId,
        items:
          carrito.CarritoDetalles?.map((d) => ({
            productoId: d.productoId,
            quantity: d.cantidad,
            precioUnitario: d.precioUnitario,
            product: d.Product || null,
          })) || [],
      });
    } catch (error) {
      console.error('Error loading cart:', error);
      // Si el backend responde 404, intentamos crear un carrito vacío sincronizando
      const status = error?.response?.status;
      if (status === 404) {
        try {
          // Intentar crear carrito usando el endpoint específico de creación
          await crearCarrito(usuarioId);
          // Reintentar obtener el carrito recién creado
          const res2 = await obtenerCarritoUsuario(usuarioId);
          const carrito2 = res2.data;
          set({
            carritoId: carrito2.carritoId,
            items:
              carrito2.CarritoDetalles?.map((d) => ({
                productoId: d.productoId,
                quantity: d.cantidad,
                precioUnitario: d.precioUnitario,
                product: d.Product || null,
              })) || [],
          });
        } catch (err2) {
          console.error('Error creating cart after 404:', err2);
          set({ error: 'Error creando carrito' });
        }
      } else {
        set({ error: 'Error cargando carrito' });
      }
    } finally {
      set({ loading: false });
    }
  },

  // ========================
  // Agregar producto
  // ========================
  addToCart: async (usuarioId, product, quantity) => {
    const { items } = get();

    const updated = [...items];

    // Resolver id y precio robustamente (varios esquemas de producto)
    const resolvedId = product?.productoId ?? product?.productId ?? product?.id ?? product?._id ?? null;
    const resolvedPrice = Number(product?.precio ?? product?.price ?? product?.precioUnitario ?? 0) || 0;

    const existing = updated.find((i) => i.productoId === resolvedId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      updated.push({
        productoId: resolvedId,
        quantity,
        precioUnitario: resolvedPrice,
        product,
      });
    }

    set({ items: updated });

    // Filtrar items inválidos y preparar payload esperado por el backend
    const payloadItems = updated
      .filter((i) => i.productoId !== undefined && i.productoId !== null)
      .map((i) => ({ productoId: i.productoId, cantidad: Number(i.quantity) || 1 }));

    console.debug('Sincronizando carrito (addToCart) payload=', { usuarioId, items: payloadItems });
    try {
      const res = await sincronizarCarrito(usuarioId, payloadItems);
      console.debug('sincronizarCarrito response:', res?.data || res);
    } catch (err) {
      console.error('Error sincronizando carrito en addToCart:', err, 'payload=', payloadItems);
      set({ error: 'Error sincronizando carrito' });
    }
  },

  // ========================
  // Actualizar cantidad
  // ========================
  updateQuantity: async (usuarioId, productoId, newQuantity) => {
    const updated = get().items.map((i) =>
      i.productoId === productoId ? { ...i, quantity: newQuantity } : i
    );

    set({ items: updated });
    const payloadItems = updated
      .filter((i) => i.productoId !== undefined && i.productoId !== null)
      .map((i) => ({ productoId: i.productoId, cantidad: Number(i.quantity) || 1 }));
    try {
      const res = await sincronizarCarrito(usuarioId, payloadItems);
      console.debug('sincronizarCarrito response (updateQuantity):', res?.data || res);
    } catch (err) {
      console.error('Error sincronizando carrito en updateQuantity:', err, 'payload=', payloadItems);
      set({ error: 'Error sincronizando carrito' });
    }
  },

  // ========================
  // Eliminar item
  // ========================
  removeProduct: async (usuarioId, productoId) => {
    const updated = get().items.filter(
      (i) => i.productoId !== productoId
    );

    set({ items: updated });
    const payloadItems = updated
      .filter((i) => i.productoId !== undefined && i.productoId !== null)
      .map((i) => ({ productoId: i.productoId, cantidad: Number(i.quantity) || 1 }));
    try {
      const res = await sincronizarCarrito(usuarioId, payloadItems);
      console.debug('sincronizarCarrito response (removeProduct):', res?.data || res);
    } catch (err) {
      console.error('Error sincronizando carrito en removeProduct:', err, 'payload=', payloadItems);
      set({ error: 'Error sincronizando carrito' });
    }
  },

  // ========================
  // Total items
  // ========================
  getTotalItems: () => {
    return get().items.reduce((acc, i) => acc + i.quantity, 0);
  },
}));
