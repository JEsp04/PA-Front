import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
    headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  try {
    const response = await api.get('/productos/obtener');
    return response.data;
  } catch (error) {
    console.error("Error en getProducts:", error.response?.data || error.message);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/productos/obtenerPor/${id}`);
    return response.data;
  }
  catch (error) {
    console.error("Error en getProductById:", error.response?.data || error.message);
    throw error;
  }
};