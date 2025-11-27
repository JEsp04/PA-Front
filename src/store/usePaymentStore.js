import { create } from 'zustand';
import { procesarPago } from '../services/paymentService';

export const usePaymentStore = create((set) => ({
  loading: false,
  error: null,
  processPayment: async (usuarioId, metodoPago) => {
    set({ loading: true, error: null });
    try {
      await procesarPago(usuarioId, metodoPago);
      set({ loading: false });
    } catch (error) {
      console.error('Error processing payment:', error);
      set({ loading: false, error: error.response?.data || error.message });
    }
  },
}));