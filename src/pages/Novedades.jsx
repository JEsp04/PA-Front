import { useEffect, useMemo } from "react";
import useProductStore from "../store/useProductStore";
import { ProductCard } from "../components/ProductCard"; // Asegúrate que la importación sea nombrada
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";

export const Novedades = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Obtenemos los 5 productos más recientes para las distintas secciones
  const latestProducts = useMemo(() => {
    return [...products].reverse().slice(0, 5);
  }, [products]);

  // El producto más nuevo de todos para destacarlo.
  const featuredProduct = useMemo(() => {
    return latestProducts.length > 0 ? latestProducts[0] : null;
  }, [latestProducts]);

  const otherNewProducts = useMemo(
    () => latestProducts.slice(1),
    [latestProducts]
  );

  if (loading && latestProducts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white">
        Descubriendo lo último...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white">
      {/* SECCIÓN 1: HERO CON VIDEO DE FONDO */}
      {featuredProduct && (
        <div className="relative flex min-h-screen items-center justify-center text-center">
          {/* Video de fondo */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <video
              src="https://www.pexels.com/es-es/download/video/4154241/"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </motion.div>

          <motion.div
            className="relative z-10 flex flex-col items-center p-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          >
            <p className="font-semibold uppercase tracking-widest text-[#D4AF37]">
              La Última Creación
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-6xl font-bold text-white sm:text-8xl">
              {featuredProduct.nombre}
            </h1>
            <Link
              to={`/productos/${featuredProduct.productoId}`}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-10 py-4 text-lg font-bold text-[#0A0A0A] transition-all duration-300 hover:scale-105 hover:bg-[#c5a031] hover:shadow-lg hover:shadow-yellow-500/20"
            >
              Explorar{" "}
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      )}

      {/* SECCIÓN 2: ALIANZA FICTICIA */}
      <div className="bg-[#111] py-20 sm:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-semibold uppercase tracking-widest text-[#D4AF37]">
              Edición Limitada
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
              EL ZAR x AURA
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Una colaboración sin precedentes que fusiona la opulencia de El
              Zar con el diseño vanguardista de los estudios AURA. Una fragancia
              que redefine el lujo moderno.
            </p>
           
          </motion.div>
          <motion.div
            className="aspect-square"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <img
              src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Colaboración El Zar x Aura"
              className="h-full w-full rounded-2xl object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* SECCIÓN 3: EVENTO DE LANZAMIENTO */}
      <div className="relative py-20 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/35016222/pexels-photo-35016222.png"
            alt="Fondo evento"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-4xl font-bold sm:text-5xl">
              Noche de Esencias: El Lanzamiento
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Únete a nosotros para una velada exclusiva donde presentaremos
              nuestras últimas creaciones. Una experiencia sensorial con música
              en vivo, cócteles y sorpresas.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#D4AF37]" />
                <span className="font-semibold">30 de Diciembre, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-[#D4AF37]" />
                <span className="font-semibold">
                  Museo El Castillo, Medellín
                </span>
              </div>
            </div>
           
          </motion.div>
        </div>
      </div>

      {/* SECCIÓN 4: SEDES FÍSICAS */}
      <div className="bg-[#111] py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-4xl font-bold sm:text-5xl">
              Visita Nuestras Boutiques
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Sumérgete en una experiencia sensorial única en nuestros espacios
              físicos.
            </p>
          </motion.div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img
                src="https://images.pexels.com/photos/35016311/pexels-photo-35016311.png"
                alt="Boutique Bogotá"
                className="mb-4 aspect-video w-full rounded-xl object-cover"
              />
              <h3 className="text-xl font-bold">Bogotá - El Retiro</h3>
              <p className="text-gray-400">C.C. Andino, Local 301</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img
                src="https://images.pexels.com/photos/35016456/pexels-photo-35016456.png"
                alt="Boutique Medellín"
                className="mb-4 aspect-video w-full rounded-xl object-cover"
              />
              <h3 className="text-xl font-bold">Medellín - El Tesoro</h3>
              <p className="text-gray-400">
                Parque Comercial El Tesoro, Burbuja 5
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <img
                src="https://images.pexels.com/photos/35016482/pexels-photo-35016482.png"
                alt="Boutique Cartagena"
                className="mb-4 aspect-video w-full rounded-xl object-cover"
              />
              <h3 className="text-xl font-bold">
                Cartagena - Ciudad Amurallada
              </h3>
              <p className="text-gray-400">Calle de la Iglesia, #35-22</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: GALERÍA DEL RESTO DE NOVEDADES */}
      <div className="py-20 sm:py-32">
        <h2 className="mb-16 text-center font-serif text-4xl font-bold">
          Más Para Descubrir
        </h2>
        {otherNewProducts.length > 0 ? (
          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {otherNewProducts.map((product) => (
              <ProductCard key={product.productoId} product={product} />
            ))}
          </motion.div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400">
              No hay más novedades por ahora.
            </p>
          )
        )}
      </div>
    </div>
  );
};
