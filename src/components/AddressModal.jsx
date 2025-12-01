import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useDireccionesStore } from "../store/useDireccionStore";
import { useAuthStore } from "../store/useAuthStore";

export default function AddressModal({ isOpen, onClose }) {
  const { user } = useAuthStore();

  const {
    addDireccion,
    fetchDirecciones,
    updateDireccion,
    deleteDireccion,
    setDireccionDefault,
    direcciones,
    loading,
  } = useDireccionesStore();

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    direccion: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
  });

  // Cuando abran el modal, cargar direcciones
  useEffect(() => {
    if (isOpen && user?.usuarioId) {
      fetchDirecciones(user.usuarioId);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setForm({
      direccion: "",
      ciudad: "",
      departamento: "",
      codigoPostal: "",
    });
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.usuarioId) {
      alert("Debes iniciar sesión");
      return;
    }

    if (editId) {
      // MODO EDICIÓN
      await updateDireccion(editId, form);
      resetForm();
    } else {
      // CREAR NUEVA
      const nueva = await addDireccion(user.usuarioId, form);

      if (nueva) {
        await setDireccionDefault(nueva.direccionId);
      }

      resetForm();
    }

    fetchDirecciones(user.usuarioId);
  };

  const handleEdit = (dir) => {
    setEditId(dir.direccionId);
    setForm({
      direccion: dir.direccion,
      ciudad: dir.ciudad,
      departamento: dir.departamento,
      codigoPostal: dir.codigoPostal,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;

    await deleteDireccion(id);
    fetchDirecciones(user.usuarioId);

    if (editId === id) resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-300 relative">

        {/* BOTÓN CERRAR */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-[#D4AF37] mb-4">
          {editId ? "Editar Dirección" : "Registrar Dirección"}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Ciudad</label>
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
            <label className="block text-sm font-semibold">Departamento</label>
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
            <label className="block text-sm font-semibold">Código Postal</label>
            <input
              type="text"
              name="codigoPostal"
              value={form.codigoPostal}
              onChange={handleChange}
              maxLength={6}
              className="w-full mt-1 p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-white p-2 rounded-lg hover:bg-[#B8860B] transition"
          >
            {editId
              ? loading ? "Actualizando..." : "Actualizar Dirección"
              : loading ? "Guardando..." : "Guardar Dirección"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-2 w-full bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar edición
            </button>
          )}
        </form>

        {/* LISTA DE DIRECCIONES */}
        {direcciones.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Mis direcciones
            </h3>
            <ul className="space-y-2">
              {direcciones.map((dir) => (
                <li
                  key={dir.direccionId}
                  className={`p-3 rounded-lg border flex justify-between items-start ${
                    dir.esDefault
                      ? "border-[#D4AF37] bg-[#fff8db]"
                      : "border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-medium">{dir.direccion}</p>
                    <p className="text-xs text-gray-600">
                      {dir.ciudad}, {dir.departamento} — {dir.codigoPostal}
                    </p>

                    {!dir.esDefault && (
                      <button
                        onClick={() => setDireccionDefault(dir.direccionId)}
                        className="mt-2 text-sm text-[#D4AF37] underline"
                      >
                        Usar como predeterminada
                      </button>
                    )}
                  </div>

                  {/* ACCIONES */}
                  <div className="flex flex-col gap-1">
                    <button
                      className="text-blue-600 text-sm underline"
                      onClick={() => handleEdit(dir)}
                    >
                      Editar
                    </button>

                    <button
                      className="text-red-600 text-sm underline"
                      onClick={() => handleDelete(dir.direccionId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
