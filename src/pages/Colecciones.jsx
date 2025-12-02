import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import useProductStore from "../store/useProductStore";
import { ProductCard } from "../components/ProductCard";

// Importa Swiper y sus componentes/estilos
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Navigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// --- DATOS DE LAS COLECCIONES ---
const collectionsData = [
  {
    title: "Colección Nocturna",
    description:
      "Fragancias intensas y misteriosas, diseñadas para la noche. Notas de cuero, maderas ahumadas y especias exóticas.",
    image: "https://images.pexels.com/photos/1895015/pexels-photo-1895015.jpeg",
    notasClave: "Cuero, Incienso, Oud", // bgImage eliminado
    keywords: ["noir", "night", "intense", "black", "oud"],
  },
  {
    title: "Colección Solstice",
    description:
      "Un tributo a la luz y la energía del sol. Aromas cítricos, frescos y vibrantes que evocan la calidez de un día de verano.",
    image: "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg",
    notasClave: "Bergamota, Neroli, Ámbar", // bgImage eliminado
    keywords: ["fresh", "aqua", "blue", "sport", "light", "summer"],
  },
  {
    title: "Colección Terra",
    description:
      "La esencia de la tierra capturada en una botella. Composiciones ricas en vetiver, pachulí y musgo, que te conectan con la naturaleza.",
    image: "https://images.pexels.com/photos/7797110/pexels-photo-7797110.jpeg",
    notasClave: "Vetiver, Musgo de Roble, Pachulí", // bgImage eliminado
    keywords: ["terra", "earth", "vetiver", "green", "woods"],
  },
];

export const Colecciones = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // --- CARGA DE PRODUCTOS ---
  const { products, fetchProducts } = useProductStore();
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Seleccionamos 8 productos para destacar
  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  const activeCollection = collectionsData[activeIndex];

  return (
    <div className="relative min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] text-white">
      {/* Fondo estático y elegante */}

      {/* --- SECCIÓN 1: RUEDA OLFACTIVA --- */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-between p-4 py-16 sm:py-24">
        {/* --- TÍTULO SUPERIOR --- */}
        <motion.div
          className="text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Elige tu Universo
          </h1>
          <p className="mt-2 text-base text-gray-300 sm:text-lg">
            Sumérgete en una nueva historia.
          </p>
        </motion.div>

        {/* --- RUEDA OLFACTIVA (SWIPER) --- */}
        <div className="w-full">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: false,
            }}
            navigation={true} // Habilita las flechas de navegación
            modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-[60vh] max-h-[500px]"
          >
            {collectionsData.map((collection, index) => (
              <SwiperSlide
                key={index}
                className="w-[45vh] h-[55vh] self-center"
              >
                {/* El Link ha sido removido para que las tarjetas no sean clicables */}
                <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="font-serif text-3xl font-bold">
                      {collection.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- INFORMACIÓN DE LA COLECCIÓN ACTIVA --- */}
        <motion.div
          key={activeCollection.title}
          className="w-full max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            {activeCollection.title}
          </h2>
          <p className="mt-2 text-base text-gray-300 sm:text-lg">
            {activeCollection.description}
          </p>
          <div className="mt-6 ">
            {" "}
            {/* Aumentado el margen superior de mt-4 a mt-6 */}
            <p className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
              Notas Clave
            </p>
            <p className="text-base text-gray-200">
              {activeCollection.notasClave}
            </p>
          </div>
        </motion.div>
      </div>

      {/* --- SECCIÓN 2: PERFUMES DESTACADOS --- */}
      {/* Se ha eliminado la línea separadora de arriba */}
      {featuredProducts.length > 0 && (
        <div className="w-full bg-[#0A0A0A] py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-4xl font-bold text-white sm:text-5xl">
                Perfumes Destacados
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
                Una selección curada de nuestras fragancias más icónicas y
                deseadas.
              </p>
            </motion.div>

            <motion.div
              className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.productoId} product={product} />
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
