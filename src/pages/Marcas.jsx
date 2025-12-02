import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../store/useProductStore";
import { motion, AnimatePresence } from "framer-motion";

const BrandCard = ({ name, imageUrl, productCount }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Link
        to={`/search?q=${encodeURIComponent(name)}`}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Imagen de fondo con efecto de zoom */}
        <motion.img
          src={imageUrl}
          alt={`Logo de ${name}`}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Curva de easing suave
        />
        {/* Capa de gradiente para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Contenido de la tarjeta */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center text-white">
          <motion.h3
            className="font-serif text-3xl font-bold uppercase"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {name}
          </motion.h3>
          <AnimatePresence>
            {isHovered && (
              <motion.p
                className="mt-1 rounded-full bg-white/25 px-4 py-1 text-xs font-semibold backdrop-blur-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {productCount} {productCount === 1 ? "producto" : "productos"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  );
};

export const Marcas = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const brands = useMemo(() => {
    if (!products || products.length === 0) return [];
    const brandsMap = new Map();
    products.forEach((product) => {
      if (product.marca) {
        if (!brandsMap.has(product.marca)) {
          brandsMap.set(product.marca, {
            name: product.marca,
            imageUrl:
              product.imagenUrl ||
              "https://via.placeholder.com/600?text=El+Zar",
            productCount: 0,
          });
        }
        brandsMap.get(product.marca).productCount += 1;
      }
    });
    return Array.from(brandsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products]);

  if (loading && brands.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        Cargando nuestras marcas...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white min-h-screen">
      {/* Encabezado Inmersivo */}
      <div className="relative overflow-hidden pt-32 pb-20 text-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <motion.h1
            className="font-serif text-5xl font-bold tracking-tight text-white sm:text-7xl"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Universo de Marcas
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Descubre las historias detrás de cada fragancia. Una colección
            curada de las casas de perfumes más prestigiosas del mundo.
          </motion.p>
        </div>
      </div>

      {/* Galería de Marcas */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {brands.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {brands.map((brand) => (
              <BrandCard key={brand.name} {...brand} />
            ))}
          </motion.div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400">
              No se encontraron marcas para mostrar.
            </p>
          )
        )}
      </div>
    </div>
  );
};
