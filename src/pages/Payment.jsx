import React, { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { usePaymentStore } from "../store/usePaymentStore";
import { useAuthStore } from "../store/useAuthStore";
import { useDireccionesStore } from "../store/useDireccionStore";
import { useNavigate } from "react-router-dom";
import AddressModal from "../components/AddressModal";

const Payment = () => {
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    direcciones,
    fetchDirecciones,
    loading: loadingDirecciones,
  } = useDireccionesStore();

  const { processPayment, loading, error } = usePaymentStore();

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedDireccionId, setSelectedDireccionId] = useState(null);
  const [isProcessingAnim, setIsProcessingAnim] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const usuarioId = user?.usuarioId || user?.id;

  // 🔥 Obtener direcciones al cargar
  useEffect(() => {
    if (usuarioId) fetchDirecciones(usuarioId);
  }, [usuarioId]);

  // 🏆 Escoger la dirección default
  const direccionDefault =
    direcciones.find((d) => d.esDefault) || direcciones[0] || null;

  // Auto-seleccionar la dirección default
  useEffect(() => {
    if (direccionDefault && !selectedDireccionId) {
      setSelectedDireccionId(direccionDefault.direccionId);
    }
  }, [direccionDefault, selectedDireccionId]);

  const subtotal = items.reduce(
    (acc, item) => acc + (item.cantidad || 0) * (item.precioUnitario || 0),
    0
  );

  // -------------------- FORM TARJETA -----------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "number") {
      formattedValue = value
        .replace(/[^\d]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (name === "expiry") {
      formattedValue = value
        .replace(/[^\d]/g, "")
        .replace(/(\d{2})/, "$1/")
        .slice(0, 5);
    }

    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const validateForm = () => {
    const errors = {};

    if (!cardDetails.number.match(/^(\d{4}\s){3}\d{4}$/))
      errors.number = "Número de tarjeta inválido.";

    if (!cardDetails.name.trim()) errors.name = "El nombre es obligatorio.";

    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
      errors.expiry = "Fecha inválida (MM/AA).";

    if (!cardDetails.cvc.match(/^\d{3,4}$/)) errors.cvc = "CVC inválido.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------- SUBMIT PAGO -----------------------
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!direccionDefault) {
      alert("Debes agregar una dirección antes de pagar.");
      return;
    }

    if (!usuarioId) {
      alert("Debes iniciar sesión.");
      navigate("/Autenticacion/Login");
      return;
    }

    if (paymentMethod === "creditCard" && !validateForm()) return;

    // Mostrar animación de procesamiento por 5 segundos
    try {
      setIsProcessingAnim(true);

      await new Promise((res) => setTimeout(res, 5000));

      const result = await processPayment(
        usuarioId,
        paymentMethod,
        selectedDireccionId
      );

      setIsProcessingAnim(false);

      // Mostrar confirmación con fecha estimada de entrega si está disponible
      const fechaEntrega =
        result?.envio?.fechaEntrega || result?.envio?.fechaEntrega;
      if (fechaEntrega) {
        const date = new Date(fechaEntrega);
        setDeliveryDate(
          date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
        setIsConfirmationVisible(true);

        // mostrar confirmación breve antes de redirigir
        await new Promise((res) => setTimeout(res, 2500));
      }

      navigate("/pedidos");
    } catch (err) {
      setIsProcessingAnim(false);
      alert("Error procesando el pago.");
    }
  };

  // -------------------- Botón método -----------------------
  const MethodButton = ({ id, icon, text }) => (
    <button
      type="button"
      onClick={() => setPaymentMethod(id)}
      className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-3 transition-all
        ${
          paymentMethod === id
            ? "bg-[#D4AF37] border-[#B8860B] text-black shadow-lg"
            : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
        }`}
    >
      {icon}
      <span className="font-semibold">{text}</span>
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">
            Finalizar Compra
          </h1>

          {/* ------------------- DIRECCIÓN --------------------- */}
          <div className="bg-white p-5 rounded-xl shadow mb-10 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">Envío para {user?.nombre}</p>

                {direccionDefault ? (
                  <div className="mt-3">
                    {direcciones.length > 1 && (
                      <div className="mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Selecciona una dirección
                        </label>
                        <select
                          value={selectedDireccionId || ""}
                          onChange={(e) =>
                            setSelectedDireccionId(e.target.value)
                          }
                          className="w-full mt-1 p-2 border rounded-md text-gray-700"
                        >
                          {direcciones.map((d) => (
                            <option key={d.direccionId} value={d.direccionId}>
                              {d.direccion} — {d.ciudad}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(() => {
                      const selected =
                        direcciones.find(
                          (d) => d.direccionId === selectedDireccionId
                        ) || direccionDefault;
                      if (!selected) return null;
                      return (
                        <div className="text-gray-700 space-y-1">
                          <p>
                            <b>Dirección:</b> {selected.direccion}
                          </p>
                          <p>
                            <b>Ciudad:</b> {selected.ciudad}
                          </p>
                          <p>
                            <b>Departamento:</b> {selected.departamento}
                          </p>
                          <p>
                            <b>Código Postal:</b> {selected.codigoPostal}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-600">
                    No has registrado ninguna dirección.
                  </p>
                )}
              </div>

              <button
                className="text-[#D4AF37] hover:underline font-medium"
                onClick={() => setIsAddressModalOpen(true)}
              >
                Cambiar / Agregar
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* ------------ MÉTODO DE PAGO ------------- */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-6">Método de pago</h2>

              <div className="flex gap-4 mb-8">
                <MethodButton
                  id="creditCard"
                  icon={<FiCreditCard size={20} />}
                  text="Tarjeta"
                />

                <MethodButton
                  id="paypal"
                  icon={<FaPaypal size={20} />}
                  text="PayPal"
                />
              </div>

              {paymentMethod === "creditCard" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label>Número de Tarjeta</label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleInputChange}
                      maxLength="19"
                      placeholder="0000 0000 0000 0000"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>

                  <div>
                    <label>Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleInputChange}
                      placeholder="Nombre completo"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label>Expiración</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        className="w-full p-3 border rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <label>CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleInputChange}
                        maxLength="4"
                        placeholder="123"
                        className="w-full p-3 border rounded-md"
                      />
                    </div>
                  </div>
                </form>
              )}

              {paymentMethod === "paypal" && (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <p>Serás redirigido a PayPal.</p>
                </div>
              )}
            </div>

            {/* ------------------- RESUMEN ------------------- */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-6">Resumen del pedido</h2>

              {items.map((item) => (
                <div
                  key={item.productoId}
                  className="flex justify-between mb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.Product?.imagenUrl}
                      alt=""
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.Product?.nombre}</p>
                      <p className="text-sm">Cantidad: {item.cantidad}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    $
                    {(item.precioUnitario * item.cantidad).toLocaleString(
                      "es-CO"
                    )}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString("es-CO")}</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || isProcessingAnim}
                  className="w-full mt-6 py-4 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-md flex items-center justify-center gap-2"
                >
                  <FiLock />
                  {loading || isProcessingAnim
                    ? "Procesando..."
                    : `Pagar $${subtotal.toLocaleString("es-CO")}`}
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIRECCIÓN */}
      {isProcessingAnim && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
            <p className="font-semibold">Procesando pago...</p>
          </div>
        </div>
      )}
      {isConfirmationVisible && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
              ✓
            </div>
            <p className="font-semibold">Pago realizado con éxito</p>
            {deliveryDate && (
              <p className="text-sm text-gray-600">
                Fecha estimada de entrega: <b>{deliveryDate}</b>
              </p>
            )}
          </div>
        </div>
      )}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          fetchDirecciones(usuarioId); // 🔥 recargar direcciones
        }}
        usuarioId={usuarioId}
      />
    </div>
  );
};

export default Payment;
