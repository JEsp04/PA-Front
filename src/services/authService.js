import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
    headers: {
    'Content-Type': 'application/json',
  },
});

export const RegisterUser = async (data) => {
    try {
      const response = await api.post('/usuarios/auth/registro', data);
      return response.data;
    }
    catch (error) {
      console.error("Error en RegisterUser:", error.response?.data || error.message);
      throw error;
    }
};

export const LoginUser = async (data) => {
    try {
        const response = await api.post('/usuarios/auth/login', data);
        return response.data;
    }
    catch (error) {
        console.error("Error en LoginUser:", error.response?.data || error.message);
        throw error;
    }
};





