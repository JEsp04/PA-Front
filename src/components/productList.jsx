import { useEffect } from "react";
import useProductStore from "../store/useProductStore"; // Asegúrate que la ruta sea correcta
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

export const ProductList = () => {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-300">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-400">
        <p>Error al cargar los productos: {error.message}</p>
        <p className="mt-2 text-sm text-gray-500">
          Asegúrate de que tu API esté corriendo.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => {
        const key =
          product?.productoId ??
          product?.productId ??
          product?.id ??
          product?._id ??
          Math.random();
        return <ProductCard key={key} product={product} />;
      })}
    </motion.div>
  );
};
