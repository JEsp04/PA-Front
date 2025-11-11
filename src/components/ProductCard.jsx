import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  console.log('[ProductCard] product:', product);

  // id robusto: acepta productId, id o _id (si no existe, no envolver en Link)
  const id = product?.productId ?? product?.id ?? product?._id ?? null;

  // posibles nombres para la imagen
  const imageSrc =
    product?.imagenUrl ??
    product?.imagen ??
    product?.image ??
    product?.imagen_url ??
    (Array.isArray(product?.fotos) && product.fotos[0]?.url) ??
    null;

  const nombre = product?.nombre ?? product?.title ?? product?.name ?? 'Nombre no disponible';
  const marca = product?.marca ?? product?.brand ?? 'Marca desconocida';
  const precioRaw = product?.precio ?? product?.price ?? 0;
  const precio = Number(precioRaw) || 0;
  const precioDisplay = `$${precio.toLocaleString('es-CO')}`;

  // Si no hay imagen, puedes usar placeholder
  const placeholder = 'https://via.placeholder.com/400x400?text=Sin+imagen';

  const cardContent = (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageSrc ?? placeholder}
          alt={nombre}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <span aria-hidden="true" className="absolute inset-0" />
          {nombre}
        </h3>
        <p className="text-sm text-gray-500">{marca}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-semibold text-gray-900">{precioDisplay}</p>
        </div>
      </div>
      <button
        className="absolute bottom-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-[#D4AF37] text-[#0A0A0A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110"
        aria-label="Añadir al carrito"
        type="button"
      >
        <FiShoppingCart className="w-5 h-5" />
      </button>
    </div>
  );

  // Si hay id, envolver en Link; si no, devolver sólo la tarjeta (evita "Producto sin id")
  if (id) {
    // usar la ruta que tienes en App.jsx (/productos/:productId)
    return (
      <Link to={`/productos/${id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  // Sin id: renderizar la tarjeta sin Link y loguear advertencia
  return <div className="block">{cardContent}</div>;
};

export default ProductCard;