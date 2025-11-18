import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { FiCheckCircle, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import CheckoutButton from '../components/ButtonCheckout.jsx';
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";



export const Cart = () => {

  const { items, updateQuantity, removeProduct } = useCartStore();
  const location = useLocation();
  const productAdded = location.state?.productAdded;

  const [ordenId, setOrdenId] = useState(null);
  const { user } = useAuthStore();
  const usuarioId = user?.usuarioId || null;

  
  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.product.precio) || 0;
    return acc + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (items.length === 0) return; 

    const crearOrden = async () => {
      try {
        const res = await axios.post("http://localhost:4000/api/ordenes/CrearOrden", {
          usuarioId: usuarioId,
          total: subtotal,
        });

        console.log("Orden creada:", res.data);
        setOrdenId(res.data.ordenId);
      } catch (err) {
        console.error("Error creando orden:", err);
      }
    };

    crearOrden();
  }, [items]); // si cambian los items, recrear orden
  

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Carrito de Compras
        </h1>

        {productAdded && (
          <div className="mt-6 flex items-center space-x-2 rounded-md bg-green-50 p-4 text-green-700">
            <FiCheckCircle className="h-5 w-5" />
            <p>
              ¡"<span className="font-semibold">{productAdded}</span>" fue añadido
              a tu carrito!
            </p>
          </div>
        )}

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* LISTA DEL CARRITO */}
          <section className="lg:col-span-7">
            {items.length > 0 ? (
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {items.map(({ product, quantity }) => {
                  const imageSrc =
                    product?.imagenUrl ??
                    product?.imagen ??
                    "https://via.placeholder.com/150";

                  return (
                    <li key={product.productoId} className="flex py-6">
                      <div className="shrink-0">
                        <img
                          src={imageSrc}
                          alt={product.nombre}
                          className="h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <h3 className="text-sm">
                              <Link
                                to={`/productos/${product.productoId}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.nombre}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.marca}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              ${Number(product.precio).toLocaleString("es-CO")}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div className="flex items-center border rounded-md w-fit">
                              <button
                                onClick={() =>
                                  updateQuantity(product.productoId, quantity - 1)
                                }
                                className="px-3 py-1"
                              >
                                <FiMinus />
                              </button>
                              <span className="px-3 py-1">{quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(product.productoId, quantity + 1)
                                }
                                className="px-3 py-1"
                              >
                                <FiPlus />
                              </button>
                            </div>

                            <button
                              onClick={() => removeProduct(product.productoId)}
                              className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-8 text-center text-gray-500">
                Tu carrito está vacío.
              </p>
            )}
          </section>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:p-8">
            <h2 className="text-lg font-medium">Resumen del pedido</h2>

            <div className="flex justify-between py-4">
              <p>Subtotal</p>
              <p className="font-medium">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <div className="flex justify-between border-t pt-4">
              <p className="font-medium">Total</p>
              <p className="font-medium">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <div className="mt-6">
              {ordenId ? (
                <CheckoutButton
                  ordenId={ordenId}
                  usuarioId={usuarioId}
                  monto={subtotal}
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Generando orden...
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
