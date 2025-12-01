import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const obtenerDireccionesPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/direcciones/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error en obtenerDireccionesPorUsuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const agregarDireccion = async (
  usuarioId,
  direccion,
  ciudad,
  departamento,
  codigoPostal
) => {
  try {
    const response = await api.post("/direcciones/crear", {
      usuarioId,
      direccion,
      ciudad,
      departamento,
      codigoPostal,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error en agregarDireccion:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const actualizarDireccion = async (direccionId, data) => {
  try {
    const response = await api.patch(
      `/direcciones/actualizar/${direccionId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error en actualizarDireccion:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const eliminarDireccion = async (direccionId) => {
  try {
    const response = await api.delete(`/direcciones/eliminar/${direccionId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error en eliminarDireccion:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const establecerDireccionDefault = async (direccionId) => {
  try {
    const response = await api.post(
      `/direcciones/establecerDefault/${direccionId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error en establecerDireccionDefault:",
      error.response?.data || error.message
    );
    throw error;
  }
};
