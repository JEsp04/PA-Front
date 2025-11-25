import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";

export default function CheckoutButton({ subtotal, usuarioId }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const ordenRes = await axios.post("http://localhost:4000/api/ordenes/CrearOrden", {
        usuarioId,
        total: subtotal,
      });

      const ordenId = ordenRes.data.ordenId;

      const prefRes = await axios.post("http://localhost:4000/api/pagos/crear", {
        ordenId,
        usuarioId,
        monto: subtotal,
      });

      const { init_point } = prefRes.data;

      window.location.href = init_point;

    } catch (err) {
      console.error(err);
      alert("Error en el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
      disabled={loading}
    >
      {loading ? "Procesando..." : "Pagar con Mercado Pago"}
    </button>
  );
}
