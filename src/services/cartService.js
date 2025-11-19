import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
    headers: {
    'Content-Type': 'application/json',
  },
});
// Obtener carrito según usuario (si no existe, lo crea)
export const obtenerCarritoUsuario = (usuarioId) =>
  api.get(`/carritos/ObtenerPorUsuario/${usuarioId}`);

// Sincronizar carrito (añadir/editar/eliminar items)
export const sincronizarCarrito = (usuarioId, items) =>
  api.post("/carritos/actualizar", { usuarioId, items });

// Crear carrito (usa el endpoint /carrito/crear)
export const crearCarrito = (usuarioId) =>
  api.post('/carritos/crear', { usuarioId });
