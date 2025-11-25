import {create} from 'zustand';
import * as productService from '../services/productService';

const useProductStore = create((set) => ({
    products: [],
    loading: false,
    error: null,
    fetchProducts: async () => {
        set({loading: true, error: null});
        try {
            const products = await productService.getProducts();
            set({products, loading: false});
        } catch (error) {
            set({error, loading: false});
        }
    },
    
}));

export default useProductStore;