import { create } from 'zustand';
import { procesarPago } from '../services/paymentService';

export const usePaymentStore = create((set) => ({
  loading: false,
  error: null,
  processPayment: async (usuarioId, metodoPago, direccionId) => {
    set({ loading: true, error: null });
    try {
      const result = await procesarPago(usuarioId, metodoPago, direccionId);
      set({ loading: false });
      return result;
    } catch (error) {
      console.error('Error processing payment:', error);
      set({ loading: false, error: error.response?.data || error.message });
    }
  },
}));