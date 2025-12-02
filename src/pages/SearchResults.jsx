import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useProductStore from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { products = [], fetchProducts, loading, error } = useProductStore();

  useEffect(() => {
    // Asegurarnos de tener los productos cargados
    if (!products || products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products]);

  // Usar los campos reales del backend: nombre y marca (no name/brand)
  const q = query.toLowerCase();
  const filteredProducts = (products || []).reduce((acc, product) => {
    const match =
      (product?.nombre ?? "").toLowerCase().includes(q) ||
      (product?.marca ?? "").toLowerCase().includes(q);

    // FIX: Evita duplicados.
    // Si el producto coincide y aún no está en la lista (verificando por productoId), lo agregamos.
    if (match && !acc.some((p) => p.productoId === product.productoId)) {
      acc.push(product);
    }

    return acc;
  }, []);

  if (loading) return <div className="text-center py-10">Buscando...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error al buscar productos.
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Resultados para: <span className="text-[#B8860B]">{query}</span>
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.productoId} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 mt-6">
            <p className="text-lg text-gray-300">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-[#B8860B] hover:underline"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
