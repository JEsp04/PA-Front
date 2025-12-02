import { useEffect, useMemo } from "react";
import useProductStore from "../store/useProductStore";
import { ProductCard } from "../components/ProductCard";
import { motion } from "framer-motion";

export const Offers = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Simulamos una selección de productos en oferta (los primeros 12)
  const offerProducts = useMemo(() => {
    // En un caso real, aquí filtrarías por `product.onSale === true` o similar
    return products.slice(4, 16);
  }, [products]);

  // Muestra una pantalla de carga mientras se obtienen los productos por primera vez.
  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold">Buscando Ofertas...</h1>
          <p className="mt-2 text-lg text-gray-300">Un momento, por favor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white min-h-screen">
      {/* Encabezado */}
      <div className="relative overflow-hidden pt-32 pb-20 text-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="font-serif text-5xl font-bold tracking-tight text-white sm:text-7xl"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Ofertas Exclusivas
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Aprovecha descuentos por tiempo limitado en tus fragancias
            favoritas.
          </motion.p>
        </motion.div>
      </div>

      {/* Galería de Ofertas */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {offerProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {offerProducts.map((product) => (
              <div key={product.productoId} className="relative">
                <ProductCard product={product} />
                <div className="absolute top-0 right-0 m-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  -15%
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-400">
            No hay ofertas disponibles en este momento.
          </p>
        )}
      </div>
    </div>
  );
};
