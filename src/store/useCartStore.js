import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { product, quantity }
      
      // Añade un producto al carrito o actualiza su cantidad
      addProduct: (product, quantity) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.productoId === product.productoId);

        if (existingItem) {
          // Si el producto ya está, actualiza la cantidad
          const updatedItems = items.map(item =>
            item.product.productoId === product.productoId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          // Si es un producto nuevo, lo añade al carrito
          set({ items: [...items, { product, quantity }] });
        }
      },

      // Actualiza la cantidad de un producto específico
      updateQuantity: (productId, newQuantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.productoId === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
            .filter((item) => item.quantity > 0), // Elimina el item si la cantidad es 0
        }));
      },

      // Elimina un producto del carrito
      removeProduct: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.productoId !== productId),
        }));
      },

      // Devuelve el número total de artículos en el carrito
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // Nombre para la persistencia en localStorage
    }
  )
);

export default useCartStore;