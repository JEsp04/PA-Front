import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { FiCheckCircle, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';


export const Cart = () => {
  const { items, updateQuantity, removeProduct } = useCartStore();
  const location = useLocation();
  const productAdded = location.state?.productAdded;

  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.product.precio) || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Carrito de Compras</h1>

        {productAdded && (
          <div className="mt-6 flex items-center space-x-2 rounded-md bg-green-50 p-4 text-green-700">
            <FiCheckCircle className="h-5 w-5" />
            <p>¡"<span className="font-semibold">{productAdded}</span>" fue añadido a tu carrito!</p>
          </div>
        )}

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Artículos en tu carrito</h2>
            {items.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {items.map(({ product, quantity }) => {
                  const imageSrc = product?.imagenUrl ?? product?.imagen ?? 'https://via.placeholder.com/150';
                  const precioUnitario = Number(product.precio) || 0;

                  return (
                    <li key={product.productoId} className="flex py-6">
                      <div className="flex-shrink-0">
                        <img
                          src={imageSrc}
                          alt={product.nombre}
                          className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <h3 className="text-sm">
                              <Link to={`/productos/${product.productoId}`} className="font-medium text-gray-700 hover:text-gray-800">
                                {product.nombre}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{product.marca}</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">${precioUnitario.toLocaleString('es-CO')}</p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div className="flex items-center rounded-md border border-gray-300 w-fit sm:float-right">
                              <button onClick={() => updateQuantity(product.productoId, quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md transition" aria-label="Disminuir cantidad"><FiMinus /></button>
                              <span className="px-3 py-1 text-base font-medium text-gray-800">{quantity}</span>
                              <button onClick={() => updateQuantity(product.productoId, quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md transition" aria-label="Aumentar cantidad"><FiPlus /></button>
                            </div>

                            <div className="absolute top-0 right-0">
                              <button onClick={() => removeProduct(product.productoId)} className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition">
                                <span className="sr-only">Eliminar</span>
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
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

          {/* Resumen del pedido */}
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Resumen del pedido</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${subtotal.toLocaleString('es-CO')}</dd>
              </div>
              {/* Aquí puedes añadir más detalles como envío, impuestos, etc. */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total del pedido</dt>
                <dd className="text-base font-medium text-gray-900">${subtotal.toLocaleString('es-CO')}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <button className="w-full rounded-md border border-transparent bg-[#D4AF37] py-3 px-4 text-base font-bold text-[#0A0A0A] shadow-sm hover:bg-[#B8860B]">Proceder al Pago</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};