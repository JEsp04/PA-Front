import { Link } from "react-router-dom";

// Componente con diseño limpio para fondos blancos, usado en la página de detalles.
export const RelatedProductCard = ({ product }) => {
  // Normalización de datos para asegurar que el componente siempre funcione
  const normalizedProduct = {
    id: product?.productoId ?? product?.id,
    nombre: product?.nombre ?? "Producto sin nombre",
    marca: product?.marca ?? "Marca desconocida",
    precio: Number(product?.precio ?? 0),
    imagenUrl: product?.imagenUrl ?? null,
  };

  const precioDisplay = `$${normalizedProduct.precio.toLocaleString("es-CO")}`;
  const placeholder = "https://via.placeholder.com/400x400?text=Sin+imagen";

  return (
    <Link
      to={`/productos/${normalizedProduct.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={normalizedProduct.imagenUrl ?? placeholder}
          alt={normalizedProduct.nombre}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          {normalizedProduct.nombre}
        </h3>
        <p className="text-sm text-gray-500">{normalizedProduct.marca}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-semibold text-gray-900">
            {precioDisplay}
          </p>
        </div>
      </div>
    </Link>
  );
};
