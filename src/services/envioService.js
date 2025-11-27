import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const crearEnvio = async (
  ordenId,
  direccionEnvio,
  ciudad,
  departamento,
  codigoPostal,
  estadoEnvio
) => {
  try {
    const response = await api.post("/envios/crearEnvio", {
      ordenId,
      direccionEnvio,
      ciudad,
      departamento,
      codigoPostal,
      estadoEnvio,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creando envio:",
      error.response?.data || error.message
    );
    throw error;
  }
};
