import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/ProductCard';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { products = [], fetchProducts, loading, error } = useProductStore();

  useEffect(() => {
    // Asegurarnos de tener los productos cargados
    if (!products || products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products]);

  // Usar los campos reales del backend: nombre y marca (no name/brand)
  const q = query.toLowerCase();
  const filteredProducts = (products || []).filter(product =>
    (product?.nombre ?? '').toLowerCase().includes(q) ||
    (product?.marca ?? '').toLowerCase().includes(q)
  );

  if (loading) return <div className="text-center py-10">Buscando...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error al buscar productos.</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Resultados para: <span className="text-[#B8860B]">{query}</span>
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product?.productId ?? product?.id ?? product?._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 mt-6">
            <p className="text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
            <Link to="/" className="mt-4 inline-block text-[#B8860B] hover:underline">Volver al inicio</Link>
          </div>
        )}
      </div>
    </div>
  );
};