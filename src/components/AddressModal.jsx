import { useState } from "react";
import { useEnvioStore } from "../store/useEnvioStore";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function AddressModal({ isOpen, onClose, ordenId }) {

  const createEnvio = useEnvioStore((state) => state.createEnvio);
  const loading = useEnvioStore((state) => state.loading);

  const [form, setForm] = useState({
    direccionEnvio: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEnvio(
      ordenId,
      form.direccionEnvio,
      form.ciudad,
      form.departamento,
      form.codigoPostal,
      "pendiente"
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-300 relative">

        {/* ❌ Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-[#D4AF37] mb-4">
          Añadir Dirección de Envío
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold">
              Dirección
            </label>
            <input
              type="text"
              name="direccionEnvio"
              value={form.direccionEnvio}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold ">
              Ciudad
            </label>
            <input
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold ">
              Departamento
            </label>
            <input
              type="text"
              name="departamento"
              value={form.departamento}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold ">
              Código Postal
            </label>
            <input
              type="text"
              name="codigoPostal"
              value={form.codigoPostal}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-white p-2 rounded-lg hover:bg-[#B8860B] transition"
          >
            {loading ? "Guardando..." : "Guardar Dirección"}
          </button>
        </form>
      </div>
    </div>
  );
}
