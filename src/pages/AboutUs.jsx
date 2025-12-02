import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import useProductStore from "../store/useProductStore";

export const AboutUs = () => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Seleccionamos algunas imágenes de productos para usar en la página
  const image1 = useMemo(
    () => products[0]?.imagenUrl || "https://via.placeholder.com/800x1000",
    [products]
  );
  const image2 = useMemo(
    () => products[1]?.imagenUrl || "https://via.placeholder.com/800x1000",
    [products]
  );

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white overflow-x-hidden">
      {/* Encabezado */}
      <div className="relative flex h-[60vh] items-center justify-center text-center">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={image1}
            alt="Sobre Nosotros"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        </motion.div>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="font-serif text-5xl font-bold sm:text-7xl">
            El Arte de la Esencia
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Descubre la historia y la pasión detrás de El Zar.
          </p>
        </motion.div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <motion.div
            className="lg:pr-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <p className="font-semibold uppercase tracking-widest text-[#D4AF37]">
                Nuestra Filosofía
              </p>
              <h2 className="mt-2 font-serif text-4xl font-bold">
                Cada fragancia cuenta una historia.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                En El Zar, creemos que un perfume es más que un aroma; es una
                extensión de tu identidad. Fundada con la pasión de ofrecer
                fragancias únicas y memorables, nuestra misión es ayudarte a
                descubrir tu esencia y expresarla a través de perfumes
                excepcionales.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Seleccionamos cuidadosamente cada producto de marcas reconocidas
                mundialmente, garantizando calidad y originalidad. Desde
                clásicos atemporales hasta las últimas novedades, nuestra
                colección está diseñada para satisfacer los gustos más
                exigentes.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="h-[600px] min-h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={image2}
              alt="Producto destacado"
              className="h-full w-full rounded-3xl object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
