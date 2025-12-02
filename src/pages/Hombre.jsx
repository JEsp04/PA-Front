import { useEffect, useMemo } from "react";
import useProductStore from "../store/useProductStore";
import { ProductCard } from "../components/ProductCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export const Hombre = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Filtro más flexible para productos de hombre
  const menProducts = useMemo(() => {
    return products.filter((p) => {
      const genderField = (p.genero || p.categoria || "").toLowerCase();
      const nameField = (p.nombre || "").toLowerCase();

      return (
        genderField.includes("hombre") ||
        genderField.includes("masculino") ||
        nameField.includes("hombre") ||
        nameField.includes("man") ||
        nameField.includes("homme")
      );
    });
  }, [products]);

  const featuredProduct = useMemo(
    () => (menProducts.length > 0 ? menProducts[0] : null),
    [menProducts]
  );

  const otherProducts = useMemo(() => menProducts.slice(1, 9), [menProducts]);

  if (loading && menProducts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white">
        Cargando colección...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white">
      {/* SECCIÓN 1: HERO CON VIDEO */}
      <div className="relative flex min-h-screen items-center justify-center text-center">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <video
            src="https://www.pexels.com/es-es/download/video/1705055/"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </motion.div>

        <motion.div
          className="relative z-10 flex flex-col items-center p-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        >
          <h1 className="font-serif text-6xl font-bold text-white sm:text-8xl">
            Firma Masculina
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-200">
            Fragancias con carácter, diseñadas para el hombre que deja una
            huella imborrable.
          </p>
        </motion.div>
      </div>

      {/* SECCIÓN 2: PRODUCTO DESTACADO */}
      {featuredProduct && (
        <div className="bg-[#111] py-20 sm:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
            <motion.div
              className="aspect-square"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src={featuredProduct.imagenUrl}
                alt={featuredProduct.nombre}
                className="h-full w-full rounded-2xl object-cover shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <p className="font-semibold uppercase tracking-widest text-[#D4AF37]">
                El Sello de la Colección
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
                {featuredProduct.nombre}
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                {featuredProduct.descripcion.length > 150
                  ? `${featuredProduct.descripcion.substring(0, 150)}...`
                  : featuredProduct.descripcion}
              </p>
              <Link
                to={`/productos/${featuredProduct.productoId}`}
                className="group mt-8 inline-flex items-center gap-2 font-bold text-[#D4AF37]"
              >
                Ver detalles{" "}
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: GALERÍA DE PRODUCTOS */}
      <div className="py-20 sm:py-32">
        <h2 className="mb-16 text-center font-serif text-4xl font-bold">
          Explora la Selección
        </h2>
        {otherProducts.length > 0 ? (
          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {otherProducts.map((product) => (
              <ProductCard key={product.productoId} product={product} />
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-400">
            No se encontraron productos para hombre.
          </p>
        )}
      </div>
    </div>
  );
};
