import { useEffect } from "react";
import { useEnvioStore } from "../store/useEnvioStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

export default function Pedidos() {
  const { envios, loading, fetchEnviosUsuario } = useEnvioStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.usuarioId) {
      fetchEnviosUsuario(user.usuarioId);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-6">Tus pedidos</h1>

      {envios.length === 0 && (
        <p className="text-gray-600">No tienes pedidos aún.</p>
      )}

      <div className="space-y-8">
        {envios.map((envio) => (
          <PedidoCard key={envio.envioId} envio={envio} user={user} />
        ))}
      </div>
    </div>
  );
}

function PedidoCard({ envio, user }) {
  const orden = envio?.Orden;
  const detalles = orden?.OrdenDetalles || [];
  const fecha = orden?.createdAt
    ? new Date(orden.createdAt).toLocaleDateString()
    : "N/A";
  const total = orden?.total || 0;
  const nombreUsuario = user?.nombre || "Cliente";

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      {/* Encabezado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Pedido realizado</p>
          <p className="font-semibold text-gray-800">{fecha}</p>
        </div>
        <div>
          <p className="text-gray-600">Total</p>
          <p className="font-semibold text-gray-800">
            COP ${total.toLocaleString("es-CO")}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Enviar a</p>
          <p className="font-semibold text-gray-800">{nombreUsuario}</p>
        </div>
        <div>
          <p className="text-gray-600">Estado</p>
          <p
            className={`font-semibold ${
              envio?.estadoEnvio === "entregado"
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {envio?.estadoEnvio || "Procesando"}
          </p>
        </div>
      </div>

      <hr className="my-4" />

      {/* Lista de productos */}
      <div className="space-y-3">
        {detalles.length > 0 ? (
          detalles.map((detalle) => (
            <div
              key={detalle.ordenDetalleId}
              className="flex items-center gap-4 pb-3 border-b last:border-b-0"
            >
              {/* Imagen */}
              <img
                src={
                  detalle?.Producto?.imagenUrl ||
                  "https://via.placeholder.com/80"
                }
                alt={detalle?.Producto?.nombre || "Producto"}
                className="w-20 h-20 object-cover rounded-md bg-gray-100"
              />

              {/* Detalles del producto */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {detalle?.Producto?.nombre || "Producto sin nombre"}
                </p>
                <p className="text-sm text-gray-600">
                  Cantidad: {detalle?.cantidad}
                </p>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="font-semibold text-gray-800">
                  COP $
                  {(
                    detalle?.cantidad * detalle?.precioUnitario
                  )?.toLocaleString("es-CO") || "0"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No hay productos en este pedido.</p>
        )}
      </div>
    </div>
  );
}
