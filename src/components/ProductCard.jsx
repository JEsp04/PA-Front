import { FiShoppingCart } from 'react-icons/fi';

export const ProductCard = ({ product }) => {
  const {
    image = product.imagenUrl,
    name = product.nombre,
    brand = product.marca,
    price = product.precio,
  } = product || {};

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img src={image} alt={`Imagen de ${name}`} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <a href="#">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </a>
        </h3>
        <p className="text-sm text-gray-500">{brand}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-semibold text-gray-900">${price.toLocaleString('es-CO')}</p>
        </div>
      </div>
       <button className="absolute bottom-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-[#D4AF37] text-[#0A0A0A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110" aria-label="Añadir al carrito">
          <FiShoppingCart className="w-5 h-5" />
        </button>
    </div>
  );
};