
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore"; 
import { Link } from "react-router-dom";

export const Cart = () => {
  const { user } = useAuthStore();

  const {
    items,
    loadCart,
    updateQuantity,
    removeProduct,
    getTotalItems,
    loading,
  } = useCartStore();

  useEffect(() => {
    if (user?.usuarioId) {
      loadCart(user.usuarioId);
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10">Cargando carrito...</p>;

  const subtotal = items.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.precioUnitario || item.product?.precio || 0),
    0
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Carrito de Compras
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">

          {/* LISTA DEL CARRITO */}
          <section className="lg:col-span-7">
            {items.length > 0 ? (
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {items.map((item) => {
                  const product = item.product || item.producto || {};
                  const imageSrc =
                    product?.imagenUrl || product?.imagen || "https://via.placeholder.com/150";

                  const qty = item.quantity ?? item.cantidad ?? 1;

                  return (
                    <li key={item.productoId || product.productoId} className="flex py-6">
                      <div className="shrink-0">
                        <img
                          src={imageSrc}
                          alt={product?.nombre}
                          className="h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">

                          {/* Info */}
                          <div>
                            <h3 className="text-sm">
                              <Link
                                to={`/productos/${item.productoId || product.productoId}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product?.nombre}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{product?.marca}</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              ${Number(product?.precio || item.precioUnitario || 0).toLocaleString("es-CO")}
                            </p>
                          </div>

                          {/* Controles */}
                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div className="flex items-center border rounded-md w-fit">

                              <button
                                onClick={() => {
                                  const newQty = Math.max(1, qty - 1);
                                  updateQuantity(user.usuarioId, item.productoId || product.productoId, newQty);
                                }}
                                className="px-3 py-1"
                                disabled={qty <= 1}
                              >
                                <FiMinus />
                              </button>

                              <span className="px-3 py-1">{qty}</span>

                              <button
                                onClick={() => {
                                  const newQty = qty + 1;
                                  updateQuantity(user.usuarioId, item.productoId || product.productoId, newQty);
                                }}
                                className="px-3 py-1"
                              >
                                <FiPlus />
                              </button>
                            </div>

                            {/* ELIMINAR */}
                            <button
                              onClick={() =>
                                removeProduct(user.usuarioId, item.productoId || product.productoId)
                              }
                              className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                              aria-label="Eliminar"
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
              <p className="py-8 text-center text-gray-500">Tu carrito está vacío.</p>
            )}
          </section>

          {/* RESUMEN */}
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:p-8">
            <h2 className="text-lg font-medium">Resumen del pedido</h2>

            <div className="flex justify-between py-4">
              <p>Subtotal</p>
              <p className="font-medium">${subtotal.toLocaleString("es-CO")}</p>
            </div>

            <div className="flex justify-between border-t pt-4">
              <p className="font-medium">Total</p>
              <p className="font-medium">${subtotal.toLocaleString("es-CO")}</p>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-[#D4AF37] py-3 px-4 text-base font-bold text-[#0A0A0A] hover:bg-[#B8860B]"
              >
                Pagar ahora
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
