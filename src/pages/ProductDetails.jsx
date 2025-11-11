import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProductStore from '../store/useProductStore';

export const ProductDetails = () => {
  const params = useParams();
  console.log('[ProductDetails] params:', params);

  // El ID viene de la URL, definido en App.jsx como :productId
  const productId = params.productId ? Number(params.productId) : null;

  // usa selectores individuales para reducir re-renders y dependencias
  const selectedProduct = useProductStore(state => state.selectedProduct);
  const fetchProductById = useProductStore(state => state.fetchProductById);
  const loading = useProductStore(state => state.loading);
  const error = useProductStore(state => state.error);

  useEffect(() => {
    // solo llamar si es un número válido (finite)
    if (!Number.isFinite(productId)) return;
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  console.log('[ProductDetails] selectedProduct:', selectedProduct, 'loading:', loading, 'error:', error);

  if (loading) return <div className="text-center py-10">Cargando detalles del producto...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error.message || 'No se pudo cargar el producto.'}</div>;
  if (!selectedProduct) return <div className="text-center py-10">Producto no encontrado. <Link to="/" className="text-[#B8860B] hover:underline">Volver al inicio</Link></div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img src={selectedProduct.imagenUrl} alt={selectedProduct.nombre} className="w-full aspect-square object-cover rounded-lg shadow-md"/>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{selectedProduct.nombre}</h1>
            <h2 className="text-xl text-gray-500 mt-2">{selectedProduct.marca}</h2>
            <p className="text-gray-700 mt-4">{selectedProduct.descripcion || 'Descripción no disponible'}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">${(selectedProduct.precio ?? 0).toLocaleString('es-CO')}</p>
            <button className="mt-6 bg-[#D4AF37] hover:bg-[#B8860B] text-[#0A0A0A] font-bold py-3 px-8 rounded-md transition-colors duration-200">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};