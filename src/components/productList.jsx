import { useEffect } from 'react';
import useProductStore from '../store/useProductStore'; // Asegúrate que la ruta sea correcta
import { ProductCard } from './ProductCard';

export const ProductList = () => {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div className="text-center py-10">Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error al cargar los productos: {error.message}</p>
        <p className="text-sm text-gray-500 mt-2">Asegúrate de que tu API esté corriendo en `https://localhost:4000`.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Nuestros Productos</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => {
            const key = product?.productoId ?? product?.productId ?? product?.id ?? product?._id ?? Math.random();
            return <ProductCard key={key} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
};
