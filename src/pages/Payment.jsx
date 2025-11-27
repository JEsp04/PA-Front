import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { usePaymentStore } from "../store/usePaymentStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import AddressModal from "../components/AddressModal";
import { useEnvioStore } from "../store/useEnvioStore";

const Payment = () => {
  const { items } = useCartStore();
  const { user } = useAuthStore();

  const envio = useEnvioStore((state) => state.envio); // ← corregido

  const { processPayment, loading, error } = usePaymentStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const subtotal = items.reduce(
    (acc, item) => acc + (item.cantidad || 0) * (item.precioUnitario || 0),
    0
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let metodoPago = paymentMethod;

    if (paymentMethod === "creditCard") {
      if (!validateForm()) return;
      metodoPago = "creditCard";
    }

    const usuarioId = user?.usuarioId || user?.id;

    if (!usuarioId) {
      alert("Debes iniciar sesión para completar el pago.");
      navigate("/Autenticacion");
      return;
    }

    try {
      await processPayment(usuarioId, metodoPago);
      alert("¡Pago realizado con éxito!");
    } catch {
      alert("Hubo un error procesando el pago.");
    }
  };

  const MethodButton = ({ id, currentMethod, setMethod, icon, text }) => (
    <button
      type="button"
      onClick={() => setMethod(id)}
      className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ${
        currentMethod === id
          ? "bg-[#D4AF37] border-[#B8860B] text-[#0A0A0A] shadow-lg"
          : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:border-gray-300"
      }`}
    >
      {icon}
      <span className="font-semibold">{text}</span>
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">
            Finalizar Compra
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Estás a un solo paso de completar tu pedido.
          </p>

          {/* Dirección de envío */}
          <div className="bg-white p-5 rounded-xl shadow mb-10 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-gray-900">
                  Entrega para {user?.nombre}
                </p>
                {envio?.direccionEnvio ? (
                  <div className="mt-3 space-y-1 text-gray-700">
                    <p>
                      <span className="font-semibold">Dirección:</span>{" "}
                      {envio.direccionEnvio}
                    </p>
                    <p>
                      <span className="font-semibold">Ciudad:</span>{" "}
                      {envio.ciudad}
                    </p>
                    <p>
                      <span className="font-semibold">Departamento:</span>{" "}
                      {envio.departamento}
                    </p>
                    <p>
                      <span className="font-semibold">Código Postal:</span>{" "}
                      {envio.codigoPostal}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-1">
                    No has registrado tu dirección
                  </p>
                )}
              </div>

              <button
                className="text-[#D4AF37] hover:underline font-medium"
                onClick={() => setIsAddressModalOpen(true)}
              >
                Cambiar
              </button>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Columna de Pago */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Elige tu método de pago
              </h2>

              <div className="flex gap-4 mb-8">
                <MethodButton
                  id="creditCard"
                  currentMethod={paymentMethod}
                  setMethod={setPaymentMethod}
                  icon={<FiCreditCard size={20} />}
                  text="Tarjeta"
                />

                <MethodButton
                  id="paypal"
                  currentMethod={paymentMethod}
                  setMethod={setPaymentMethod}
                  icon={<FaPaypal size={20} />}
                  text="PayPal"
                />
              </div>

              {paymentMethod === "creditCard" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleInputChange}
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                      className={`w-full p-3 border rounded-md ${
                        formErrors.number ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.number && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nombre en la Tarjeta
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleInputChange}
                      placeholder="Nombre Completo"
                      className={`w-full p-3 border rounded-md ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1">
                        Expiración
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        className={`w-full p-3 border rounded-md ${
                          formErrors.expiry
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.expiry && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.expiry}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className={`w-full p-3 border rounded-md ${
                          formErrors.cvc ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.cvc && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.cvc}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {paymentMethod === "paypal" && (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <p className="text-gray-600">
                    Serás redirigido a PayPal para completar tu compra.
                  </p>
                </div>
              )}
            </div>

            {/* Columna Resumen */}
            <div className="mt-10 lg:mt-0">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Resumen del pedido
                </h2>

                {items.map((item) => (
                  <div
                    key={item.productoId}
                    className="flex justify-between mb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.Product?.imagenUrl ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.Product?.nombre}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.Product?.nombre}</p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.cantidad}
                        </p>
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

                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString("es-CO")}</span>
                  </div>

                  <div className="flex justify-between text-xl font-bold mt-4">
                    <span>Total</span>
                    <span>${subtotal.toLocaleString("es-CO")}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full mt-6 py-4 rounded-md text-lg font-bold flex justify-center items-center gap-2 ${
                    loading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-[#D4AF37] hover:bg-[#B8860B] text-black"
                  }`}
                >
                  <FiLock />
                  {loading
                    ? "Procesando..."
                    : `Pagar ${subtotal.toLocaleString("es-CO")}`}
                </button>

                {error && (
                  <p className="text-red-500 text-center mt-4">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIRECCIÓN */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        ordenId={1} // ← Ajusta si tienes orden real
      />
    </div>
  );
};

export default Payment;
